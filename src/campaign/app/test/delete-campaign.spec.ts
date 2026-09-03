import { InMemoryUserRepository } from '@/users/app/test/in-memory/in-memory-user-repository';
import { InMemoryCampaignRepository } from './in-memory/in-memory-campaign-repository';
import { DeleteCampaignService } from '../services/deleteCampaign.service';
import { ManagerNotFound } from '../Error/manager-not-found';
import { Status } from '@/campaign/domain/enum/status.enum';
import { randomUUID } from 'crypto';
import { daysFromNow } from './helpers/date.helper';
import { Role } from '@/users/domain/enum/user.enum';
import { NotManager } from '../Error/not-manager';
import { CampaignNotFound } from '../Error/campaign-not-found';
import { NotCampaignOwner } from '../Error/not-campaign-owner';

describe('Delete campaign test', () => {
  let campaignRepository: InMemoryCampaignRepository;
  let userRepository: InMemoryUserRepository;
  let sut: DeleteCampaignService;

  beforeEach(() => {
    campaignRepository = new InMemoryCampaignRepository();
    userRepository = new InMemoryUserRepository();
    sut = new DeleteCampaignService(campaignRepository, userRepository);
  });

  it('should delete a campaign', async () => {
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

    await sut.campaignDelete(campaign.id, manager.id);
    expect(campaignRepository.items).toHaveLength(0);
  });

  it('should not delete a campaign if manager does not exist', async () => {
    const nonexistentManagerId = randomUUID();

    const campaign = await campaignRepository.createCampaign({
      managerId: nonexistentManagerId,
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(1),
      endDate: daysFromNow(7),
    });

    await expect(sut.campaignDelete(campaign.id, nonexistentManagerId)).rejects.toBeInstanceOf(
      ManagerNotFound,
    );

    expect(campaignRepository.items).toHaveLength(1);
  });

  it('should not delete a campaign if user is not a manager', async () => {
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

    await expect(sut.campaignDelete(campaign.id, user.id)).rejects.toBeInstanceOf(NotManager);
    expect(campaignRepository.items).toHaveLength(1);
  });

  it('should not delete a campaign if campaign does not exist', async () => {
    const nonexistentCampaignId = randomUUID();

    const manager = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    await expect(sut.campaignDelete(nonexistentCampaignId, manager.id)).rejects.toBeInstanceOf(
      CampaignNotFound,
    );
  });

  it('should not delete a campaign if manager is not the campaign owner', async () => {
    const campaignOwner = await userRepository.createUser({
      name: 'Campaign Owner',
      email: 'owner@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    const anotherManager = await userRepository.createUser({
      name: 'Another Manager',
      email: 'another.manager@gmail.com',
      authUserId: randomUUID(),
      role: Role.MANAGER,
    });

    const campaign = await campaignRepository.createCampaign({
      managerId: campaignOwner.id,
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.DRAFT,
      startDate: daysFromNow(1),
      endDate: daysFromNow(7),
    });

    await expect(sut.campaignDelete(campaign.id, anotherManager.id)).rejects.toBeInstanceOf(
      NotCampaignOwner,
    );

    expect(campaignRepository.items).toHaveLength(1);
  });
});
