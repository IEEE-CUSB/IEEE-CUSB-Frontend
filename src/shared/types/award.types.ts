/** The scope / organiser that granted the award */
export enum AwardSource {
  GLOBAL = 'GLOBAL',
  REGION_8 = 'REGION_8',
  EGYPT_SECTION = 'EGYPT_SECTION',
}

/** Human-readable labels for each source */
export const AWARD_SOURCE_LABELS: Record<AwardSource, string> = {
  [AwardSource.GLOBAL]: 'Global',
  [AwardSource.REGION_8]: 'Region 8',
  [AwardSource.EGYPT_SECTION]: 'Egypt Section',
};

/** Backend Award shape */
export interface Award {
  id: string;
  image_url: string | null;
  image_public_id?: string | null;
  title: string;
  description: string;
  won_count: number;
  years: number[];
  details?: Record<string, string>;
  source: AwardSource;
  created_at: string;
  updated_at: string;
}

export interface CreateAwardRequest {
  title: string;
  description: string;
  won_count?: number;
  years?: number[];
  details?: Record<string, string>;
  source?: AwardSource;
}

export interface UpdateAwardRequest {
  title?: string;
  description?: string;
  won_count?: number;
  years?: number[];
  details?: Record<string, string>;
  source?: AwardSource;
}

export interface AwardFormValues {
  title: string;
  description: string;
  won_count: string;
  years: string;
  source: AwardSource;
}

export type AwardFormErrors = Partial<Record<keyof AwardFormValues, string>>;
