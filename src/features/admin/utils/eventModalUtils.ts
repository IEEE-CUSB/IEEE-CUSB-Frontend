import type { AdminEvent } from './eventConversion';
import type { EventFormValues, FormErrors } from '../types/eventModalTypes';
import type { EventFormData } from '../types/eventFormTypes';
import {
  EVENT_FORM_CONSTRAINTS,
  ERROR_MESSAGES,
} from '../constants/eventModalConstants';

export const validateFile = (file: File): string | undefined => {
  // Check file size
  if (file.size > EVENT_FORM_CONSTRAINTS.file.maxSize) {
    return ERROR_MESSAGES.format.fileTooLarge;
  }
  // Check file type
  const allowedTypes = EVENT_FORM_CONSTRAINTS.file.allowedImageTypes;
  if (!allowedTypes.some(type => type === file.type)) {
    return ERROR_MESSAGES.format.eventPosterFile;
  }

  return undefined;
};

export const validateEventPoster = (
  value: File | string
): string | undefined => {
  if (!value) return ERROR_MESSAGES.required.eventPoster;

  if (value instanceof File) {
    return validateFile(value);
  }

  // If it's a string, validate as URL
  if (typeof value === 'string') {
    if (!value.trim()) return ERROR_MESSAGES.required.eventPoster;
    if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(value)) {
      return ERROR_MESSAGES.format.eventPoster;
    }
  }

  return undefined;
};

export const validateField = (
  field: keyof EventFormValues,
  value: string,
  formValues?: EventFormValues
): string | undefined => {
  const stringValue = value as string;

  switch (field) {
    case 'title': {
      if (!stringValue.trim()) return ERROR_MESSAGES.required.title;
      if (stringValue.trim().length < EVENT_FORM_CONSTRAINTS.title.minLength) {
        return ERROR_MESSAGES.length.titleMin;
      }
      if (stringValue.trim().length > EVENT_FORM_CONSTRAINTS.title.maxLength) {
        return ERROR_MESSAGES.length.titleMax;
      }
      break;
    }

    case 'description': {
      if (!stringValue.trim()) return ERROR_MESSAGES.required.description;
      if (
        stringValue.trim().length < EVENT_FORM_CONSTRAINTS.description.minLength
      ) {
        return ERROR_MESSAGES.length.descriptionMin;
      }
      if (
        stringValue.trim().length > EVENT_FORM_CONSTRAINTS.description.maxLength
      ) {
        return ERROR_MESSAGES.length.descriptionMax;
      }
      break;
    }

    case 'startTime':
    case 'endTime':
    case 'registrationDeadline': {
      if (!stringValue.trim()) return `${field} is required`;
      const eventDate = new Date(stringValue);
      if (isNaN(eventDate.getTime())) return 'Invalid date/time format';

      // Validate end time is after start time
      if (field === 'endTime' && formValues?.startTime) {
        const startDate = new Date(formValues.startTime);
        if (eventDate <= startDate) {
          return 'End time must be after start time';
        }
      }

      // Validate registration deadline is before start time
      if (field === 'registrationDeadline' && formValues?.startTime) {
        const startDate = new Date(formValues.startTime);
        if (eventDate >= startDate) {
          // Ignore this validation for now to allow editing past events
          // return 'Registration deadline must be before event start time';
          return 'Registration deadline must be before event start time';
        }
      }
      break;
    }

    case 'location': {
      if (!stringValue.trim()) return ERROR_MESSAGES.required.location;
      if (
        stringValue.trim().length < EVENT_FORM_CONSTRAINTS.location.minLength
      ) {
        return ERROR_MESSAGES.length.locationMin;
      }
      if (
        stringValue.trim().length > EVENT_FORM_CONSTRAINTS.location.maxLength
      ) {
        return ERROR_MESSAGES.length.locationMax;
      }
      break;
    }

    case 'capacity': {
      if (!value.trim()) return ERROR_MESSAGES.required.capacity;
      const capacity = parseInt(value, 10);
      if (isNaN(capacity)) return ERROR_MESSAGES.validation.mustBeNumber;
      if (capacity < EVENT_FORM_CONSTRAINTS.capacity.min) {
        return ERROR_MESSAGES.validation.capacityMin;
      }
      if (capacity > EVENT_FORM_CONSTRAINTS.capacity.max) {
        return ERROR_MESSAGES.validation.capacityMax;
      }
      break;
    }

    case 'category_id': {
      if (!stringValue.trim())
        return ERROR_MESSAGES.required.category || 'Category is required';
      break;
    }

    default:
      break;
  }

  return undefined;
};

export const validateAllFields = (formValues: EventFormValues): FormErrors => {
  const newErrors: FormErrors = {};

  // Validate each field
  (Object.keys(formValues) as Array<keyof EventFormValues>).forEach(field => {
    const value = formValues[field];
    if (value !== undefined) {
      const error = validateField(field, value as string, formValues);
      if (error) {
        newErrors[field as keyof FormErrors] = error;
      }
    }
  });

  return newErrors;
};

export const convertEventToFormValues = (
  event?: AdminEvent
): EventFormValues => {
  if (!event) {
    return {
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      registrationDeadline: '',
      location: '',
      capacity: '',
      category_id: '',
      is_published: true,
    };
  }

  return {
    title: event.title || '',
    description: event.description || '',
    startTime: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
    endTime: event.endTime ? new Date(event.endTime).toISOString().slice(0, 16) : '',
    registrationDeadline: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
    location: event.location || '',
    capacity: String(event.capacity || 0),
    category_id: event.category_id || '',
    is_published: (event as any).is_published ?? true,
  };
};

/**
 * Convert FormValues to EventFormData (for create/update)
 */
export const convertFormValuesToEventFormData = (
  formValues: EventFormValues,
  existingEvent?: AdminEvent
): EventFormData => {
  return {
    id: existingEvent?.id,
    title: formValues.title,
    description: formValues.description,
    location: formValues.location,
    start_time: formValues.startTime,
    end_time: formValues.endTime,
    capacity: parseInt(formValues.capacity, 10),
    registration_deadline: formValues.registrationDeadline,
    category_id: formValues.category_id,
    is_published: formValues.is_published,
  };
};
