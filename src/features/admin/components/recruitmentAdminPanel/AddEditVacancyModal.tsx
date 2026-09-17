import React, { useState, useRef, useEffect } from 'react';
import { InputField, Button, TextArea, Modal, Select } from '@ieee-ui/ui';
import { useTheme } from '@/shared/hooks/useTheme';
import { FiUpload, FiTrash2, FiImage, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import {
  AddVacancy,
  UpdateVacancy,
  Vacancy,
} from '@/shared/types/recruitment.types';
import { CategoryType } from '@/shared/types/category.types';
import { useUploadVacancyImage, useDeleteVacancyImage } from '@/shared/queries/recruitment';
import { useGetCategories } from '@/shared/queries/categories/categories.queries';

interface ExtendedAddEditVacancyModalProps {
  vacancy?: Vacancy;
  apiVacancy?: Vacancy;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddVacancy | UpdateVacancy, id?: string) => Promise<void>;
  isPending?: boolean;
}

interface FormValues {
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  is_open: boolean;
  category_id: string;
}

const empty = (): FormValues => ({
  title: '',
  description: '',
  created_at: '',
  updated_at: '',
  is_open: true,
  category_id: '',
});

const formatDateForInput = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

const toForm = (v?: Vacancy): FormValues =>
  v
    ? {
        title: v.title,
        description: v.description ?? '',
        created_at: formatDateForInput(v.created_at),
        updated_at: formatDateForInput(v.updated_at),
        is_open: v.is_open,
        category_id: v.category_id ?? v.category?.id ?? '',
      }
    : empty();

type Errs = Partial<Record<keyof FormValues, string>>;

const validate = (v: FormValues): Errs => {
  const e: Errs = {};
  if (!v.title.trim()) {
    e.title = 'Title is required.';
  } else if (v.title.trim().length < 6) {
    e.title = 'Title must be at least 6 characters.';
  } else if (v.title.trim().length > 100) {
    e.title = 'Title must be less than 100 characters.';
  }

  if (!v.description.trim()) {
    e.description = 'Description is required.';
  } else if (v.description.trim().length < 6) {
    e.description = 'Description must be at least 6 characters.';
  } else if (v.description.trim().length > 1000) {
    e.description = 'Description must be less than 1000 characters.';
  }
  return e;
};

export const AddEditVacancyModal: React.FC<ExtendedAddEditVacancyModalProps> = ({
  vacancy,
  apiVacancy,
  isOpen,
  onClose,
  onSave,
  isPending = false,
}) => {
  const { isDark } = useTheme();
  const isEditMode = !!vacancy;
  const vacancyId = apiVacancy?.id || vacancy?.id;


  // Image upload state
  const primaryFileRef = useRef<HTMLInputElement>(null);
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deleteImage, setDeleteImage] = useState(false);

  const uploadImageMutation = useUploadVacancyImage();
  const deleteImageMutation = useDeleteVacancyImage();
  const { data: categoriesPayload } = useGetCategories({ type: CategoryType.RECRUITMENT, limit: 100 });
  const categories = categoriesPayload?.categories || [];

  // Form state
  const [formKey, setFormKey] = useState(0);
  const [formValues, setFormValues] = useState<FormValues>(() => toForm(vacancy));
  const [errors, setErrors] = useState<Errs>({});
  const [isSaving, setIsSaving] = useState(false);

  // Reset when modal opens / vacancy changes
  React.useEffect(() => {
    setFormKey(prev => prev + 1);
  }, [vacancy?.id, isOpen]);

  React.useEffect(() => {
    setFormValues(toForm(vacancy));
    setErrors({});
    setIsSaving(false);
    setPendingImage(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setDeleteImage(false);
  }, [formKey]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, []);

  /* Image handlers */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 5MB.');
      return;
    }
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setPendingImage(file);
    setImagePreview(URL.createObjectURL(file));
    setDeleteImage(false);
    if (primaryFileRef.current) primaryFileRef.current.value = '';
  };

  const handleClearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setPendingImage(null);
    setImagePreview(null);
  };

  const handleMarkDeleteImage = () => {
    handleClearImage();
    setDeleteImage(true);
  };

  /* Form handlers */
  const handleInputChange =
    (field: 'title') =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setFormValues(prev => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

  const handleTextAreaChange =
    (field: 'description') => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFormValues(prev => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormValues(prev => ({ ...prev, category_id: e.target.value }));
  };

  /* Save */
  const handleSave = async (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }

    const validationErrors = validate(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);

    const payload: AddVacancy | UpdateVacancy = {
      title: formValues.title.trim(),
      description: formValues.description.trim(),
      is_open: formValues.is_open,
      category_id: formValues.category_id || null,
    };

    try {
      await onSave(payload, vacancyId);

      // After save, handle image upload/delete if editing an existing vacancy
      if (vacancyId) {
        const promises = [];
        if (pendingImage) promises.push(uploadImageMutation.mutateAsync({ id: vacancyId, file: pendingImage }));
        if (deleteImage) promises.push(deleteImageMutation.mutateAsync(vacancyId));
        await Promise.all(promises);
      }
    } catch {
      setIsSaving(false);
    }
  };

  const currentImageUrl = imagePreview || (deleteImage ? null : (apiVacancy?.image_url || vacancy?.image_url));

  return (
    <Modal
      title={isEditMode ? 'Edit Vacancy' : 'Add New Vacancy'}
      isOpen={isOpen}
      onClose={onClose}
      size="large"
      darkMode={isDark}
    >
      <div className="space-y-6">
        {/* Form fields */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <InputField
              label="Vacancy Title"
              value={formValues.title}
              placeholder="e.g. Backend Development"
              onChange={handleInputChange('title')}
              id="title"
              error={errors.title}
              darkMode={isDark}
            />
          </div>
          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={formValues.description}
              placeholder="e.g. Develop and maintain backend services..."
              onChange={handleTextAreaChange('description')}
              id="description"
              error={errors.description}
              darkMode={isDark}
            />
          </div>
        </div>

        {/* Category + Status row */}
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <Select
              id="category"
              label="Category"
              options={[
                { label: 'Select a category...', value: '' },
                ...categories.map(c => ({ label: c.name, value: c.id })),
              ]}
              value={formValues.category_id}
              onChange={handleCategoryChange}
              darkMode={isDark}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${ isDark ? 'text-gray-300' : 'text-gray-700' }`}>
              Status
            </label>
            <div className="flex items-center gap-3">
              {/* Toggle switch */}
              <label
                className="relative inline-block cursor-pointer"
                style={{ fontSize: 17, width: '3.5em', height: '2em' }}
              >
                <input
                  type="checkbox"
                  checked={formValues.is_open}
                  onChange={e => setFormValues(prev => ({ ...prev, is_open: e.target.checked }))}
                  className="opacity-0 w-0 h-0 absolute"
                />
                {/* Track */}
                <span
                  className="absolute inset-0 rounded-full transition-all duration-300"
                  style={{
                    background: formValues.is_open ? '#22c55e' : (isDark ? '#4b5563' : '#d1d5db'),
                    transition: 'background 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                />
                {/* Thumb */}
                <span
                  className="absolute rounded-full bg-white shadow-lg"
                  style={{
                    height: formValues.is_open ? '2em' : '1.4em',
                    width: formValues.is_open ? '2em' : '1.4em',
                    left: formValues.is_open ? 'calc(100% - 2em)' : '0.3em',
                    bottom: formValues.is_open ? 0 : '0.3em',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    boxShadow: '0 0 20px rgba(0,0,0,0.4)',
                  }}
                />
              </label>
              {/* Label */}
              <span
                className={`text-sm font-semibold ${
                  formValues.is_open
                    ? (isDark ? 'text-green-400' : 'text-green-600')
                    : (isDark ? 'text-gray-400' : 'text-gray-500')
                }`}
              >
                {formValues.is_open ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${ isDark ? 'text-gray-300' : 'text-gray-700' }`}>
            Position Image
          </label>

          {currentImageUrl ? (
            <div className="relative w-full h-44 rounded-xl overflow-hidden group">
              <img src={currentImageUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => primaryFileRef.current?.click()}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                  title="Replace image"
                >
                  <FiUpload className="w-5 h-5" />
                </button>
                <button
                  onClick={apiVacancy?.image_public_id && !pendingImage ? handleMarkDeleteImage : handleClearImage}
                  className="p-2 rounded-lg bg-red-500/70 hover:bg-red-500 text-white transition-colors"
                  title="Remove image"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
              {pendingImage && (
                <div className="absolute top-2 right-2">
                  <button onClick={handleClearImage} className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70">
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => primaryFileRef.current?.click()}
              className={`w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors ${
                isDark
                  ? 'border-gray-600 hover:border-primary/60 text-gray-500 hover:text-gray-400'
                  : 'border-gray-300 hover:border-primary/60 text-gray-400 hover:text-gray-500'
              }`}
            >
              <FiImage className="w-8 h-8" />
              <span className="text-sm font-medium">Click to upload image</span>
              <span className="text-xs opacity-70">PNG, JPG up to 5MB</span>
            </button>
          )}

          <input
            ref={primaryFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />

          {pendingImage && !vacancyId && (
            <p className={`mt-1.5 text-xs ${ isDark ? 'text-yellow-400' : 'text-yellow-600' }`}>
              ⚠ Image will be uploaded after saving the vacancy. Re-edit to add the image.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
          <Button
            buttonText="Cancel"
            onClick={onClose}
            type="basic"
            width="fit"
            darkMode={isDark}
            disabled={isPending || isSaving}
          />
          <Button
            buttonText={isEditMode ? 'Save Changes' : 'Create Vacancy'}
            onClick={handleSave}
            type="primary"
            width="fit"
            darkMode={isDark}
            loading={isPending || isSaving}
            disabled={isPending || isSaving}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddEditVacancyModal;
