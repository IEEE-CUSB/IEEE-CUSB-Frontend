import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from './auth.api';
import { QUERY_KEYS } from '@/shared/constants/apiConstants';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import {
  setUser,
  setAccessToken,
  clearAuth,
} from '@/shared/store/slices/authSlice';
import type { UpdateUserRequest } from '@/shared/types/auth.types';

/**
 * Hook to get the current authenticated user
 * Fetches user data on app load if there's a valid token
 */
export const useCurrentUser = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const accessToken = useAppSelector(state => state.auth.access_token);

  return useQuery({
    queryKey: QUERY_KEYS.AUTH.CURRENT_USER,
    queryFn: async () => {
      const data = await authApi.getMe();
      dispatch(setUser(data.user));
      dispatch(setAccessToken(data.access_token));
      return data.user;
    },
    enabled: isAuthenticated && !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

/**
 * Hook for user login
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: data => {
      // Store access token in localStorage (refresh token is httpOnly cookie)
      localStorage.setItem('access_token', data.access_token);

      // Update Redux store
      dispatch(setUser(data.user));
      dispatch(setAccessToken(data.access_token));

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.CURRENT_USER });

      toast.success('Login successful! Welcome back.');
      navigate('/');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    },
  });
};

/**
 * Hook for user registration.
 * After success, calls onSuccess({ email }) so the page can open the OTP modal.
 * Navigation happens after email verification, not immediately.
 */
export const useRegister = (onSuccess?: (email: string) => void) => {
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (_data, variables) => {
      // Extract email from whatever was passed (FormData or plain object)
      const email =
        variables instanceof FormData
          ? (variables.get('email') as string)
          : (variables as any).email;
      toast.success('Account created! Please verify your email.');
      onSuccess?.(email);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        'Registration failed. Please try again.';
      toast.error(message);
    },
  });
};

/**
 * Hook for updating the current user's profile
 */
export const useUpdateUser = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      authApi.updateUser(id, data),
    onSuccess: updatedUser => {
      dispatch(setUser(updatedUser));
      queryClient.setQueryData(QUERY_KEYS.AUTH.CURRENT_USER, updatedUser);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.CURRENT_USER });
      toast.success('Profile updated successfully.');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to update profile.';
      toast.error(message);
    },
  });
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear access token from localStorage
      localStorage.removeItem('access_token');

      // Clear Redux store
      dispatch(clearAuth());

      // Clear all queries
      queryClient.clear();

      toast.success('Logged out successfully.');
      navigate('/login');
    },
    onError: () => {
      // Even if API call fails, clear local data
      localStorage.removeItem('access_token');
      dispatch(clearAuth());
      queryClient.clear();
      navigate('/login');
    },
  });
};

/**
 * Hook to send email OTP for verification
 * Requires authentication — backend gets email from JWT
 */
export const useSendEmailOTP = () => {
  return useMutation({
    mutationFn: authApi.sendEmailOTP,
    onSuccess: () => {
      toast.success('OTP sent to your email. Please check your inbox.');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        'Failed to send OTP. Please try again.';
      toast.error(message);
    },
  });
};

/**
 * Hook to verify email with OTP
 */
export const useVerifyEmailOTP = () => {
  return useMutation({
    mutationFn: authApi.verifyEmailOTP,
    onSuccess: () => {
      toast.success('Email verified successfully!');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Invalid OTP. Please try again.';
      toast.error(message);
    },
  });
};

/**
 * Hook to send password reset OTP
 */
export const useSendPasswordOTP = () => {
  return useMutation({
    mutationFn: authApi.sendPasswordOTP,
    onSuccess: () => {
      toast.success('OTP sent to your email for password reset.');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        'Failed to send OTP. Please try again.';
      toast.error(message);
    },
  });
};

/**
 * Hook to check password reset OTP
 */
export const useCheckPasswordOTP = () => {
  return useMutation({
    mutationFn: authApi.checkPasswordOTP,
  });
};

/**
 * Hook to reset password with OTP
 */
export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successfully! Please login.');
      navigate('/login');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        'Failed to reset password. Please try again.';
      toast.error(message);
    },
  });
};

/**
 * Hook to change password (requires authentication)
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        'Failed to change password. Please try again.';
      toast.error(message);
    },
  });
};

/**
 * Hook to complete OAuth profile
 */
export const useCompleteOAuthProfile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.completeOAuthProfile,
    onSuccess: () => {
      // Invalidate current user query to refetch updated data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.CURRENT_USER });

      toast.success('Profile completed successfully!');
      navigate('/');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        'Failed to complete profile. Please try again.';
      toast.error(message);
    },
  });
};

/**
 * Hook to send email verification OTP (public — no JWT required).
 * Used right after registration.
 */
export const useSendEmailOTPPublic = () => {
  return useMutation({
    mutationFn: authApi.sendEmailOTPPublic,
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        'Failed to send OTP. Please try again.';
      toast.error(message);
    },
  });
};

/**
 * Hook to verify email OTP (public — no JWT required).
 * Used right after registration.
 */
export const useVerifyEmailOTPPublic = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: authApi.verifyEmailOTPPublic,
    onSuccess: () => {
      toast.success('Email verified! Please log in.');
      onSuccess?.();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        'Invalid or expired OTP. Please try again.';
      toast.error(message);
    },
  });
};
