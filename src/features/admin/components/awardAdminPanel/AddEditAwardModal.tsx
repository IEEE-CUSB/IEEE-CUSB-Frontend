import React, { useState, useEffect, useRef } from 'react';
import { InputField, Button, TextArea, Modal } from '@ieee-ui/ui';
import { useTheme } from '@/shared/hooks/useTheme';
import type {
  Award,
  AwardFormValues,
  AwardFormErrors,
  CreateAwardRequest,
  UpdateAwardRequest,
} from '@/shared/types/award.types';
import { AwardSource, AWARD_SOURCE_LABELS } from '@/shared/types/award.types';
import { useUploadAwardImage, useDeleteAwardImage } from '@/shared/queries/awards';
import { FiUpload, FiTrash2, FiImage, FiX } from 'react-icons/fi';
import IEEETrophy from '@/assets/IEEE_Trophy.png';

interface AddEditAwardModalProps {
  award?: Award;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateAwardRequest | UpdateAwardRequest, id?: string) => Promise<Award | undefined>;
  isPending?: boolean;
}

const emptyForm = (): AwardFormValues => ({
  title: '',
  description: '',
  won_count: '',
  years: String(new Date().getFullYear()),
  source: AwardSource.EGYPT_SECTION,
});

const awardToForm = (award?: Award): AwardFormValues => {
  if (!award) return emptyForm();
  return {
    title: award.title,
    description: award.description,
    won_count: String(award.won_count ?? 0),
    years: award.years ? award.years.join(', ') : String(new Date().getFullYear()),
    source: award.source ?? AwardSource.EGYPT_SECTION,
  };
};

const validate = (values: AwardFormValues): AwardFormErrors => {
  const errors: AwardFormErrors = {};
  if (!values.title.trim()) {
    errors.title = 'Title is required.';
  } else if (values.title.trim().length < 6) {
    errors.title = 'Title must be at least 6 characters.';
  } else if (values.title.trim().length > 100) {
    errors.title = 'Title must be less than 100 characters.';
  }

  if (!values.description.trim()) {
    errors.description = 'Description is required.';
  } else if (values.description.trim().length < 6) {
    errors.description = 'Description must be at least 6 characters.';
  } else if (values.description.trim().length > 1000) {
    errors.description = 'Description must be less than 1000 characters.';
  }
  const count = Number(values.won_count);
  if (values.won_count === '' || isNaN(count) || !Number.isInteger(count) || count < 1)
    errors.won_count = 'Times Won is required and must be at least 1.';
  if (!values.years.trim()) {
    errors.years = 'Years are required.';
  } else {
    const yearsArr = values.years.split(',').map(y => Number(y.trim()));
    if (yearsArr.some(y => isNaN(y) || y < 1900 || y > 2100))
      errors.years = 'Enter valid years (comma separated, e.g. 2025, 2024).';
  }
  return errors;
};

const AddEditAwardModal: React.FC<AddEditAwardModalProps> = ({
  award,
  isOpen,
  onClose,
  onSave,
  isPending = false,
}) => {
  const { isDark } = useTheme();
  const isEditMode = !!award;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formValues, setFormValues] = useState<AwardFormValues>(awardToForm(award));
  const [errors, setErrors] = useState<AwardFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  // Local file state for preview (upload happens on Save)
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleteImage, setDeleteImage] = useState(false);

  const uploadImage = useUploadAwardImage();
  const removeImage = useDeleteAwardImage();

  // Reset form whenever the modal opens or the target award changes
  useEffect(() => {
    setFormValues(awardToForm(award));
    setErrors({});
    setPendingFile(null);
    setPreviewUrl(null);
    setDeleteImage(false);
    setIsSaving(false);
  }, [award, isOpen]);

  // Cleanup object URL when pendingFile changes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange =
    (field: keyof AwardFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setFormValues(prev => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormValues(prev => ({ ...prev, description: e.target.value }));
    if (errors.description)
      setErrors(prev => ({ ...prev, description: undefined }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setDeleteImage(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearPending = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(null);
    setPreviewUrl(null);
  };

  const handleMarkDelete = () => {
    setDeleteImage(true);
    handleClearPending();
  };

  const handleSave = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const validationErrors = validate(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSaving(true);

    const payload: CreateAwardRequest | UpdateAwardRequest = {
      title: formValues.title.trim(),
      description: formValues.description.trim(),
      won_count: formValues.won_count !== '' ? Number(formValues.won_count) : 0,
      years: formValues.years.split(',').map(y => Number(y.trim())),
      source: formValues.source,
    };

    if (isEditMode && award?.id) {
      // ── EDIT MODE: upload/delete image first, then update metadata ──
      try {
        const promises = [];
        if (pendingFile) promises.push(uploadImage.mutateAsync({ id: award.id, file: pendingFile }));
        if (deleteImage) promises.push(removeImage.mutateAsync(award.id));
        await Promise.all(promises);
      } catch {
        setIsSaving(false);
        return;
      }

      try {
        await onSave(payload, award.id);
      } catch {
        setIsSaving(false);
      }
    } else {
      // ── CREATE MODE: create award first, then upload image with the new id ──
      let newAward: Award | undefined;
      try {
        newAward = await onSave(payload);
      } catch {
        setIsSaving(false);
        return;
      }

      if (newAward?.id && pendingFile) {
        try {
          await uploadImage.mutateAsync({ id: newAward.id, file: pendingFile });
        } catch {
          // Image upload failure is already toasted by the mutation;
          // the award itself was created successfully so we don't block.
        }
      }
    }
  };

  // The image to display: pending preview > existing API url > fallback trophy
  const displayImage = previewUrl ?? (deleteImage ? null : award?.image_url ?? null);

  const isImagePending = uploadImage.isPending || removeImage.isPending;

  return (
    <Modal
      title={isEditMode ? 'Edit Award' : 'Add New Award'}
      isOpen={isOpen}
      onClose={onClose}
      size="large"
      darkMode={isDark}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Title */}
          <div className="md:col-span-2">
            <InputField
              label="Award Title"
              value={formValues.title}
              placeholder="Enter award title"
              onChange={handleChange('title')}
              id="award-title"
              error={errors.title}
              darkMode={isDark}
            />
          </div>

          {/* Years */}
          <div>
            <InputField
              label="Years (comma separated)"
              value={formValues.years}
              placeholder="2025, 2024"
              onChange={handleChange('years')}
              id="award-years"
              error={errors.years}
              darkMode={isDark}
            />
          </div>
          <div>
            <label
              htmlFor="award-source"
              className={`block text-sm font-medium mb-1.5 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Source
            </label>
            <select
              id="award-source"
              value={formValues.source}
              onChange={handleChange('source') as any}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white focus:border-primary'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-primary'
              }`}
            >
              {Object.values(AwardSource).map(s => (
                <option key={s} value={s}>
                  {AWARD_SOURCE_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          {/* Won Count */}
          <div className="md:col-span-2">
            <InputField
              label="Times Won"
              value={formValues.won_count}
              placeholder="1"
              onChange={handleChange('won_count')}
              id="award-won-count"
              error={errors.won_count}
              darkMode={isDark}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={formValues.description}
              placeholder="Enter award description"
              onChange={handleTextAreaChange}
              id="award-description"
              maxLength={1000}
              error={errors.description}
              darkMode={isDark}
            />
          </div>

          {/* Award Image */}
          <div className="md:col-span-2">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Award Image
            </label>

            <div
              className={`rounded-xl border-2 border-dashed transition-colors ${
                isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              {displayImage ? (
                /* ── Image preview ── */
                <div className="flex items-center gap-4 p-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={displayImage}
                      alt="Award"
                      className="w-24 h-24 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                      onError={e => { (e.currentTarget as HTMLImageElement).src = IEEETrophy; }}
                    />
                    {pendingFile && (
                      <span className="absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-white leading-none">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {pendingFile ? (
                      <p className={`text-sm font-medium truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {pendingFile.name}
                      </p>
                    ) : (
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Current image
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isDark
                            ? 'bg-primary/20 text-primary-light hover:bg-primary/30'
                            : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}
                      >
                        <FiUpload className="w-3.5 h-3.5" />
                        {pendingFile ? 'Change' : 'Replace'}
                      </button>
                      {pendingFile ? (
                        <button
                          type="button"
                          onClick={handleClearPending}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isDark
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <FiX className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleMarkDelete}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isDark
                              ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* ── Upload prompt ── */
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full flex flex-col items-center gap-2 py-8 rounded-xl transition-colors ${
                    isDark ? 'hover:bg-gray-700/50 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <FiImage className="w-8 h-8 opacity-60" />
                  <span className="text-sm font-medium">Click to select an image</span>
                  <span className="text-xs opacity-60">JPG, PNG or WebP</span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {isImagePending && (
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Uploading image…
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            buttonText="Cancel"
            onClick={onClose}
            type="basic"
            width="fit"
            darkMode={isDark}
            disabled={isPending || isSaving}
          />
          <Button
            buttonText={isPending || isSaving ? 'Saving…' : isEditMode ? 'Save Changes' : 'Create Award'}
            onClick={handleSave}
            type="primary"
            width="fit"
            darkMode={isDark}
            disabled={isPending || isSaving}
            loading={isPending || isSaving}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddEditAwardModal;
