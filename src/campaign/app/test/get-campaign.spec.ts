import { InMemoryUserRepository } from '@/users/app/test/in-memory/in-memory-user-repository';
import { InMemoryCampaignRepository } from './in-memory/in-memory-campaign-repository';
import { Role } from '@/users/domain/enum/user.enum';
import { randomUUID } from 'crypto';
import { daysFromNow } from './helpers/date.helper';
import { Status } from '@/campaign/domain/enum/status.enum';
import { GetCampaignByIdService } from '../services/getCampaignById.service';
import { CampaignNotFound } from '../Error/campaign-not-found';
import { NotManager } from '../Error/not-manager';
import { ManagerNotFound } from '../Error/manager-not-found';
import { NotCampaignOwner } from '../Error/not-campaign-owner';

describe('Get campaigns', () => {
  let campaignRepository: InMemoryCampaignRepository;
  let userRepository: InMemoryUserRepository;
  let sut: GetCampaignByIdService;

  beforeEach(() => {
    campaignRepository = new InMemoryCampaignRepository();
    userRepository = new InMemoryUserRepository();
    sut = new GetCampaignByIdService(campaignRepository, userRepository);
  });

  it('should get a campaign', async () => {
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

    const getCampaign = await sut.getCampaign(manager.id, campaign.id);

    expect(getCampaign).toBe(campaign);
  });

  it('should return a campaign belonging to the authenticated manager', async () => {
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

    const getCampaign = await sut.getCampaign(manager.id, campaign.id);

    expect(getCampaign.id).toBe(campaign.id);
  });

  it('should throw CampaignNotFound when the campaign does not exist', async () => {
    const campaignId = 'non-existent';

    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    await expect(sut.getCampaign(manager.id, campaignId)).rejects.toBeInstanceOf(CampaignNotFound);
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

    await expect(sut.getCampaign(user.id, campaign.id)).rejects.toBeInstanceOf(NotManager);
  });

  it('should throw ManagerNotFound when the manager does not exist', async () => {
    const idManager = 'non-existent';

    const campaign = await campaignRepository.createCampaign({
      managerId: idManager,
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(1),
      endDate: daysFromNow(7),
    });

    await expect(sut.getCampaign(idManager, campaign.id)).rejects.toBeInstanceOf(ManagerNotFound);
  });

  it('should throw NotCampaignOwner when the campaign belongs to another manager', async () => {
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

    const campaign = await campaignRepository.createCampaign({
      managerId: managerA.id,
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(1),
      endDate: daysFromNow(7),
    });

    await expect(sut.getCampaign(managerB.id, campaign.id)).rejects.toBeInstanceOf(
      NotCampaignOwner,
    );
  });
});
