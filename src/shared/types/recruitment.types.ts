import { User } from './auth.types';

import { Category } from './category.types';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status_code?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  message?: string;
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface Vacancy {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  image_public_id: string | null;
  is_open: boolean;
  category_id?: string | null;
  category?: Category | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationExtraData {
  why_join: string;
  portfolio?: string;
  [key: string]: any; // To support future extra data
}

export interface Application {
  id: string;
  user_id: string;
  vacancy_id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  extra_data: ApplicationExtraData;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface ApplyToVacancyRequest {
  extra_data: ApplicationExtraData;
}

export interface AddVacancy {
  title: string;
  description: string;
  is_open: boolean;
  category_id?: string | null;
}

export interface UpdateVacancy {
  title?: string;
  description?: string;
  is_open?: boolean;
  category_id?: string | null;
}

export interface UpdateStatus {
  status?: ApplicationStatus;
}

export interface GetAllApplicationsParams {
  vacancyId: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  [key: string]: any;
}

export interface ExportApplicationsParams {
  vacancyId: string;
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}
