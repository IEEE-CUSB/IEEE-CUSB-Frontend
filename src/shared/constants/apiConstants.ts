/**
 * API Endpoints Constants
 */

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/token/refresh',
    ME: '/auth/me',
    SEND_EMAIL_OTP: '/auth/otp/email/send',
    VERIFY_EMAIL_OTP: '/auth/otp/email/verify',
    SEND_PASSWORD_OTP: '/auth/otp/password/send',
    RESET_PASSWORD: '/auth/password/reset',
    CHANGE_PASSWORD: '/auth/password/change',
    GOOGLE_AUTH: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
    GITHUB_AUTH: '/auth/github',
    GITHUB_CALLBACK: '/auth/github/callback',
    COMPLETE_OAUTH_PROFILE: '/auth/oauth/complete-profile',
  },

  // Users endpoints
  USERS: {
    GET_ALL: '/admin/users',
    GET_USER: (id: string) => `/users/${id}`,
    ADMIN_GET_USER: (id: string) => `/admin/users/${id}`,
    UPDATE_USER: (id: string) => `/users/${id}`,
    DELETE_USER: (id: string) => `/users/${id}`,
    ADMIN_DELETE_USER: (id: string) => `/admin/users/${id}`,
    // CV endpoints
    UPLOAD_CV: '/users/me/cv/upload',
    DOWNLOAD_CV: '/users/me/cv/download',
    DELETE_CV: '/users/me/cv',
    // Applications endpoints
    GET_MY_APPLICATIONS: '/users/me/applications',
    ADMIN_GET_USER_APPLICATIONS: (id: string) => `/admin/users/${id}/applications`,
    // Admin CV endpoints
    ADMIN_DOWNLOAD_CV: (userId: string) => `/admin/users/${userId}/cv/download`,
    // Admin Role endpoint
    ADMIN_UPDATE_USER_ROLE: (id: string) => `/admin/users/${id}/role`,
  },

  // Roles endpoints
  ROLES: {
    GET_ALL: '/roles',
    GET_ONE: (id: string) => `/roles/${id}`,
    CREATE: '/roles',
    UPDATE: (id: string) => `/roles/${id}`,
    DELETE: (id: string) => `/roles/${id}`,
  },

  // Awards endpoints
  AWARDS: {
    GET_ALL: '/awards',
    GET_ONE: (id: string) => `/awards/${id}`,
    CREATE: '/admin/awards',
    UPDATE: (id: string) => `/admin/awards/${id}`,
    DELETE: (id: string) => `/admin/awards/${id}`,
    UPLOAD_IMAGE: (id: string) => `/admin/awards/${id}/image`,
    DELETE_IMAGE: (id: string) => `/admin/awards/${id}/image`,
  },

  // Events endpoints
  EVENTS: {
    CREATE: '/admin/events',
    GET_ALL: '/events',
    GET_ONE: (id: string) => `/events/${id}`,
    UPDATE: (id: string) => `/admin/events/${id}`,
    DELETE: (id: string) => `/admin/events/${id}`,
    REGISTER: (id: string) => `/events/${id}/register`,
    CANCEL_REGISTRATION: (id: string) => `/events/${id}/cancel`,
    GET_REGISTRATIONS: (id: string) => `/admin/events/${id}/registrations`,
    UPDATE_REGISTRATION_STATUS: (eventId: string, registrationId: string) =>
      `/admin/events/${eventId}/registrations/${registrationId}/status`,
    UPLOAD_IMAGE: (id: string) => `/admin/events/${id}/image`,
    DELETE_IMAGE: (id: string) => `/admin/events/${id}/image`,
    UPLOAD_GALLERY: (id: string) => `/admin/events/${id}/images`,
    DELETE_GALLERY_IMAGE: (id: string, imageId: string) =>
      `/admin/events/${id}/images/${imageId}`,
  },

  // Committees endpoints
  COMMITTEES: {
    CREATE: '/admin/committees',
    GET_ALL: '/committees',
    GET_ONE: (id: string) => `/committees/${id}`,
    UPDATE: (id: string) => `/admin/committees/${id}`,
    DELETE: (id: string) => `/admin/committees/${id}`,
    GET_MEMBERS: (committeeId: string) => `/committees/${committeeId}/members`,
    CREATE_COMMITTEE_MEMBER: `/admin/committees/members`,
    UPDATE_COMMITTEE_MEMBER: (id: string) => `/admin/committees/members/${id}`,
    DELETE_COMMITTEE_MEMBER: (id: string) => `/admin/committees/members/${id}`,
    UPLOAD_MEMBER_IMAGE: (id: string) =>
      `/admin/committees/members/${id}/image`,
    DELETE_MEMBER_IMAGE: (id: string) =>
      `/admin/committees/members/${id}/image`,
  },

  COMMITTEE_CATEGORIES: {
    CREATE: '/admin/categories',
    GET_ALL: '/categories',
    UPDATE: (id: string) => `/admin/categories/${id}`,
    DELETE: (id: string) => `/admin/categories/${id}`,
  },

  CATEGORIES: {
    CREATE: '/admin/categories',
    GET_ALL: '/admin/categories',
    UPDATE: (id: string) => `/admin/categories/${id}`,
    DELETE: (id: string) => `/admin/categories/${id}`,
  },

  // Board endpoints
  BOARD: {
    GET_ALL: '/board',
    GET_OFFICERS: '/board/officers',
    CREATE: '/admin/board',
    UPDATE: (id: string) => `/admin/board/${id}`,
    DELETE: (id: string) => `/admin/board/${id}`,
    UPLOAD_IMAGE: (id: string) => `/admin/board/${id}/image`,
    DELETE_IMAGE: (id: string) => `/admin/board/${id}/image`,
  },

  // Workshops endpoints
  WORKSHOPS: {
    CREATE: '/admin/workshops',
    GET_ALL: '/workshops',
    GET_ONE: (id: string) => `/workshops/${id}`,
    UPDATE: (id: string) => `/admin/workshops/${id}`,
    DELETE: (id: string) => `/admin/workshops/${id}`,
    UPLOAD_IMAGE: (id: string) => `/admin/workshops/${id}/image`,
    DELETE_IMAGE: (id: string) => `/admin/workshops/${id}/image`,
    UPLOAD_GALLERY: (id: string) => `/admin/workshops/${id}/images`,
    DELETE_GALLERY_IMAGE: (id: string, imageId: string) =>
      `/admin/workshops/${id}/images/${imageId}`,

    // Instructors
    GET_INSTRUCTORS: '/workshops/instructors',
    CREATE_INSTRUCTOR: '/admin/workshops/instructors',
    UPDATE_INSTRUCTOR: (id: string) => `/admin/workshops/instructors/${id}`,
    DELETE_INSTRUCTOR: (id: string) => `/admin/workshops/instructors/${id}`,
    UPLOAD_INSTRUCTOR_IMAGE: (id: string) =>
      `/admin/workshops/instructors/${id}/image`,
    DELETE_INSTRUCTOR_IMAGE: (id: string) =>
      `/admin/workshops/instructors/${id}/image`,

    // Registrations
    REGISTER: (id: string) => `/workshops/${id}/register`,
    CANCEL_REGISTRATION: (id: string) => `/workshops/${id}/cancel`,
    GET_REGISTRATIONS: (id: string) => `/admin/workshops/${id}/registrations`,
    UPDATE_REGISTRATION_STATUS: (workshopId: string, registrationId: string) =>
      `/admin/workshops/${workshopId}/registrations/${registrationId}/status`,
    BULK_REGISTER: (id: string) => `/admin/workshops/${id}/bulk-register`,
  },
  // Recruitment endpoints
  RECRUITMENT: {
    //admin
    CREATE: '/admin/recruitment/vacancies',
    GET_ALL_VACANCIES: '/admin/recruitment/vacancies',
    UPDATE_VACANCY: (id: string) => `/admin/recruitment/vacancies/${id}`,
    DELETE_VACANCY: (id: string) => `/admin/recruitment/vacancies/${id}`,
    UPLOAD_VACANCY_IMAGE: (id: string) => `/admin/recruitment/vacancies/${id}/image`,
    DELETE_VACANCY_IMAGE: (id: string) => `/admin/recruitment/vacancies/${id}/image`,

    GET_ALL_APPLICATIONS: (id: string) =>
      `/admin/recruitment/vacancies/${id}/applications`,
    UPDATE_APPLICATION_STATUS: (id: string) =>
      `/admin/recruitment/applications/${id}/status`,
    EXPORT_APPLICATIONS: (id: string) =>
      `/admin/recruitment/vacancies/${id}/applications/export/excel`,
    VIEW_APPLICATION_CV: (id: string) =>
      `/admin/recruitment/applications/${id}/cv`,

    //user
    GET_VACANCIES: '/recruitment/vacancies',
    APPLY: (id: string) => `/recruitment/vacancies/${id}/apply`,
    REVOKE_APPLICATION: (id: string) => `/recruitment/applications/${id}`,
    // Admin recruitment endpoints
    ADMIN_VIEW_APPLICATION_CV: (id: string) => `/admin/recruitment/applications/${id}/cv`,
  },
} as const;

/**
 * Query Keys for React Query
 */
export const QUERY_KEYS = {
  AUTH: {
    CURRENT_USER: ['auth', 'current-user'],
  },
  USERS: {
    ALL: ['users'],
    ONE: (id: string) => ['users', id],
    MY_APPLICATIONS: ['users', 'my-applications'],
    USER_APPLICATIONS: (id: string) => ['users', id, 'applications'],
  },
  ROLES: {
    ALL: ['roles'],
    ONE: (id: string) => ['roles', id],
  },
  EVENTS: {
    ALL: ['events'],
    INFINITE: ['events', 'infinite'],
    ONE: (id: string) => ['events', id],
    REGISTRATIONS: (eventId: string) => ['events', eventId, 'registrations'],
  },
  COMMITTEES: {
    ALL: ['committees'],
    INFINITE: ['committees', 'infinite'],
    ONE: (id: string) => ['committees', id],
    MEMBERS: (committeeId: string) => ['committees', committeeId, 'members'],
    ONE_MEMBER: (committeeId: string, id: string) => [
      'committees',
      committeeId,
      'members',
      id,
    ],
  },
  COMMITTEE_CATEGORIES: {
    ALL: ['categories'],
    ONE: (id: string) => ['categories', id],
  },
  CATEGORIES: {
    ALL: ['admin_categories'],
    ONE: (id: string) => ['admin_categories', id],
  },
  AWARDS: {
    ALL: ['awards'],
    ONE: (id: string) => ['awards', id],
  },
  BOARD: {
    ALL: ['board'],
  },
  WORKSHOPS: {
    ALL: ['workshops'],
    ONE: (id: string) => ['workshops', id],
    INSTRUCTORS: ['workshops', 'instructors'],
    REGISTRATIONS: (id: string) => ['workshops', id, 'registrations'],
  },
  RECRUITMENT: {
    ADMIN_VACANCIES: ['recruitment', 'admin', 'vacancies'],
    VACANCIES: ['recruitment', 'vacancies'],
    ADMIN_VACANCY_APPLICATIONS: (id: string) => [
      'recruitment',
      'vacancies',
      id,
      'applications',
    ],
  },
} as const;
