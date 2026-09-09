import { InMemoryCampaignRepository } from './in-memory/in-memory-campaign-repository';
import { FinishExpiredCampaignService } from '../services/finishExpiredCampaigns.service';
import { Status } from '@/campaign/domain/enum/status.enum';
import { randomUUID } from 'crypto';
import { daysFromNow } from './helpers/date.helper';
import { vi } from 'vitest';

describe('Finish expired campaigns test', () => {
  let campaignRepository: InMemoryCampaignRepository;
  let sut: FinishExpiredCampaignService;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-10T12:00:00.000Z'));

    campaignRepository = new InMemoryCampaignRepository();
    sut = new FinishExpiredCampaignService(campaignRepository);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should finish an expired active campaign', async () => {
    const campaign = await campaignRepository.createCampaign({
      managerId: randomUUID(),
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.ACTIVE,
      startDate: daysFromNow(-7),
      endDate: daysFromNow(-1),
    });

    await sut.finishExpiredCampaigns();

    const updatedCampaign = await campaignRepository.findCampaignById(campaign.id);

    expect(updatedCampaign?.status).toBe(Status.FINISHED);
    expect(updatedCampaign?.finishedAt).toEqual(campaign.endDate);
    expect(campaignRepository.items).toHaveLength(1);
  });

  it('should finish an active campaign when end date is equal to now', async () => {
    const campaign = await campaignRepository.createCampaign({
      managerId: randomUUID(),
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.ACTIVE,
      startDate: daysFromNow(-7),
      endDate: daysFromNow(0),
    });

    await sut.finishExpiredCampaigns();

    const updatedCampaign = await campaignRepository.findCampaignById(campaign.id);

    expect(updatedCampaign?.status).toBe(Status.FINISHED);
    expect(updatedCampaign?.finishedAt).toEqual(campaign.endDate);
  });

  it('should not finish an active campaign before its end date', async () => {
    const campaign = await campaignRepository.createCampaign({
      managerId: randomUUID(),
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.ACTIVE,
      startDate: daysFromNow(-1),
      endDate: daysFromNow(7),
    });

    await sut.finishExpiredCampaigns();

    const updatedCampaign = await campaignRepository.findCampaignById(campaign.id);

    expect(updatedCampaign?.status).toBe(Status.ACTIVE);
    expect(updatedCampaign?.finishedAt).toBeUndefined();
  });

  it('should not change expired campaigns that are not active', async () => {
    const statuses = [Status.DRAFT, Status.SCHEDULED, Status.CANCELLED, Status.FINISHED];

    for (const status of statuses) {
      await campaignRepository.createCampaign({
        managerId: randomUUID(),
        title: 'Summer campaign',
        description: 'Promotional summer campaign',
        status,
        startDate: daysFromNow(-7),
        endDate: daysFromNow(-1),
      });
    }

    const campaignsBefore = campaignRepository.items.map((campaign) => ({
      ...campaign,
    }));

    await sut.finishExpiredCampaigns();

    expect(campaignRepository.items).toEqual(campaignsBefore);
  });

  it('should finish all expired active campaigns', async () => {
    const firstCampaign = await campaignRepository.createCampaign({
      managerId: randomUUID(),
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.ACTIVE,
      startDate: daysFromNow(-7),
      endDate: daysFromNow(-2),
    });

    const secondCampaign = await campaignRepository.createCampaign({
      managerId: randomUUID(),
      title: 'Winter campaign',
      description: 'Promotional winter campaign',
      status: Status.ACTIVE,
      startDate: daysFromNow(-7),
      endDate: daysFromNow(-1),
    });

    await sut.finishExpiredCampaigns();

    for (const campaign of [firstCampaign, secondCampaign]) {
      const updatedCampaign = await campaignRepository.findCampaignById(campaign.id);

      expect(updatedCampaign?.status).toBe(Status.FINISHED);
      expect(updatedCampaign?.finishedAt).toEqual(campaign.endDate);
    }
  });

  it('should not change an already finalized campaign on another execution', async () => {
    const campaign = await campaignRepository.createCampaign({
      managerId: randomUUID(),
      title: 'Summer campaign',
      description: 'Promotional summer campaign',
      status: Status.ACTIVE,
      startDate: daysFromNow(-7),
      endDate: daysFromNow(-1),
    });

    await sut.finishExpiredCampaigns();

    const finishedCampaign = await campaignRepository.findCampaignById(campaign.id);
    const campaignBefore = { ...finishedCampaign };

    vi.setSystemTime(daysFromNow(1));

    await sut.finishExpiredCampaigns();

    const updatedCampaign = await campaignRepository.findCampaignById(campaign.id);

    expect(updatedCampaign).toEqual(campaignBefore);
  });

  it('should not throw when there are no campaigns', async () => {
    await expect(sut.finishExpiredCampaigns()).resolves.toBeUndefined();

    expect(campaignRepository.items).toHaveLength(0);
  });
});
