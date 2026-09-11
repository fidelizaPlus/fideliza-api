import { InMemoryUserRepository } from '@/users/app/test/in-memory/in-memory-user-repository';
import { InMemoryCampaignRepository } from './in-memory/in-memory-campaign-repository';
import { PublishCampaignService } from '../services/publishCampaign.service';
import { Role } from '@/users/domain/enum/user.enum';
import { randomUUID } from 'crypto';
import { daysFromNow } from './helpers/date.helper';
import { Status } from '@/campaign/domain/enum/status.enum';
import { ManagerNotFound } from '../Error/manager-not-found';
import { NotManager } from '../Error/not-manager';
import { CampaignNotFound } from '../Error/campaign-not-found';
import { NotCampaignOwner } from '../Error/not-campaign-owner';
import { CampaignNotDraft } from '../Error/campaign-not-draft';
import { CampaignAlreadyExpired } from '../Error/campaign-already-expired';
import { vi } from 'vitest';

describe('Publish campaign and update status', () => {
  let campaignRepository: InMemoryCampaignRepository;
  let userRepository: InMemoryUserRepository;
  let sut: PublishCampaignService;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-10T12:00:00.000Z'));
    campaignRepository = new InMemoryCampaignRepository();
    userRepository = new InMemoryUserRepository();
    sut = new PublishCampaignService(campaignRepository, userRepository);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should schedule a draft campaign when the start date is in the future', async () => {
    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    const campaign = await campaignRepository.createCampaign({
      managerId: manager.id,
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(1),
      endDate: daysFromNow(7),
    });

    const result = await sut.publish(manager.id, campaign.id);

    expect(result).toEqual({ ...campaign, status: Status.SCHEDULED });
    const savedCampaign = await campaignRepository.findCampaignById(campaign.id);
    expect(savedCampaign).toEqual(result);
  });

  it('should activate a draft campaign when the start date is in the past', async () => {
    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    const campaign = await campaignRepository.createCampaign({
      managerId: manager.id,
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(-1),
      endDate: daysFromNow(7),
    });

    const result = await sut.publish(manager.id, campaign.id);

    expect(result).toEqual({ ...campaign, status: Status.ACTIVE });
    const savedCampaign = await campaignRepository.findCampaignById(campaign.id);
    expect(savedCampaign).toEqual(result);
  });

  it('should activate a draft campaign when the start date equals the current time', async () => {
    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    const campaign = await campaignRepository.createCampaign({
      managerId: manager.id,
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.DRAFT,
      startDate: new Date(),
      endDate: daysFromNow(7),
    });

    const result = await sut.publish(manager.id, campaign.id);

    expect(result).toEqual({ ...campaign, status: Status.ACTIVE });
    const savedCampaign = await campaignRepository.findCampaignById(campaign.id);
    expect(savedCampaign).toEqual(result);
  });

  it('should throw ManagerNotFound when the manager does not exist', async () => {
    await expect(sut.publish(randomUUID(), randomUUID())).rejects.toBeInstanceOf(ManagerNotFound);
  });

  it('should throw NotManager when the user is not a manager', async () => {
    const client = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.CLIENT,
    });

    await expect(sut.publish(client.id, randomUUID())).rejects.toBeInstanceOf(NotManager);
  });

  it('should throw CampaignNotFound when the campaign does not exist', async () => {
    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    await expect(sut.publish(manager.id, randomUUID())).rejects.toBeInstanceOf(CampaignNotFound);
  });

  it('should throw NotCampaignOwner when the campaign belongs to another manager', async () => {
    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    const otherManager = await userRepository.createUser({
      name: 'Larry Paw',
      email: 'larrypaw@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    const campaign = await campaignRepository.createCampaign({
      managerId: manager.id,
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(1),
      endDate: daysFromNow(7),
    });

    await expect(sut.publish(otherManager.id, campaign.id)).rejects.toBeInstanceOf(
      NotCampaignOwner,
    );
    expect(await campaignRepository.findCampaignById(campaign.id)).toEqual(campaign);
  });

  it.each([Status.SCHEDULED, Status.ACTIVE, Status.FINISHED, Status.CANCELLED])(
    'should throw CampaignNotDraft when the campaign status is %s',
    async (status) => {
      const manager = await userRepository.createUser({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        authUserId: randomUUID(),
        role: Role.MANAGER,
      });

      const campaign = await campaignRepository.createCampaign({
        managerId: manager.id,
        title: 'Summer campaign',
        description: 'Promotional summer campaign',
        status: status,
        startDate: daysFromNow(1),
        endDate: daysFromNow(7),
      });

      await expect(sut.publish(manager.id, campaign.id)).rejects.toBeInstanceOf(CampaignNotDraft);
      expect(await campaignRepository.findCampaignById(campaign.id)).toEqual(campaign);
    },
  );

  it('should throw CampaignAlreadyExpired when the end date is in the past', async () => {
    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    const campaign = await campaignRepository.createCampaign({
      managerId: manager.id,
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(-7),
      endDate: daysFromNow(-1),
    });

    await expect(sut.publish(manager.id, campaign.id)).rejects.toBeInstanceOf(
      CampaignAlreadyExpired,
    );
    expect(await campaignRepository.findCampaignById(campaign.id)).toEqual(campaign);
  });

  it('should throw CampaignAlreadyExpired when the end date equals the current time', async () => {
    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    const campaign = await campaignRepository.createCampaign({
      managerId: manager.id,
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(-7),
      endDate: new Date(),
    });

    await expect(sut.publish(manager.id, campaign.id)).rejects.toBeInstanceOf(
      CampaignAlreadyExpired,
    );
    expect(await campaignRepository.findCampaignById(campaign.id)).toEqual(campaign);
  });
});
