import { InMemoryUserRepository } from '@/users/app/test/in-memory/in-memory-user-repository';
import { CreateCampaignService } from '../services/createCampaign.service';
import { InMemoryCampaignRepository } from './in-memory/in-memory-campaign-repository';
import { randomUUID } from 'crypto';
import { Role } from '@/users/domain/enum/user.enum';
import { Status } from '@/campaign/domain/enum/status.enum';
import { NotManager } from '../Error/not-manager';
import { ManagerNotFound } from '../Error/manager-not-found';
import { InvalidDate } from '../Error/invalid-date';
import { CampaignStartDateInPast } from '../Error/startDate-past';
import { InvalidCampaignDate } from '../Error/invalid-campaign-date';
import { daysFromNow } from './helpers/date.helper';

describe('Create campaign test', () => {
  let campaignRepository: InMemoryCampaignRepository;
  let userRepository: InMemoryUserRepository;
  let sut: CreateCampaignService;
  beforeEach(() => {
    campaignRepository = new InMemoryCampaignRepository();
    userRepository = new InMemoryUserRepository();
    sut = new CreateCampaignService(campaignRepository, userRepository);
  });

  it('should create a campaign', async () => {
    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    const campaign = await sut.campaignCreate({
      managerId: manager.id,
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      startDate: daysFromNow(1),
      endDate: daysFromNow(7),
    });

    expect(campaign.managerId).toBe(manager.id);
    expect(campaign.title).toBe('Summer campaign');
    expect(campaign.description).toBe('Promotional summer campaign');
    expect(campaign.status).toBe(Status.DRAFT);
    expect(campaignRepository.items).toHaveLength(1);
  });

  it('should not create campaign if user is not a manager', async () => {
    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.CLIENT,
    });

    await expect(
      sut.campaignCreate({
        managerId: manager.id,
        title: 'Summer campaign',
        description: 'Promotional summer campaign',
        startDate: daysFromNow(1),
        endDate: daysFromNow(7),
      }),
    ).rejects.toBeInstanceOf(NotManager);
    expect(campaignRepository.items).toHaveLength(0);
  });

  it('should not create a campaign if manager does not exist', async () => {
    await expect(
      sut.campaignCreate({
        managerId: '',
        title: 'Summer campaign',
        description: 'Promotional summer campaign',
        startDate: daysFromNow(1),
        endDate: daysFromNow(7),
      }),
    ).rejects.toBeInstanceOf(ManagerNotFound);
    expect(campaignRepository.items).toHaveLength(0);
  });

  it('should not create a campaign if start date is invalid', async () => {
    const invalidDate = new Date('invalid-date');

    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    await expect(
      sut.campaignCreate({
        managerId: manager.id,
        title: 'Summer campaign',
        description: 'Promotional summer campaign',
        startDate: invalidDate,
        endDate: daysFromNow(7),
      }),
    ).rejects.toBeInstanceOf(InvalidDate);
    expect(campaignRepository.items).toHaveLength(0);
  });

  it('should not create a campaign if end date is invalid', async () => {
    const invalidDate = new Date('invalid-date');

    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    await expect(
      sut.campaignCreate({
        managerId: manager.id,
        title: 'Summer campaign',
        description: 'Promotional summer campaign',
        startDate: daysFromNow(1),
        endDate: invalidDate,
      }),
    ).rejects.toBeInstanceOf(InvalidDate);
    expect(campaignRepository.items).toHaveLength(0);
  });

  it('should not create a campaign if start date is in the past', async () => {
    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    await expect(
      sut.campaignCreate({
        managerId: manager.id,
        title: 'Summer campaign',
        description: 'Promotional summer campaign',
        startDate: daysFromNow(-1),
        endDate: daysFromNow(7),
      }),
    ).rejects.toBeInstanceOf(CampaignStartDateInPast);
    expect(campaignRepository.items).toHaveLength(0);
  });

  it('should not create a campaign if end date is before start date', async () => {
    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    await expect(
      sut.campaignCreate({
        managerId: manager.id,
        title: 'Summer campaign',
        description: 'Promotional summer campaign',
        startDate: daysFromNow(10),
        endDate: daysFromNow(7),
      }),
    ).rejects.toBeInstanceOf(InvalidCampaignDate);
    expect(campaignRepository.items).toHaveLength(0);
  });

  it('should not create a campaign if end date is equal to start date', async () => {
    const campaignDate = daysFromNow(10);
    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    await expect(
      sut.campaignCreate({
        managerId: manager.id,
        title: 'Summer campaign',
        description: 'Promotional summer campaign',
        startDate: campaignDate,
        endDate: campaignDate,
      }),
    ).rejects.toBeInstanceOf(InvalidCampaignDate);
    expect(campaignRepository.items).toHaveLength(0);
  });
});
