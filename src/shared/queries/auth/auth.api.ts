import { apiClient } from '@/shared/config/api.config';
import { API_ENDPOINTS } from '@/shared/constants/apiConstants';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenResponse,
  SendOTPRequest,

  ResetPasswordRequest,
  ChangePasswordRequest,
  CompleteOAuthProfileRequest,
  UpdateUserRequest,
  User,
} from '@/shared/types/auth.types';

/**
 * Authentication API Service
 */
export const authApi = {
  /**
   * Login user with email/username and password
   * Backend sets refresh_token as httpOnly cookie
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    return response.data.data;
  },

  /**
   * Register new user (default role: Visitor)
   * Note: Backend does NOT return tokens on registration
   */
  register: async (data: RegisterRequest | FormData): Promise<User> => {
    const response = await apiClient.post<ApiResponse<{ user: User }>>(
      API_ENDPOINTS.AUTH.REGISTER,
      data,
      data instanceof FormData
        ? {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        : undefined
    );
    return response.data.data.user;
  },

  /**
   * Logout user
   * Backend reads refresh_token from httpOnly cookie
   */
  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  /**
   * Update the authenticated user's profile information
   */
  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.patch<ApiResponse<User>>(
      API_ENDPOINTS.USERS.UPDATE_USER(id),
      data
    );
    return response.data.data;
  },

  /**
   * Get current authenticated user
   * Refreshes token via cookie, decodes JWT for user ID, then fetches user
   */
  getMe: async (): Promise<{ user: User; access_token: string }> => {
    // 1. Refresh the token (cookie-based)
    const refreshResponse = await authApi.refreshToken();
    const accessToken = refreshResponse.access_token;

    // 2. Decode the token to get user ID
    const { parseJwt } = await import('@/shared/utils/helpers');
    const decoded = parseJwt(accessToken);

    if (!decoded || !decoded.id) {
      throw new Error('Failed to decode token');
    }

    // 3. Fetch user details using the new token
    const userResponse = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.USERS.GET_USER(decoded.id),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // 4. Update localStorage with new access token
    localStorage.setItem('access_token', accessToken);

    return { user: userResponse.data.data, access_token: accessToken };
  },

  /**
   * Refresh access token
   * Refresh token is sent automatically via httpOnly cookie
   */
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      {} // No body — refresh token is in httpOnly cookie
    );
    return response.data.data;
  },

  /**
   * Send email verification OTP.
   * Used immediately after registration before any token exists.
   */
  sendEmailOTP: async (data: SendOTPRequest): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.SEND_EMAIL_OTP, data);
  },

  /**
   * Verify email OTP.
   * Used immediately after registration before any token exists.
   */
  verifyEmailOTP: async (data: {
    email: string;
    otp: string;
  }): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.AUTH.VERIFY_EMAIL_OTP, data);
  },

  /**
   * Send OTP to email for password reset (public endpoint)
   */
  sendPasswordOTP: async (data: SendOTPRequest): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.SEND_PASSWORD_OTP, data);
  },

  /**
   * Check password reset OTP without resetting password
   */
  checkPasswordOTP: async (data: { email: string; otp: string }): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.CHECK_PASSWORD_OTP, data);
  },

  /**
   * Reset password with OTP
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },

  /**
   * Change password (requires authentication)
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },

  /**
   * Complete OAuth profile after social login
   */
  completeOAuthProfile: async (
    data: CompleteOAuthProfileRequest
  ): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.COMPLETE_OAUTH_PROFILE, data);
  },
};
