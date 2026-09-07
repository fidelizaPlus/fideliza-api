import { InMemoryUserRepository } from '@/users/app/test/in-memory/in-memory-user-repository';
import { InMemoryCampaignRepository } from './in-memory/in-memory-campaign-repository';
import { Status } from '@/campaign/domain/enum/status.enum';
import { randomUUID } from 'crypto';
import { daysFromNow } from './helpers/date.helper';
import { Role } from '@/users/domain/enum/user.enum';
import { UpdateCampaignService } from '../services/updateCampaign.service';
import { ManagerNotFound } from '../Error/manager-not-found';
import { NotManager } from '../Error/not-manager';
import { CampaignNotFound } from '../Error/campaign-not-found';
import { NotCampaignOwner } from '../Error/not-campaign-owner';
import { InvalidDate } from '../Error/invalid-date';
import { InvalidCampaignDate } from '../Error/invalid-campaign-date';

describe('Delete campaign test', () => {
  let campaignRepository: InMemoryCampaignRepository;
  let userRepository: InMemoryUserRepository;
  let sut: UpdateCampaignService;

  beforeEach(() => {
    campaignRepository = new InMemoryCampaignRepository();
    userRepository = new InMemoryUserRepository();
    sut = new UpdateCampaignService(campaignRepository, userRepository);
  });

  it('should update all campaign fields successfully', async () => {
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

    const data = {
      title: 'Winter campaign',
      description: 'Promotional winter campaign',
      startDate: daysFromNow(2),
      endDate: daysFromNow(8),
    };

    const updatedCampaign = await sut.updateCampaign(campaign.id, manager.id, data);

    expect(updatedCampaign).toMatchObject(data);
  });

  it('should update only the provided field and preserve the others', async () => {
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

    const title = campaign.title;
    const descriotion = campaign.description;
    const endDate = campaign.endDate;

    const data = {
      startDate: daysFromNow(2),
    };

    const updatedCampaign = await sut.updateCampaign(campaign.id, manager.id, data);

    expect(updatedCampaign.title).toBe(title);
    expect(updatedCampaign.description).toBe(descriotion);
    expect(updatedCampaign.endDate).toEqual(endDate);

    expect(updatedCampaign.startDate).toEqual(data.startDate);
  });

  it('should throw ManagerNotFound when the manager does not exist', async () => {
    const idManager = 'Non-existent';

    await expect(
      sut.updateCampaign(randomUUID(), idManager, {
        title: 'Summer campaign',
        description: 'Promotional summer campaign',
        startDate: daysFromNow(1),
        endDate: daysFromNow(7),
      }),
    ).rejects.toBeInstanceOf(ManagerNotFound);
  });

  it('should throw NotManager when the user is not a manager', async () => {
    const user = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.CLIENT,
    });

    const campaign = await campaignRepository.createCampaign({
      managerId: user.id,
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(1),
      endDate: daysFromNow(7),
    });

    await expect(
      sut.updateCampaign(campaign.id, user.id, {
        title: 'Updated campaign',
      }),
    ).rejects.toBeInstanceOf(NotManager);
  });

  it('should throw CampaignNotFound when the campaign does not exist', async () => {
    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    const idCampaign = 'nos-existent';

    await expect(
      sut.updateCampaign(idCampaign, manager.id, {
        title: 'Updated campaign',
      }),
    ).rejects.toBeInstanceOf(CampaignNotFound);
  });

  it('should throw NotCampaignOwner when the campaign belongs to another manager', async () => {
    const managerA = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    const managerB = await userRepository.createUser({
      name: 'Larry',
      email: 'larry@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    const campaign = await campaignRepository.createCampaign({
      managerId: managerA.id,
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(1),
      endDate: daysFromNow(7),
    });

    await expect(
      sut.updateCampaign(campaign.id, managerB.id, {
        title: 'Updated campaign',
      }),
    ).rejects.toBeInstanceOf(NotCampaignOwner);
  });

  it('should throw InvalidDate when the start date is invalid', async () => {
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

    await expect(
      sut.updateCampaign(campaign.id, manager.id, {
        startDate: new Date('invalide-date'),
      }),
    ).rejects.toBeInstanceOf(InvalidDate);
  });

  it('should throw InvalidDate when the end date is invalid', async () => {
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

    await expect(
      sut.updateCampaign(campaign.id, manager.id, {
        endDate: new Date('invalide-date'),
      }),
    ).rejects.toBeInstanceOf(InvalidDate);
  });

  it('should throw InvalidDate when the start date is not a Date object', async () => {
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

    await expect(
      sut.updateCampaign(campaign.id, manager.id, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        startDate: '10-09-2026',
      }),
    ).rejects.toBeInstanceOf(InvalidDate);
  });

  it('should throw InvalidDate when the start date is not a Date object', async () => {
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

    await expect(
      sut.updateCampaign(campaign.id, manager.id, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        endDate: '10-09-2026',
      }),
    ).rejects.toBeInstanceOf(InvalidDate);
  });

  it('should throw InvalidCampaignDate when the end date is before the start date', async () => {
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
      startDate: daysFromNow(2),
      endDate: daysFromNow(1),
    });

    await expect(
      sut.updateCampaign(campaign.id, manager.id, {
        title: 'Updated campaign',
      }),
    ).rejects.toBeInstanceOf(InvalidCampaignDate);
  });

  it('should throw InvalidCampaignDate when the end date is equals the start date', async () => {
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
      endDate: daysFromNow(1),
    });

    await expect(
      sut.updateCampaign(campaign.id, manager.id, {
        title: 'Updated campaign',
      }),
    ).rejects.toBeInstanceOf(InvalidCampaignDate);
  });
});
