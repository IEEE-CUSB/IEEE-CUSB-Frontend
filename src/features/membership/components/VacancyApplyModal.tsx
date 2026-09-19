import { Modal } from '@ieee-ui/ui';
import { useTheme } from '@/shared/hooks/useTheme';
import { Vacancy } from '@/shared/types/recruitment.types';
import { VacancyApplicationForm } from './VacancyApplicationForm';

interface VacancyApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacancy: Vacancy | null;
  hasApplied?: boolean;
}

export const VacancyApplyModal = ({
  isOpen,
  onClose,
  vacancy,
  hasApplied,
}: VacancyApplyModalProps) => {
  const { isDark } = useTheme();

  if (!vacancy) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply for ${vacancy.title}`}
      size="large"
    >
      <div className="space-y-6">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{vacancy.title}</h3>
          {vacancy.description && (
            <div
              className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} prose prose-sm max-w-none overflow-hidden break-words [prose-sm max-w-none_a]:break-all [prose-sm max-w-none_p]:break-words ${isDark ? 'prose-invert' : ''}`}
              dangerouslySetInnerHTML={{ __html: vacancy.description }}
            />
          )}
        </div>

        <VacancyApplicationForm
          vacancy={vacancy}
          isDark={isDark}
          onSuccess={onClose}
          onCancel={onClose}
          hasApplied={hasApplied}
        />
      </div>
    </Modal>
  );
};
