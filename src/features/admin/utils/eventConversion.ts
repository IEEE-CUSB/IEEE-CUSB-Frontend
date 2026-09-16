import type {
  Event as ApiEvent,
  CreateEventRequest,
  UpdateEventRequest,
} from '../../../shared/types/events.types';
import type { EventFormData } from '../types/eventFormTypes';

// Local Event type for admin compatibility (matching old interface)
export type AdminEvent = {
  id: string;
  title: string;
  description: string;
  eventPoster: string;
  eventType: string;
  media?: string[];
  sponsors?: string[];
  date: string;
  location: string;
  category_id: string;
  capacity: number;
  registeredCount: number;
  attendeeCount: number;
  endTime: string;
};

/**
 * Convert API Event to Admin-compatible Event format
 * Transforms the backend Event structure to the admin Event structure
 */
export const convertApiEventToAdminEvent = (event: ApiEvent): AdminEvent => {
  // Extract date from start_time in ISO format for datetime-local input
  const startDate = new Date(event.start_time);
  const formattedDate = startDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm format

  return {
    id: event.id,
    title: event.title,
    description: event.description,
    location: event.location,
    date: formattedDate,
    capacity: event.capacity,
    // Default values for fields not in API
    eventPoster: '', // Will need to be uploaded separately
    eventType: 'Workshop', // Default value
    media: [],
    sponsors: [],
    category_id: event.category_id || '',
    registeredCount: 0, // This would come from registrations count
    attendeeCount: 0, // This would come from attended registrations count
    endTime: new Date(event.end_time).toISOString().slice(0, 16),
  };
};

/**
 * Convert API Event to Admin Form Data
 * Transforms the backend Event structure to the admin form structure
 */
export const convertApiEventToFormData = (
  event: ApiEvent
): Partial<EventFormData> => {
  const adminEvent = convertApiEventToAdminEvent(event);
  return adminEvent;
};

/**
 * Convert Form Data to Create Event API Request
 * Transforms the event form data to the API create request structure
 */
export const convertFormDataToCreateRequest = (
  formData: EventFormData
): CreateEventRequest => {
  return {
    title: formData.title,
    description: formData.description,
    category_id: formData.category_id,
    location: formData.location,
    start_time: formData.start_time,
    end_time: formData.end_time,
    capacity: formData.capacity,
    registration_deadline: formData.registration_deadline,
  };
};

/**
 * Convert Form Data to Update Event API Request
 * Transforms the event form data to the API update request structure
 */
export const convertFormDataToUpdateRequest = (
  formData: EventFormData
): UpdateEventRequest => {
  return {
    title: formData.title,
    description: formData.description,
    category_id: formData.category_id,
    location: formData.location,
    start_time: formData.start_time,
    end_time: formData.end_time,
    capacity: formData.capacity,
    registration_deadline: formData.registration_deadline,
  };
};
