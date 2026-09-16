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
import { SearchableMultiSelect } from '@/shared/components/ui/SearchableMultiSelect';
import { useTheme } from '@/shared/hooks/useTheme';
import { toast } from 'react-hot-toast';
import { FiUpload, FiTrash2, FiImage, FiX, FiPlus } from 'react-icons/fi';
import {
  useGetInstructors,
  useUploadWorkshopCover,
  useDeleteWorkshopCover,
  useUploadWorkshopGallery,
  useDeleteWorkshopGalleryImage,
} from '@/shared/queries/workshops';
import { useGetCategories } from '@/shared/queries/categories/categories.queries';
import type {
  Workshop,
  CreateWorkshopRequest,
  UpdateWorkshopRequest,
  WorkshopContent,
} from '@/shared/types/workshops.types';

interface ExtendedAddEditWorkshopModalProps {
  workshop?: Workshop;
  apiWorkshop?: Workshop;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateWorkshopRequest | UpdateWorkshopRequest, id?: string) => Promise<void>;
  isPending?: boolean;
}

interface FormValues {
  title: string;
  description: string;
  content: WorkshopContent[];
  category_id: string;
  location: string;
  start_time: string;
  end_time: string;
  capacity: string;
  registration_deadline: string;
  instructor_ids: string[];
}

const empty = (): FormValues => ({
  title: '',
  description: '',
  content: [],
  category_id: '',
  location: '',
  start_time: '',
  end_time: '',
  capacity: '0',
  registration_deadline: '',
  instructor_ids: [],
});

const formatDateForInput = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const toForm = (w?: Workshop): FormValues =>
  w
    ? {
        title: w.title,
        description: w.description,
        content: w.content && Array.isArray(w.content) ? w.content : [],
        category_id: w.category_id || '',
        location: w.location,
        start_time: formatDateForInput(w.start_time),
        end_time: formatDateForInput(w.end_time),
        capacity: String(w.capacity),
        registration_deadline: formatDateForInput(w.registration_deadline),
        instructor_ids: w.instructors?.map(i => i.id) || w.instructor_ids || [],
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

  if (!v.location.trim()) {
    e.location = 'Location is required.';
  } else if (v.location.trim().length < 3) {
    e.location = 'Location must be at least 3 characters.';
  }
  
  if (!v.start_time) e.start_time = 'Start time is required.';
  if (!v.end_time) e.end_time = 'End time is required.';
  if (Number(v.capacity) <= 0) e.capacity = 'Capacity must be greater than 0.';
  
  if (v.content.some(sec => !sec.sectionTitle.trim())) {
    e.content = 'All sections must have a title.';
  }

  if (!v.category_id) {
    e.category_id = 'Category is required.';
  }
  
  return e;
};

export const AddEditWorkshopModal: React.FC<ExtendedAddEditWorkshopModalProps> = ({
  workshop,
  apiWorkshop,
  isOpen,
  onClose,
  onSave,
  isPending = false,
}) => {
  const { isDark } = useTheme();
  const isEditMode = !!workshop;
  const workshopId = apiWorkshop?.id || workshop?.id;

  const primaryFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formKey, setFormKey] = useState(0);
  const [formValues, setFormValues] = useState<FormValues>(() => toForm(workshop));
  const [errors, setErrors] = useState<Errs>({});
  const [isSaving, setIsSaving] = useState(false);

  // Pending primary image
  const [pendingPrimary, setPendingPrimary] = useState<File | null>(null);
  const [primaryPreview, setPrimaryPreview] = useState<string | null>(null);
  const [deletePrimary, setDeletePrimary] = useState(false);

  // Pending gallery files
  const [pendingGallery, setPendingGallery] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Instructors data
  const { data: instructors = [] } = useGetInstructors();
  const instructorOptions = instructors.map(inst => ({
    label: inst.name,
    value: inst.id,
  }));

  // Categories data
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategories({
    type: 'WORKSHOP',
    limit: 100,
  });
  const categoryOptions = categoriesData?.categories.map(c => ({
    label: c.name,
    value: c.id,
  })) || [];

  // Image mutation hooks
  const uploadImage = useUploadWorkshopCover();
  const deleteImage = useDeleteWorkshopCover();
  const uploadGallery = useUploadWorkshopGallery();
  const deleteGalleryImage = useDeleteWorkshopGalleryImage();

  const existingGallery = apiWorkshop?.images ?? [];

  // Reset when modal opens / workshop changes
  React.useEffect(() => {
    setFormKey(prev => prev + 1);
  }, [workshop?.id, isOpen]);

  React.useEffect(() => {
    setFormValues(toForm(workshop));
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

  useEffect(() => {
    return () => {
      if (primaryPreview) URL.revokeObjectURL(primaryPreview);
      galleryPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  /* ── Form handlers ─────────────────────────────── */
  const handleInputChange =
    (field: keyof FormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setFormValues(prev => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

  const handleTextAreaChange = (field: 'description') => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormValues(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleAddSection = () => {
    setFormValues(prev => ({
      ...prev,
      content: [...prev.content, { sectionTitle: '', subSection: [''] }],
    }));
  };

  const handleRemoveSection = (index: number) => {
    setFormValues(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  };

  const handleSectionTitleChange = (index: number, value: string) => {
    setFormValues(prev => {
      const newContent = [...prev.content];
      if (newContent[index]) {
        newContent[index] = {
          ...newContent[index],
          sectionTitle: value,
        };
      }
      return { ...prev, content: newContent };
    });
    if (errors.content) setErrors(prev => ({ ...prev, content: undefined }));
  };

  const handleAddSubSection = (sectionIndex: number) => {
    setFormValues(prev => {
      const newContent = [...prev.content];
      if (newContent[sectionIndex]) {
        newContent[sectionIndex] = {
          ...newContent[sectionIndex],
          subSection: [...newContent[sectionIndex].subSection, ''],
        };
      }
      return { ...prev, content: newContent };
    });
  };

  const handleRemoveSubSection = (sectionIndex: number, subIndex: number) => {
    setFormValues(prev => {
      const newContent = [...prev.content];
      if (newContent[sectionIndex]) {
        newContent[sectionIndex] = {
          ...newContent[sectionIndex],
          subSection: newContent[sectionIndex].subSection.filter((_: any, i: number) => i !== subIndex),
        };
      }
      return { ...prev, content: newContent };
    });
  };

  const handleSubSectionChange = (sectionIndex: number, subIndex: number, value: string) => {
    setFormValues(prev => {
      const newContent = [...prev.content];
      if (newContent[sectionIndex]) {
        const newSubSection = [...newContent[sectionIndex].subSection];
        newSubSection[subIndex] = value;
        newContent[sectionIndex] = {
          ...newContent[sectionIndex],
          subSection: newSubSection,
        };
      }
      return { ...prev, content: newContent };
    });
  };

  const handleDateChange = (field: keyof FormValues) => (timestamp: number) => {
    const d = new Date(timestamp);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    setFormValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleInstructorsChange = (values: string[]) => {
    setFormValues(prev => ({ ...prev, instructor_ids: values }));
  };

  /* ── Image handlers ────────────────────────────── */
  const handlePrimarySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      toast.error(`Total size is ${(totalSize / 1024 / 1024).toFixed(2)}MB. This might cause server aborts if it exceeds backend limits.`);
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

    const validationErrors = validate(formValues);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);

    // If we're editing an existing workshop, we upload images first
    if (workshopId) {
      try {
        const promises = [];
        if (pendingPrimary) promises.push(uploadImage.mutateAsync({ id: workshopId, file: pendingPrimary }));
        if (deletePrimary) promises.push(deleteImage.mutateAsync(workshopId));
        if (pendingGallery.length > 0) promises.push(uploadGallery.mutateAsync({ id: workshopId, files: pendingGallery }));
        
        await Promise.all(promises);
      } catch {
        setIsSaving(false);
        return; // Stop save if images failed to upload
      }
    }

    const payload: CreateWorkshopRequest | UpdateWorkshopRequest = {
      title: formValues.title.trim(),
      description: formValues.description.trim(),
      content: formValues.content.map((sec) => ({
        sectionTitle: sec.sectionTitle.trim(),
        subSection: sec.subSection.map((sub: string) => sub.trim()).filter(Boolean),
      })).filter((sec) => sec.sectionTitle),
      category_id: formValues.category_id,
      location: formValues.location.trim(),
      start_time: new Date(formValues.start_time).toISOString(),
      end_time: new Date(formValues.end_time).toISOString(),
      capacity: Number(formValues.capacity),
      registration_deadline: formValues.registration_deadline
        ? new Date(formValues.registration_deadline).toISOString()
        : new Date(formValues.start_time).toISOString(),
      instructor_ids: formValues.instructor_ids,
    };

    try {
      await onSave(payload, workshopId);
    } catch {
      setIsSaving(false);
    }
  };

  const displayPrimary = primaryPreview ?? (deletePrimary ? null : apiWorkshop?.image_url ?? null);
  const isImagePending = uploadImage.isPending || deleteImage.isPending || uploadGallery.isPending || deleteGalleryImage.isPending;

  return (
    <Modal
      title={isEditMode ? 'Edit Workshop' : 'Add New Workshop'}
      isOpen={isOpen}
      onClose={onClose}
      size="large"
      darkMode={isDark}
    >
      <div className="space-y-6">
        {/* ── Form fields ─── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <InputField
              label="Workshop Title"
              value={formValues.title}
              placeholder="e.g. IEEE Web Development Workshop"
              onChange={handleInputChange('title')}
              id="title"
              error={errors.title}
              darkMode={isDark}
            />
          </div>
          <div className="md:col-span-2">
            <TextArea
              label="Description (Short)"
              value={formValues.description}
              placeholder="A comprehensive crash course..."
              onChange={handleTextAreaChange('description')}
              id="description"
              error={errors.description}
              darkMode={isDark}
            />
          </div>
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Detailed Content (Sections & Subsections)
              </label>
              <div className="space-y-4">
                {formValues.content.map((section, secIdx) => (
                  <div key={secIdx} className={`p-4 rounded-xl border ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex gap-3 items-start mb-3">
                      <div className="flex-1">
                        <InputField
                          placeholder="Section Title (e.g. HTML Basics)"
                          value={section.sectionTitle}
                          onChange={(e) => handleSectionTitleChange(secIdx, e.target.value)}
                          darkMode={isDark}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(secIdx)}
                        className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                          isDark ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-500 hover:bg-red-100'
                        }`}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pl-4 space-y-2 border-l-2 border-dashed border-gray-300 dark:border-gray-600 ml-2">
                      {section.subSection.map((sub: string, subIdx: number) => (
                        <div key={subIdx} className="flex gap-2 items-center">
                          <div className="flex-1">
                            <InputField
                              placeholder="Topic or detail..."
                              value={sub}
                              onChange={(e) => handleSubSectionChange(secIdx, subIdx, e.target.value)}
                              darkMode={isDark}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubSection(secIdx, subIdx)}
                            className={`p-2 rounded-lg shrink-0 transition-colors ${
                              isDark ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' : 'text-gray-400 hover:text-red-500 hover:bg-gray-200'
                            }`}
                          >
                            <FiX className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddSubSection(secIdx)}
                        className={`text-xs font-medium flex items-center gap-1 mt-2 px-2 py-1 rounded transition-colors ${
                          isDark ? 'text-primary-light hover:bg-primary/20' : 'text-primary hover:bg-primary/10'
                        }`}
                      >
                        <FiPlus className="w-3 h-3" /> Add Topic
                      </button>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={handleAddSection}
                  className={`w-full py-3 rounded-xl border border-dashed flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                    isDark ? 'border-primary/50 text-primary-light hover:bg-primary/10' : 'border-primary/40 text-primary hover:bg-primary/5'
                  }`}
                >
                  <FiPlus className="w-4 h-4" /> Add Section
                </button>
              </div>
              {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
            </div>
          </div>
          <DateTimePicker
            id="startTime"
            label="Start Date & Time"
            value={formValues.start_time ? new Date(formValues.start_time).getTime() : undefined}
            onChange={handleDateChange('start_time')}
            error={errors.start_time}
            darkMode={isDark}
          />
          <DateTimePicker
            id="endTime"
            label="End Date & Time"
            value={formValues.end_time ? new Date(formValues.end_time).getTime() : undefined}
            onChange={handleDateChange('end_time')}
            error={errors.end_time}
            darkMode={isDark}
          />
          <div className="md:col-span-2">
            <DateTimePicker
              id="registrationDeadline"
              label="Registration Deadline"
              value={formValues.registration_deadline ? new Date(formValues.registration_deadline).getTime() : undefined}
              onChange={handleDateChange('registration_deadline')}
              error={errors.registration_deadline}
              darkMode={isDark}
            />
          </div>
          <div className="md:col-span-2">
            <InputField
              label="Location"
              value={formValues.location}
              placeholder="e.g. Lab 3, Building C"
              onChange={handleInputChange('location')}
              id="location"
              error={errors.location}
              darkMode={isDark}
            />
          </div>
          <div className="md:col-span-2">
            <Select
              id="category_id"
              label="Category"
              value={formValues.category_id}
              onChange={handleInputChange('category_id')}
              options={categoryOptions}
              error={errors.category_id}
              disabled={isLoadingCategories}
              darkMode={isDark}
            />
          </div>
          <NumberField
            id="capacity"
            label="Capacity"
            value={formValues.capacity}
            onChange={handleInputChange('capacity')}
            placeholder="Enter workshop capacity"
            error={errors.capacity}
            darkMode={isDark}
          />
          <div className="md:col-span-2 mt-2">
            <SearchableMultiSelect
              label="Instructors"
              placeholder="Search and select instructors..."
              options={instructorOptions}
              value={formValues.instructor_ids}
              onChange={handleInstructorsChange}
              darkMode={isDark}
            />
          </div>
        </div>

        {/* ── Cover Image ─── */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Workshop Cover Image
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
                        <button type="button" onClick={() => deleteGalleryImage.mutate({ id: workshopId!, imageId: img.id })} className="absolute top-1 right-1 p-0.5 rounded bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity">
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
          <Button buttonText="Cancel" onClick={onClose} type="basic" width="fit" darkMode={isDark} disabled={isPending || isSaving} />
          <Button buttonText={isEditMode ? 'Save Changes' : 'Create Workshop'} onClick={handleSave} type="primary" width="fit" darkMode={isDark} loading={isPending || isSaving} disabled={isPending || isSaving} />
        </div>
      </div>
    </Modal>
  );
};

export default AddEditWorkshopModal;
