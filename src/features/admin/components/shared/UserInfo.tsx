import { useEffect, useState } from 'react';
import {
  FiAward,
  FiDownload,
  FiEye,
  FiFileText,
  FiLoader,
  FiMail,
  FiPhone,
  FiUser,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { User } from '@/shared/types/auth.types';
import { ApplicationExtraData } from '@/shared/types/recruitment.types';
import { usersApi } from '@/shared/queries/users/users.queries';
import toast from 'react-hot-toast';

interface UserInfoProps {
  isOpen: boolean;
  onClose: () => void;
  User?: User;
  extraDetails?: ApplicationExtraData;
  side?: 'left' | 'right';
  width?: string;
}

const value = (input: string | number | null | undefined) =>
  input === null || input === undefined || input === '' ? 'Not provided' : String(input);

const hasCv = (user?: User) => Boolean(user?.cv_file_key || user?.cv_url);

export default function UserInfo({
  isOpen,
  onClose,
  User,
  extraDetails,
  side = 'right',
  width = 'min(92vw, 820px)',
}: UserInfoProps) {
  const [cvLoading, setCvLoading] = useState<'view' | 'download' | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const sideClasses = side === 'right' ? 'right-0' : 'left-0';
  const translateClosed = side === 'right' ? 'translate-x-full' : '-translate-x-full';
  const initials =
    User?.name
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase() || 'U';
  const details = [
    { label: 'Email', value: User?.email, icon: FiMail },
    { label: 'Phone', value: User?.phone, icon: FiPhone },
    { label: 'Faculty', value: User?.faculty, icon: FiAward },
    { label: 'University', value: User?.university, icon: FiAward },
    { label: 'Academic year', value: User?.academic_year, icon: FiUsers },
    { label: 'Major', value: User?.major, icon: FiAward },
  ];

  const handleCv = async (action: 'view' | 'download') => {
    if (!User || !hasCv(User)) return;

    setCvLoading(action);
    try {
      if (action === 'view') {
        await usersApi.adminViewCv(User.id);
      } else {
        await usersApi.adminDownloadCv(User.id, `${User.name.replace(/\s+/g, '_')}_CV.pdf`);
      }
    } catch {
      toast.error(`Failed to ${action} CV. Please try again.`);
    } finally {
      setCvLoading(null);
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={User?.name ? 'slideout-title' : undefined}
        className={`fixed top-0 ${sideClasses} z-50 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : translateClosed
        }`}
        style={{ width }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close user details"
          className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-gray-500 shadow-sm transition hover:bg-white hover:text-gray-800"
        >
          <FiX className="h-5 w-5" />
        </button>

        <div className="h-full overflow-y-auto bg-background p-4 sm:p-6">
          {!User ? (
            <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
              No user selected.
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background px-6 py-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-5">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
                      {initials}
                    </div>
                    <div>
                      <h3 id="slideout-title" className="text-2xl font-semibold text-foreground">
                        {User.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">@{User.username}</p>
                    </div>
                  </div>
                  <span className="w-fit rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground">
                    {User.role?.name || 'Visitor'}
                  </span>
                </div>
              </div>

              <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6">
                  <div className="rounded-2xl border border-border bg-background/70 p-5">
                    <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                      <FiUser className="h-5 w-5 text-primary" />
                      About
                    </div>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {User.bio || 'No bio added yet.'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/70 p-5">
                    <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                      <FiAward className="h-5 w-5 text-primary" />
                      Account details
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {details.map(({ label, value: detailValue, icon: Icon }) => (
                        <div key={label} className="rounded-xl border border-border bg-background px-3 py-3">
                          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <Icon className="h-4 w-4 text-primary" />
                            {label}
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{value(detailValue)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {extraDetails && Object.keys(extraDetails).length > 0 && (
                    <div className="rounded-2xl border border-border bg-background/70 p-5">
                      <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                        <FiFileText className="h-5 w-5 text-primary" />
                        Form Responses
                      </div>
                      <div className="mt-4 space-y-4">
                        {Object.entries(extraDetails).map(([question, answer]) => (
                          <div key={question}>
                            <p className="text-sm font-semibold text-foreground">{question}</p>
                            {typeof answer === 'string' && answer.startsWith('http') ? (
                              <a href={answer} target="_blank" rel="noopener noreferrer" className="block break-all text-sm mt-1 text-primary hover:underline">
                                {answer}
                              </a>
                            ) : (
                              <p className="mt-1 text-sm leading-6 text-muted-foreground">{String(answer)}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-border bg-background/70 p-5">
                  <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <FiFileText className="h-5 w-5 text-primary" />
                    CV
                  </div>
                  {hasCv(User) ? (
                    <div className="mt-5 rounded-xl border border-dashed border-border bg-background p-4">
                      <p className="text-sm font-semibold text-foreground">
                        {User.name.replace(/\s+/g, '_')}_CV.pdf
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">PDF document</p>
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => handleCv('view')}
                          disabled={cvLoading !== null}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
                        >
                          {cvLoading === 'view' ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiEye className="h-4 w-4" />}
                          View CV
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCv('download')}
                          disabled={cvLoading !== null}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-60"
                        >
                          {cvLoading === 'download' ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiDownload className="h-4 w-4" />}
                          Download
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-xl border border-dashed border-border bg-background p-6 text-center text-sm text-muted-foreground">
                      No CV uploaded for this user.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
