import { useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (otp: string) => void;
  disabled?: boolean;
  isDark?: boolean;
}

/**
 * Six individual boxes OTP input.
 * - Auto-advances focus on digit entry
 * - Backspace moves to previous box
 * - Paste fills all 6 boxes instantly
 */
export const OtpInput = ({
  value,
  onChange,
  disabled = false,
  isDark = false,
}: OtpInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const chars = Array.from({ length: 6 }, (_, i) => value[i] ?? '');

  const updateChar = (index: number, char: string) => {
    const next = [...chars];
    next[index] = char;
    onChange(next.join(''));
  };

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) return;
    const digit = raw[raw.length - 1];
    if (digit) updateChar(index, digit);
    if (index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (chars[index]) {
        updateChar(index, '');
      } else if (index > 0) {
        updateChar(index - 1, '');
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = Array.from({ length: 6 }, (_, i) => pasted[i] ?? '');
    onChange(next.join(''));
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" aria-label="OTP input">
      {chars.map((char, i) => (
        <input
          key={i}
          ref={el => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={char}
          disabled={disabled}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={e => e.target.select()}
          className={`
            w-11 h-13 text-center text-xl font-bold rounded-xl border-2 outline-none
            transition-all duration-150 caret-transparent
            focus:ring-2 focus:ring-offset-1 focus:ring-primary/30
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isDark
              ? char
                ? 'bg-primary/10 border-primary text-white'
                : 'bg-gray-800 border-gray-600 text-white focus:border-primary'
              : char
                ? 'bg-blue-50 border-primary text-gray-900'
                : 'bg-white border-gray-300 text-gray-900 focus:border-primary'
            }
          `}
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
};
