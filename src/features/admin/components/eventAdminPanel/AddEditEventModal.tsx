import React, { useState, useRef, useEffect } from 'react';
import {
  InputField,
  Button,
  TextArea,
  Modal,
  DateTimePicker,
  NumberField,
  Select,
} from '@ieee-ui/ui';
import { Toggle } from '@/shared/components/ui/Toggle';
import type {
  AddEditEventModalProps,
  EventFormValues,
  FormErrors,
} from '../../types/eventModalTypes';
import { EVENT_FORM_CONSTRAINTS } from '../../constants/eventModalConstants';
import {
  validateAllFields,
  convertEventToFormValues,
  convertFormValuesToEventFormData,
} from '../../utils/eventModalUtils';
import { useTheme } from '@/shared/hooks/useTheme';
import {
  useUploadEventImage,
  useDeleteEventImage,
  useUploadEventGallery,
  useDeleteEventGalleryImage,
} from '@/shared/queries/events';
import { useGetCategories } from '@/shared/queries/categories/categories.queries';
import { toast } from 'react-hot-toast';
import type { Event } from '@/shared/types/events.types';
import { FiUpload, FiTrash2, FiImage, FiX } from 'react-icons/fi';

interface ExtendedAddEditEventModalProps extends AddEditEventModalProps {
  /** Full API event object — needed for image_url and upload hooks */
  apiEvent?: Event;
}

const AddEditEventModal: React.FC<ExtendedAddEditEventModalProps> = ({
  event,
  apiEvent,
  isOpen,
  onClose,
  onSave,
  isLoading,
}) => {
  const { isDark } = useTheme();
  const isEditMode = !!event;
  const eventId = apiEvent?.id || event?.id;

  const primaryFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formKey, setFormKey] = useState(0);
  const [formValues, setFormValues] = useState<EventFormValues>(() =>
    convertEventToFormValues(event)
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  // Pending primary image (local preview, upload on Save)
  const [pendingPrimary, setPendingPrimary] = useState<File | null>(null);
  const [primaryPreview, setPrimaryPreview] = useState<string | null>(null);
  const [deletePrimary, setDeletePrimary] = useState(false);

  // Pending gallery files (local preview, upload on Save)
  const [pendingGallery, setPendingGallery] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Image mutation hooks
  const uploadImage = useUploadEventImage();
  const deleteImage = useDeleteEventImage();
  const uploadGallery = useUploadEventGallery();
  const deleteGalleryImage = useDeleteEventGalleryImage();
  // Gallery already embedded in apiEvent.images — no extra API call needed
  const existingGallery = apiEvent?.images ?? [];

  // Fetch event categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategories({
    type: 'EVENT',
    limit: 100, // Fetch enough to cover all categories
  });
  
  const categoryOptions = categoriesData?.categories.map(c => ({
    value: c.id,
    label: c.name,
  })) || [];

  // Reset when modal opens / event changes
  React.useEffect(() => {
    setFormKey(prev => prev + 1);
  }, [event?.id, isOpen]);

  React.useEffect(() => {
    setFormValues(convertEventToFormValues(event));
    setErrors({});
    setPendingPrimary(null);
    if (primaryPreview) URL.revokeObjectURL(primaryPreview);
    setPrimaryPreview(null);
    setDeletePrimary(false);
    galleryPreviews.forEach(url => URL.revokeObjectURL(url));
    setPendingGallery([]);
    setGalleryPreviews([]);
    setIsSaving(false);
  }, [formKey]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (primaryPreview) URL.revokeObjectURL(primaryPreview);
      galleryPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  /* ── Form handlers ─────────────────────────────── */
  const handleInputChange =
    (field: keyof EventFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setFormValues(prev => ({ ...prev, [field]: value }));
      if (errors[field as keyof FormErrors])
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormValues(prev => ({ ...prev, description: e.target.value }));
    if (errors.description)
      setErrors(prev => ({ ...prev, description: undefined }));
  };

  const handleDateChange =
    (field: keyof EventFormValues) => (timestamp: number) => {
      const d = new Date(timestamp);
      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      setFormValues(prev => ({ ...prev, [field]: value }));
      if (errors[field as keyof FormErrors])
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

  /* ── Image handlers ────────────────────────────── */
  const handlePrimarySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Warn on large files (often causes ns_binding_aborted on reverse proxies)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is very large — it might be rejected by the server depending on payload limits.');
    }

    if (primaryPreview) URL.revokeObjectURL(primaryPreview);
    setPendingPrimary(file);
    setPrimaryPreview(URL.createObjectURL(file));
    setDeletePrimary(false);
    if (primaryFileRef.current) primaryFileRef.current.value = '';
  };

  const handleClearPrimary = () => {
    if (primaryPreview) URL.revokeObjectURL(primaryPreview);
    setPendingPrimary(null);
    setPrimaryPreview(null);
  };

  const handleMarkDeletePrimary = () => {
    handleClearPrimary();
    setDeletePrimary(true);
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 5 * 1024 * 1024) {
       toast.error(`Total size is ${(totalSize/1024/1024).toFixed(2)}MB. This might cause server aborts if it exceeds backend limits.`);
    }

    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPendingGallery(prev => [...prev, ...files]);
    setGalleryPreviews(prev => [...prev, ...newPreviews]);
    if (galleryFileRef.current) galleryFileRef.current.value = '';
  };

  const handleRemovePendingGallery = (index: number) => {
    URL.revokeObjectURL(galleryPreviews[index]!);
    setPendingGallery(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  /* ── Save ──────────────────────────────────────── */
  const handleSave = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const validationErrors = validateAllFields(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSaving(true);

    // Fire image uploads first if editing an existing event
    if (eventId) {
      try {
        const promises = [];
        if (pendingPrimary) promises.push(uploadImage.mutateAsync({ id: eventId, file: pendingPrimary }));
        if (deletePrimary) promises.push(deleteImage.mutateAsync(eventId));
        if (pendingGallery.length > 0) promises.push(uploadGallery.mutateAsync({ id: eventId, files: pendingGallery }));
        
        await Promise.all(promises);
      } catch (err) {
        setIsSaving(false);
        // Errors are handled and toasted by the mutations themselves
        return; // Stop the save if images failed to upload
      }
    }

    // Now save the metadata (this closes the modal)
    const eventFormData = convertFormValuesToEventFormData(formValues, event);
    
    try {
      await onSave(eventFormData);
    } catch {
      setIsSaving(false);
    }
  };

  const displayPrimary = primaryPreview ?? (deletePrimary ? null : apiEvent?.image_url ?? null);
  const isImagePending = uploadImage.isPending || deleteImage.isPending || uploadGallery.isPending || deleteGalleryImage.isPending;

  return (
    <Modal
      title={isEditMode ? 'Edit Event' : 'Add New Event'}
      isOpen={isOpen}
      onClose={onClose}
      size="large"
      darkMode={isDark}
    >
      <div className="space-y-6">
        {/* ── Form fields ─── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <InputField label="Event Title" value={formValues.title} placeholder="Enter event title" onChange={handleInputChange('title')} id="title" error={errors.title} darkMode={isDark} />
          </div>
          <div className="md:col-span-2">
            <TextArea label="Event Description" value={formValues.description} placeholder="Enter detailed event description" onChange={handleTextAreaChange} id="description" maxLength={EVENT_FORM_CONSTRAINTS.description.maxLength} error={errors.description} darkMode={isDark} />
          </div>
          <DateTimePicker id="startTime" label="Start Date & Time" value={formValues.startTime ? new Date(formValues.startTime).getTime() : undefined} onChange={handleDateChange('startTime')} error={errors.startTime} darkMode={isDark} />
          <DateTimePicker id="endTime" label="End Date & Time" value={formValues.endTime ? new Date(formValues.endTime).getTime() : undefined} onChange={handleDateChange('endTime')} error={errors.endTime} darkMode={isDark} />
          <div className="md:col-span-2">
            <DateTimePicker id="registrationDeadline" label="Registration Deadline" value={formValues.registrationDeadline ? new Date(formValues.registrationDeadline).getTime() : undefined} onChange={handleDateChange('registrationDeadline')} error={errors.registrationDeadline} darkMode={isDark} />
          </div>
          <div className="md:col-span-2">
            <InputField label="Location" value={formValues.location} placeholder="Enter event location" onChange={handleInputChange('location')} id="location" error={errors.location} darkMode={isDark} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
            <div className="md:col-span-1">
              <Select id="category_id" label="Category" value={formValues.category_id} onChange={handleInputChange('category_id')} options={categoryOptions} error={errors.category_id} disabled={isLoadingCategories} darkMode={isDark} />
            </div>
            <NumberField id="capacity" label="Capacity" value={formValues.capacity} onChange={handleInputChange('capacity')} placeholder="Enter event capacity" min={EVENT_FORM_CONSTRAINTS.capacity.min.toString()} max={EVENT_FORM_CONSTRAINTS.capacity.max.toString()} error={errors.capacity} darkMode={isDark} />
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-1.5 ${ isDark ? 'text-gray-300' : 'text-gray-700' }`}>
                Visibility
              </label>
              <Toggle
                checked={formValues.is_published ?? true}
                onChange={val => setFormValues(prev => ({ ...prev, is_published: val }))}
                labelOn="Published"
                labelOff="Hidden"
                darkMode={isDark}
              />
            </div>
          </div>
        </div>

        {/* ── Cover Image ─── */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Event Cover Image
            {!isEditMode && <span className={`ml-1 text-xs font-normal ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>(available after creating)</span>}
          </label>
          <div className={`rounded-xl border-2 border-dashed transition-colors ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
            {displayPrimary ? (
              <div className="flex items-center gap-4 p-4">
                <div className="relative flex-shrink-0">
                  <img src={displayPrimary} alt="Cover" className="w-28 h-20 rounded-xl object-cover border border-gray-200 dark:border-gray-700" />
                  {pendingPrimary && (
                    <span className="absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-white leading-none">NEW</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {pendingPrimary
                    ? <p className={`text-sm font-medium truncate mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{pendingPrimary.name}</p>
                    : <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Current cover image</p>
                  }
                  <div className="flex gap-2">
                    <button type="button" onClick={() => primaryFileRef.current?.click()} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isDark ? 'bg-primary/20 text-primary-light hover:bg-primary/30' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
                      <FiUpload className="w-3.5 h-3.5" />{pendingPrimary ? 'Change' : 'Replace'}
                    </button>
                    {pendingPrimary ? (
                      <button type="button" onClick={handleClearPrimary} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        <FiX className="w-3.5 h-3.5" />Cancel
                      </button>
                    ) : (
                      <button type="button" onClick={handleMarkDeletePrimary} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isDark ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
                        <FiTrash2 className="w-3.5 h-3.5" />Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => primaryFileRef.current?.click()} className={`w-full flex flex-col items-center gap-2 py-8 rounded-xl transition-colors ${isDark ? 'hover:bg-gray-700/50 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <FiImage className="w-8 h-8 opacity-60" />
                <span className="text-sm font-medium">Click to select a cover image</span>
                <span className="text-xs opacity-60">JPG, PNG or WebP</span>
              </button>
            )}
            <input ref={primaryFileRef} type="file" accept="image/*" onChange={handlePrimarySelect} className="hidden" />
          </div>
        </div>

        {/* ── Gallery Images ─── */}
        {isEditMode && (
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Gallery Images
            </label>
            <div className={`rounded-xl border-2 border-dashed p-4 transition-colors ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
              {/* Existing uploaded gallery */}
              {existingGallery && existingGallery.length > 0 && (
                <div className="mb-3">
                  <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Uploaded</p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {existingGallery.map(img => (
                      <div key={img.id} className="relative group">
                        <img src={img.image_url} alt="Gallery" className="w-full aspect-square rounded-lg object-cover border border-gray-200 dark:border-gray-700" />
                        <button type="button" onClick={() => deleteGalleryImage.mutate({ eventId: eventId!, imageId: img.id })} className="absolute top-1 right-1 p-0.5 rounded bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <FiX className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending gallery previews */}
              {galleryPreviews.length > 0 && (
                <div className="mb-3">
                  <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Pending ({galleryPreviews.length} — uploaded on Save)
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {galleryPreviews.map((url, i) => (
                      <div key={url} className="relative group">
                        <img src={url} alt={`Pending ${i + 1}`} className="w-full aspect-square rounded-lg object-cover border-2 border-primary/50" />
                        <button type="button" onClick={() => handleRemovePendingGallery(i)} className="absolute top-1 right-1 p-0.5 rounded bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <FiX className="w-2.5 h-2.5" />
                        </button>
                        <span className="absolute bottom-1 left-1 text-[8px] font-bold px-1 rounded bg-primary text-white leading-none">NEW</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button type="button" onClick={() => galleryFileRef.current?.click()} className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-colors ${isDark ? 'hover:bg-gray-700/50 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <FiUpload className="w-4 h-4" />
                Add gallery images
              </button>
              <input ref={galleryFileRef} type="file" accept="image/*" multiple onChange={handleGallerySelect} className="hidden" />
            </div>
            {isImagePending && (
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Uploading images…</p>
            )}
          </div>
        )}

        {/* ── Actions ─── */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button buttonText="Cancel" onClick={onClose} type="basic" width="fit" darkMode={isDark} disabled={isLoading || isSaving} />
          <Button buttonText={isEditMode ? 'Save Changes' : 'Create Event'} onClick={handleSave} type="primary" width="fit" darkMode={isDark} loading={isLoading || isSaving} disabled={isLoading || isSaving} />
        </div>
      </div>
    </Modal>
  );
};

export default AddEditEventModal;
