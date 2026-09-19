import type { Award } from '@/shared/types/award.types';
import { AwardSource } from '@/shared/types/award.types';

/**
 * Fallback / placeholder awards used when the API is unavailable.
 * Keep in sync with the backend seed data.
 */
export const TROPHY_AWARDS: Award[] = [
  {
    id: 'fallback-1',
    image_url: '',
    title: 'Best Student Branch',
    description:
      'Ranked for exceptional performance in organizing technical events and member engagement across Egypt, Middle East, and Africa.',
    won_count: 2,
    years: [2019],
    source: AwardSource.EGYPT_SECTION,
    created_at: '2019-01-01T00:00:00Z',
    updated_at: '2019-01-01T00:00:00Z',
  },
  {
    id: 'fallback-2',
    image_url: '',
    title: 'Global Website Award',
    description:
      'Recognized for outstanding website design, content accessibility, and user experience among all IEEE student branches worldwide.',
    won_count: 3,
    years: [2021],
    source: AwardSource.GLOBAL,
    created_at: '2021-01-01T00:00:00Z',
    updated_at: '2021-01-01T00:00:00Z',
  },
  {
    id: 'fallback-3',
    image_url: '',
    title: 'Exemplary Volunteer',
    description:
      'Honoring the collective effort of our volunteers in community service and STEM outreach programs at local schools.',
    won_count: 0,
    years: [2020],
    source: AwardSource.REGION_8,
    created_at: '2020-01-01T00:00:00Z',
    updated_at: '2020-01-01T00:00:00Z',
  },
  {
    id: 'fallback-4',
    image_url: '',
    title: 'Membership Growth',
    description:
      'Achieved the highest percentage increase in student membership within the Egypt Section for the fiscal year.',
    won_count: 1,
    years: [2018],
    source: AwardSource.EGYPT_SECTION,
    created_at: '2018-01-01T00:00:00Z',
    updated_at: '2018-01-01T00:00:00Z',
  },
  {
    id: 'fallback-5',
    image_url: '',
    title: 'IEEE Xtreme Top 100',
    description:
      'Our coding teams ranked within the top 100 globally out of 4500+ teams in the 24-hour programming challenge.',
    won_count: 0,
    years: [2021],
    source: AwardSource.GLOBAL,
    created_at: '2021-01-01T00:00:00Z',
    updated_at: '2021-01-01T00:00:00Z',
  },
];
