import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { loginSchema, type LoginFormData } from '@/features/auth/schemas';
import { useLogin } from '@/shared/queries/auth';
import { Button, InputField } from '@ieee-ui/ui';
import logo from '@/assets/logo.png';
import { useTheme } from '@/shared/hooks/useTheme';

/**
 * Login Page Component
 */
export const LoginPage = () => {
  const { isDark } = useTheme();
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div
        className={`absolute inset-0 bg-linear-to-br transition-colors duration-500 ${
          isDark
            ? 'from-gray-900 via-blue-900 to-gray-900'
            : 'from-blue-50 via-purple-50 to-pink-50'
        } animate-gradient-xy`}
      >
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(0,10,50,0.5),rgba(0,0,0,0))]'
              : 'bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]'
          }`}
        />
      </div>

      <Link
        to="/"
        className={`absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
          isDark
            ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-700/50'
            : 'bg-white/50 text-gray-600 hover:bg-white hover:text-gray-900 border border-gray-200/50'
        } backdrop-blur-md shadow-sm`}
      >
        <FiArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div
          className={`backdrop-blur-xl rounded-2xl shadow-2xl border transition-all duration-300 p-8 ${
            isDark
              ? 'bg-gray-800/80 border-gray-700/50 shadow-blue-900/20'
              : 'bg-white/80 border-white/20 shadow-gray-200'
          }`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Link to="/" className="inline-block hover:scale-105 transition-transform duration-300">
                <img
                  src={logo}
                  alt="IEEE CUSB Logo"
                  className={`h-20 w-20 object-contain transition-all duration-300 ${isDark ? 'drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]' : ''}`}
                />
              </Link>
            </div>
            <h1
              className={`text-3xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Welcome Back
            </h1>
            <p
              className={`transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Sign in to your IEEE CUSB account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email/Username Field */}
            <div>
              <label
                htmlFor="identifier"
                className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}
              >
                Email or Username
              </label>
              <InputField
                id="identifier"
                type="text"
                placeholder="Enter your email or username"
                {...register('identifier')}
                error={errors.identifier?.message}
                disabled={isPending}
                darkMode={isDark}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}
              >
                Password
              </label>
              <InputField
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                error={errors.password?.message}
                disabled={isPending}
                darkMode={isDark}
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className={`text-sm font-medium transition-colors duration-300 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              htmlType="submit"
              onClick={() => {}}
              type="primary"
              className="w-full"
              disabled={isPending}
              loading={isPending}
              darkMode={isDark}
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider commented out
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div
                  className={`w-full border-t transition-colors duration-300 ${isDark ? 'border-gray-700' : 'border-gray-300'}`}
                />
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className={`px-2 transition-all duration-300 ${isDark ? 'bg-gray-800/80 text-gray-400' : 'bg-white/80 text-gray-500'}`}
                >
                  Or continue with
                </span>
              </div>
            </div>
          </div>
          */}

          {/* OAuth Buttons commented out
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="basic"
              onClick={() =>
                (window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`)
              }
              disabled={isPending}
              darkMode={isDark}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              type="basic"
              onClick={() =>
                (window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/github`)
              }
              disabled={isPending}
              darkMode={isDark}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </Button>
          </div>
          */}

          {/* Sign Up Link */}
          <p
            className={`mt-8 text-center text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Don't have an account?{' '}
            <Link
              to="/register"
              className={`font-medium transition-colors duration-300 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
