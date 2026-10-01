import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiX } from 'react-icons/fi';
import { useTheme } from '@/shared/hooks/useTheme';
import { useSendEmailOTP, useVerifyEmailOTP } from '@/shared/queries/auth';
import { OtpInput } from './OtpInput';
import logo from '@/assets/logo.png';

interface VerifyEmailModalProps {
  email: string;
  onClose: () => void;
}

const RESEND_SECONDS = 60;

function maskEmail(email: string) {
  const parts = email.split('@');
  const user = parts[0] || '';
  const domain = parts[1];
  if (!domain || !user) return email;
  const visible = user.length > 2 ? user.slice(0, 2) : user[0];
  return `${visible}***@${domain}`;
}

/**
 * Modal shown after registration to prompt the user to enter
 * the 6-digit OTP sent to their email.
 */
export const VerifyEmailModal = ({ email, onClose }: VerifyEmailModalProps) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);

  const { mutate: sendOTP, isPending: isSending } = useSendEmailOTP();
  const { mutate: verifyOTP, isPending: isVerifying } = useVerifyEmailOTP(
    () => navigate('/login'),
  );

  // Send OTP as soon as the modal mounts
  useEffect(() => {
    sendOTP({ email });
  }, [email]); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleResend = useCallback(() => {
    if (!canResend) return;
    setOtp('');
    setCanResend(false);
    setCountdown(RESEND_SECONDS);
    sendOTP({ email });
  }, [canResend, email, sendOTP]);

  const handleVerify = () => {
    if (otp.length !== 6) return;
    verifyOTP({ email, otp });
  };

  const handleClose = () => {
    // Account is created — just tell user to verify later via login
    navigate('/login');
    onClose();
  };

  const isPending = isSending || isVerifying;
  const isComplete = otp.length === 6;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
        onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
      >
        {/* Modal card */}
        <div
          className={`
            relative w-full max-w-md rounded-2xl shadow-2xl p-8
            transition-colors duration-300
            ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'}
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby="verify-email-title"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className={`
              absolute top-4 right-4 p-2 rounded-lg transition-colors
              ${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}
            `}
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="IEEE CUSB" className="h-10 w-auto" />
          </div>

          {/* Icon */}
          <div className={`mx-auto mb-5 w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? 'bg-primary/10' : 'bg-blue-50'}`}>
            <FiMail className="w-7 h-7 text-primary" />
          </div>

          {/* Text */}
          <div className="text-center mb-8">
            <h2
              id="verify-email-title"
              className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Verify your email
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              We sent a 6-digit code to{' '}
              <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                {maskEmail(email)}
              </span>
              . Enter it below to activate your account.
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <OtpInput
              value={otp}
              onChange={setOtp}
              disabled={isPending}
              isDark={isDark}
            />
          </div>

          {/* Verify button */}
          <button
            onClick={handleVerify}
            disabled={!isComplete || isPending}
            className={`
              w-full py-3 px-4 rounded-xl font-semibold text-base transition-all duration-200
              ${isComplete && !isPending
                ? 'bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg active:scale-[0.98]'
                : isDark
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isVerifying ? 'Verifying…' : 'Verify Email'}
          </button>

          {/* Resend */}
          <div className="mt-5 text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={isSending}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
              >
                {isSending ? 'Sending…' : 'Resend code'}
              </button>
            ) : (
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Resend in{' '}
                <span className={`font-semibold tabular-nums ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
                </span>
              </p>
            )}
          </div>

          {/* Hint */}
          <p className={`mt-5 text-xs text-center leading-relaxed ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            You can also verify later from the login page.
          </p>
        </div>
      </div>
    </>
  );
};
