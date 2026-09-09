import { InMemoryUserRepository } from '@/users/app/test/in-memory/in-memory-user-repository';
import { InMemoryCampaignRepository } from './in-memory/in-memory-campaign-repository';
import { ListCampaignService } from '../services/listCampaign.service';
import { Role } from '@/users/domain/enum/user.enum';
import { randomUUID } from 'crypto';
import { daysFromNow } from './helpers/date.helper';
import { Status } from '@/campaign/domain/enum/status.enum';
import { ManagerNotFound } from '../Error/manager-not-found';
import { NotManager } from '../Error/not-manager';

describe('List campaigns', () => {
  let campaignRepository: InMemoryCampaignRepository;
  let userRepository: InMemoryUserRepository;
  let sut: ListCampaignService;

  beforeEach(() => {
    campaignRepository = new InMemoryCampaignRepository();
    userRepository = new InMemoryUserRepository();
    sut = new ListCampaignService(campaignRepository, userRepository);
  });

  it('should list all campaigns belonging to the manager', async () => {
    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    const campaignA = await campaignRepository.createCampaign({
      managerId: manager.id,
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(1),
      endDate: daysFromNow(7),
    });

    const campaignB = await campaignRepository.createCampaign({
      managerId: manager.id,
      title: 'Winter campaign',
      description: 'Promotional winter campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(2),
      endDate: daysFromNow(8),
    });

    const list = await sut.listCampaign(manager.id);

    expect(list).toHaveLength(2);
    expect(list).toContainEqual(campaignA);
    expect(list).toContainEqual(campaignB);
  });

  it('should not include campaigns belonging to another manager', async () => {
    const managerA = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    const managerB = await userRepository.createUser({
      name: 'Larry Paw',
      email: 'larrypaw@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    await campaignRepository.createCampaign({
      managerId: managerA.id,
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(1),
      endDate: daysFromNow(7),
    });

    await campaignRepository.createCampaign({
      managerId: managerA.id,
      title: 'Winter campaign',
      description: 'Promotional winter campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(2),
      endDate: daysFromNow(8),
    });

    const list = await sut.listCampaign(managerB.id);

    expect(list).toHaveLength(0);
  });

  it('should return an empty array when the manager has no campaigns', async () => {
    const idManager = 'no-campaign';

    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    await campaignRepository.createCampaign({
      managerId: idManager,
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(1),
      endDate: daysFromNow(7),
    });

    await campaignRepository.createCampaign({
      managerId: idManager,
      title: 'Winter campaign',
      description: 'Promotional winter campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(2),
      endDate: daysFromNow(8),
    });

    const list = await sut.listCampaign(manager.id);

    expect(list).toHaveLength(0);
  });

  it('should throw ManagerNotFound when the manager does not exist', async () => {
    const managerId = 'non-existent';

    await campaignRepository.createCampaign({
      managerId: managerId,
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(1),
      endDate: daysFromNow(7),
    });

    await campaignRepository.createCampaign({
      managerId: managerId,
      title: 'Winter campaign',
      description: 'Promotional winter campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(2),
      endDate: daysFromNow(8),
    });

    await expect(sut.listCampaign(managerId)).rejects.toBeInstanceOf(ManagerNotFound);
  });

  it('should throw NotManager when the user is not a manager', async () => {
    const client = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.CLIENT,
    });

    await expect(sut.listCampaign(client.id)).rejects.toBeInstanceOf(NotManager);
  });

  it('should list campaigns regardless of their status', async () => {
    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    await campaignRepository.createCampaign({
      managerId: manager.id,
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(1),
      endDate: daysFromNow(7),
    });

    await campaignRepository.createCampaign({
      managerId: manager.id,
      title: 'Winter campaign',
      description: 'Promotional winter campaign',
      status: Status.ACTIVE,
      startDate: daysFromNow(2),
      endDate: daysFromNow(8),
    });

    await campaignRepository.createCampaign({
      managerId: manager.id,
      title: 'Winter campaign',
      description: 'Promotional winter campaign',
      status: Status.FINISHED,
      startDate: daysFromNow(-7),
      endDate: daysFromNow(-1),
    });

    const list = await sut.listCampaign(manager.id);

    expect(list).toHaveLength(3);
  });
});
