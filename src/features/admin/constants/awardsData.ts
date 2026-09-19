import type { Award } from '../types/awardTypes';
import { AwardSource } from '@/shared/types/award.types';

/** @deprecated Mock data - replaced by real API via useAwards() */
export const MOCK_AWARDS: Award[] = [
  {
    id: '1',
    image_url: '',
    title: 'Best Technical Project',
    description:
      'Awarded for developing an outstanding AI-powered solution that solved a real-world problem during the annual IEEE hackathon.',
    won_count: 1,
    years: [2024],
    source: AwardSource.EGYPT_SECTION,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    image_url: '',
    title: 'Outstanding Leadership Award',
    description:
      'Recognized for exceptional leadership skills in guiding the Computer Society student branch to new heights throughout the academic year.',
    won_count: 1,
    years: [2024],
    source: AwardSource.EGYPT_SECTION,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

