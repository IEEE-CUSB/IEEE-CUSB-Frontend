import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, InputField, TextArea, Button } from '@ieee-ui/ui';
import { HiBriefcase } from 'react-icons/hi';
import { useTheme } from '@/shared/hooks/useTheme';
import { useAppSelector } from '@/shared/store/hooks';
import { RoleName } from '@/shared/types/auth.types';
import { Vacancy } from '@/shared/types/recruitment.types';
import { useApplyToVacancy } from '@/shared/queries/recruitment';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  portfolio: z
    .string()
    .url('Must be a valid URL (e.g. https://github.com/...)')
    .or(z.literal(''))
    .optional(),
  why_join: z
    .string()
    .min(10, 'Please tell us why you want to join (min 10 characters)')
    .trim(),
});

type FormData = z.infer<typeof schema>;

interface VacancyApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacancy: Vacancy | null;
  hasApplied?: boolean;
}

export const VacancyApplyModal = ({ isOpen, onClose, vacancy, hasApplied }: VacancyApplyModalProps) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const isAdmin = user?.role?.name === RoleName.ADMIN || user?.role?.name === RoleName.SUPER_ADMIN;
  const applyMutation = useApplyToVacancy();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { portfolio: '', why_join: '' },
  });

  const onSubmit = async (data: FormData) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!vacancy) return;
    await applyMutation.mutateAsync({
      vacancyId: vacancy.id,
      data: { extra_data: { why_join: data.why_join, portfolio: data.portfolio || undefined } },
    });
    reset();
    onClose();
  };

  if (!vacancy) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Position"
      size="large"
      darkMode={isDark}
    >
      <div className="space-y-6">
        {/* Vacancy Details Header */}
        <div className={`flex gap-4 p-4 rounded-xl ${
          isDark ? 'bg-gray-700/60' : 'bg-gray-50'
        }`}>
          {vacancy.image_url ? (
            <img src={vacancy.image_url} alt={vacancy.title}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <HiBriefcase className="w-8 h-8 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-lg font-bold truncate ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{vacancy.title}</h3>
              {vacancy.category?.name && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                  isDark ? 'bg-primary/20 text-primary-light' : 'bg-primary/10 text-primary'
                }`}>
                  {vacancy.category.name}
                </span>
              )}
            </div>
            {vacancy.description && (
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>{vacancy.description}</p>
            )}
          </div>
        </div>

        {/* Form area */}
        {!isAuthenticated ? (
          <div className={`text-center p-8 rounded-xl border ${
            isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
          }`}>
            <h4 className={`text-base font-semibold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Sign in to Apply</h4>
            <p className={`text-sm mb-4 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>You must be logged in to apply for vacancies.</p>
            <Button buttonText="Login / Register" onClick={() => navigate('/login')} type="primary" darkMode={isDark} />
          </div>
        ) : isAdmin ? (
          <div className={`text-center p-6 rounded-xl border ${
            isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
          }`}>
            <p className={`text-sm ${ isDark ? 'text-gray-400' : 'text-gray-500' }`}>
              Admins cannot apply to vacancies.
            </p>
          </div>
        ) : hasApplied ? (
          <div className={`text-center p-6 rounded-xl border ${
            isDark ? 'border-green-900/40 bg-green-900/20' : 'border-green-200 bg-green-50'
          }`}>
            <p className={`text-sm font-medium ${ isDark ? 'text-green-300' : 'text-green-700' }`}>
              You have already applied to this position.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="portfolio"
              control={control}
              render={({ field }) => (
                <InputField
                  id="portfolio"
                  label="Portfolio / LinkedIn URL (Optional)"
                  placeholder="https://..."
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  error={errors.portfolio?.message}
                  darkMode={isDark}
                />
              )}
            />
            <Controller
              name="why_join"
              control={control}
              render={({ field }) => (
                <TextArea
                  id="why_join"
                  label="Why do you want to join us?"
                  placeholder="Tell us about your motivation..."
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.why_join?.message}
                  darkMode={isDark}
                />
              )}
            />
            <div className="flex gap-3 pt-2">
              <Button buttonText="Cancel" onClick={onClose} type="basic" width="fit" darkMode={isDark} />
              <Button
                buttonText="Submit Application"
                type="primary"
                width="fit"
                loading={applyMutation.isPending}
                disabled={applyMutation.isPending}
                darkMode={isDark}
                onClick={handleSubmit(onSubmit)}
              />
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
