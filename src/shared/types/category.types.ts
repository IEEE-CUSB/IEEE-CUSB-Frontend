export enum CategoryType {
  COMMITTEE = 'COMMITTEE',
  EVENT = 'EVENT',
  WORKSHOP = 'WORKSHOP',
  RECRUITMENT = 'RECRUITMENT',
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  description?: string | null;
  created_at: string;
  updated_at: string;
}
