import React, { useState } from 'react';
import { Modal, InputField, TextArea, Button, Select } from '@ieee-ui/ui';
import { HiBriefcase } from 'react-icons/hi';
import { useTheme } from '@/shared/hooks/useTheme';
import { useAppSelector } from '@/shared/store/hooks';
import { RoleName } from '@/shared/types/auth.types';
import { Vacancy } from '@/shared/types/recruitment.types';
import { useApplyToVacancy } from '@/shared/queries/recruitment';
import { uploadApplicationFile } from '@/shared/queries/recruitment/recruitment.api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface VacancyApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacancy: Vacancy | null;
  hasApplied?: boolean;
}

export const VacancyApplyModal = ({ isOpen, onClose, vacancy, hasApplied }: VacancyApplyModalProps) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role?.name === RoleName.ADMIN || user?.role?.name === RoleName.SUPER_ADMIN;
  const applyMutation = useApplyToVacancy();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasCv = user?.cv_file_key || user?.cv_url;

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors((prev) => ({ ...prev, [questionId]: '' }));
    }
  };

  const handleFileChange = (questionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File is too large. Maximum size is 5MB.');
        return;
      }
      setFiles((prev) => ({ ...prev, [questionId]: file }));
      if (errors[questionId]) {
        setErrors((prev) => ({ ...prev, [questionId]: '' }));
      }
    }
  };

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!vacancy) return;

    // Validate
    const newErrors: Record<string, string> = {};
    const questions = vacancy.questions || [];
    questions.forEach((q) => {
      const id = q.id as string;
      if (q.is_required) {
        if (q.type === 'FILE') {
          if (!files[id]) newErrors[id] = 'This file is required.';
        } else {
          if (!answers[id] || !answers[id].trim()) newErrors[id] = 'This field is required.';
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const extra_data: Record<string, any> = { ...answers };
      
      // Upload files
      for (const [qId, file] of Object.entries(files)) {
        const { url } = await uploadApplicationFile(file);
        extra_data[qId] = url;
      }

      await applyMutation.mutateAsync({
        vacancyId: vacancy.id,
        data: { extra_data },
      });
      
      setAnswers({});
      setFiles({});
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        <div className={`flex gap-4 p-4 rounded-xl ${isDark ? 'bg-gray-700/60' : 'bg-gray-50'}`}>
          {vacancy.image_url ? (
            <img src={vacancy.image_url} alt={vacancy.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <HiBriefcase className="w-8 h-8 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-lg font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{vacancy.title}</h3>
              {vacancy.category?.name && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${isDark ? 'bg-primary/20 text-primary-light' : 'bg-primary/10 text-primary'}`}>
                  {vacancy.category.name}
                </span>
              )}
            </div>
            {vacancy.description && (
              <div
                className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} prose prose-sm max-w-none overflow-hidden break-words [prose-sm max-w-none_a]:break-all [prose-sm max-w-none_p]:break-words ${isDark ? 'prose-invert' : ''}`}
                dangerouslySetInnerHTML={{ __html: vacancy.description }}
              />
            )}
          </div>
        </div>

        {/* Form area */}
        {!isAuthenticated ? (
          <div className={`text-center p-8 rounded-xl border ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
            <h4 className={`text-base font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Sign in to Apply</h4>
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>You must be logged in to apply for vacancies.</p>
            <Button buttonText="Login / Register" onClick={() => navigate('/login')} type="primary" darkMode={isDark} />
          </div>
        ) : isAdmin ? (
          <div className={`text-center p-6 rounded-xl border ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Admins cannot apply to vacancies.</p>
          </div>
        ) : !hasCv ? (
          <div className={`text-center p-8 rounded-xl border ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
            <h4 className={`text-base font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>CV Required</h4>
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Please upload your CV in your Profile before applying.</p>
            <Button buttonText="Go to Profile" onClick={() => navigate('/profile')} type="primary" darkMode={isDark} />
          </div>
        ) : hasApplied ? (
          <div className={`text-center p-6 rounded-xl border ${isDark ? 'border-green-900/40 bg-green-900/20' : 'border-green-200 bg-green-50'}`}>
            <p className={`text-sm font-medium ${isDark ? 'text-green-300' : 'text-green-700'}`}>You have already applied to this position.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {vacancy.questions?.sort((a, b) => (a.order || 0) - (b.order || 0)).map((q) => {
              const qId = q.id as string;
              return (
                <div key={qId} className="space-y-1">
                  {q.type === 'TEXT' && (
                    <InputField
                      id={`q-${qId}`}
                      label={`${q.question_text}${q.is_required ? ' *' : ''}`}
                      value={answers[qId] || ''}
                      onChange={(e) => handleInputChange(qId, e.target.value)}
                      error={errors[qId]}
                      darkMode={isDark}
                    />
                  )}
                  {q.type === 'LONG_TEXT' && (
                    <TextArea
                      id={`q-${qId}`}
                      label={`${q.question_text}${q.is_required ? ' *' : ''}`}
                      value={answers[qId] || ''}
                      onChange={(e) => handleInputChange(qId, e.target.value)}
                      error={errors[qId]}
                      darkMode={isDark}
                    />
                  )}
                  {q.type === 'MULTIPLE_CHOICE' && (
                    <Select
                      id={`q-${qId}`}
                      label={`${q.question_text}${q.is_required ? ' *' : ''}`}
                      value={answers[qId] || ''}
                      onChange={(e) => handleInputChange(qId, e.target.value)}
                      options={[
                        { label: 'Select an option...', value: '' },
                        ...(q.options?.map((opt) => ({ label: opt, value: opt })) || []),
                      ]}
                      error={errors[qId]}
                      darkMode={isDark}
                    />
                  )}
                  {q.type === 'FILE' && (
                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {q.question_text}{q.is_required && ' *'}
                      </label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(qId, e)}
                        className={`block w-full text-sm ${isDark ? 'text-gray-300 file:bg-gray-700 file:text-gray-300' : 'text-gray-500 file:bg-gray-100 file:text-gray-700'} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold hover:file:bg-opacity-80 transition-colors cursor-pointer`}
                      />
                      {errors[qId] && <p className="text-red-500 text-xs mt-1">{errors[qId]}</p>}
                    </div>
                  )}
                </div>
              );
            })}
            
            {(!vacancy.questions || vacancy.questions.length === 0) && (
               <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} py-4`}>
                 No questions to answer. Click submit to apply with your CV.
               </p>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button buttonText="Cancel" onClick={onClose} type="basic" width="fit" darkMode={isDark} disabled={isSubmitting || applyMutation.isPending} />
              <Button
                buttonText="Submit Application"
                type="primary"
                width="fit"
                loading={isSubmitting || applyMutation.isPending}
                disabled={isSubmitting || applyMutation.isPending}
                darkMode={isDark}
                onClick={onSubmit}
              />
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
