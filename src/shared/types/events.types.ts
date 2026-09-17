import { User } from './auth.types';



export interface Event {
  id: string;
  title: string;
  description: string;
  category_id?: string | null;
  category?: {
    id: string;
    name: string;
    type: string;
  } | null;
  location: string;
  start_time: string;
  end_time: string;
  capacity: number;
  remainingSpots: number;
  is_full: boolean;
  registration_deadline: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  image_url?: string | null;
  image_public_id?: string | null;
  images?: EventGalleryImage[];
  is_registered?: boolean;
  registration_id?: string;
  is_published?: boolean;
}

/**
 * Event gallery image entity
 */
export interface EventGalleryImage {
  id: string;
  event_id: string;
  image_url: string;
  image_public_id: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Event registration status enum
 */
export enum EventRegistrationStatus {
  REGISTERED = 'registered',
  WAITLISTED = 'waitlisted',
  CANCELLED = 'cancelled',
  ATTENDED = 'attended',
}

/**
 * Event registration entity type
 */
export interface EventRegistration {
  id: string;
  user_id: string;
  event_id: string;
  status: EventRegistrationStatus;
  created_at: string;
  updated_at: string;
  user?: User;
}

/**
 * Create Event Request DTO
 */
export interface CreateEventRequest {
  title: string;
  description: string;
  category_id: string;
  location: string;
  start_time: string;
  end_time: string;
  capacity: number;
  registration_deadline: string;
  is_published?: boolean;
}

/**
 * Update Event Request DTO (all fields optional)
 */
export interface UpdateEventRequest {
  title?: string;
  description?: string;
  category_id?: string;
  location?: string;
  start_time?: string;
  end_time?: string;
  capacity?: number;
  registration_deadline?: string;
}

/**
 * Update Registration Status Request DTO
 */
export interface UpdateRegistrationStatusRequest {
  status: EventRegistrationStatus;
}

/**
 * Pagination params
 */
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  [key: string]: any;
}

/**
 * API Response wrapper (matches backend response format)
 */
export interface EventApiResponse<T> {
  data: T;
  count: number;
  message: string;
}

/**
 * Paginated Events Response
 */
export interface PaginatedEventsResponse {
  data: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  count: number;
  message: string;
}

/**
 * Paginated Registrations Response
 */
export interface PaginatedRegistrationsResponse {
  data: EventRegistration[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Default export for backward compatibility
export default Event;
