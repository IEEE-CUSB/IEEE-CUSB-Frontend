import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft } from 'react-icons/hi';
import { useTheme } from '@/shared/hooks/useTheme';
import { Workshop } from '@/shared/types/workshops.types';
import { useGetWorkshopById } from '@/shared/queries/workshops';
import { WorkshopDetailsContent } from './WorkshopDetailsContent';
import { WorkshopGallery } from './WorkshopGallery';
import { WorkshopDetailsSidebar } from './WorkshopDetailsSidebar';
import { WorkshopDetailsBanner } from './WorkshopDetailsBanner';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200';

const transformWorkshop = (workshop: Workshop) => ({
  title: workshop.title,
  description: workshop.description,
  location: workshop.location,
  startTime: workshop.start_time,
  endTime: workshop.end_time,
  registrationDeadline: workshop.registration_deadline,
  id: workshop.id,
  is_registered: workshop.is_registered,
  registration_id: workshop.registration_id,
  category: workshop.category?.name || 'Workshop',
  categoryBadge: (workshop.category?.name || 'Workshop').toUpperCase(),
  image: workshop.image_url || FALLBACK_IMAGE,
  capacity: workshop.capacity,
  remainingSpots: workshop.remainingSpots ?? workshop.capacity,
  is_full: workshop.is_full ?? false,
  about: workshop.description,
  content: typeof workshop.content === 'string' 
    ? (() => {
        try { return JSON.parse(workshop.content); } 
        catch { return workshop.content; }
      })() 
    : workshop.content,
  learningPoints: (workshop as any).learningPoints || [],
  prerequisites: (workshop as any).prerequisites || [],
  instructors: workshop.instructors?.map(inst => ({
    id: inst.id,
    name: inst.name,
    title: 'Workshop Instructor',
    avatar: inst.image_url || undefined,
  })),
});
// Dummy data removed.

export const WorkshopDetailsSection = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const { data: workshop, isLoading, isError } = useGetWorkshopById(id || '');
  // Gallery comes embedded in the workshop response
  const galleryImages = workshop?.images ?? [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-10 w-32 bg-gray-200 rounded-lg mb-6 animate-pulse" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-96 bg-gray-200 rounded-3xl animate-pulse" />
              <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
            <div className="space-y-6">
              <div className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
              <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !workshop) {
    return (
      <div className="min-h-screen bg-background py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Workshop Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The workshop you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/workshops')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <HiArrowLeft className="w-5 h-5" />
              Back to workshops
            </button>
          </div>
        </div>
      </div>
    );
  }

  const workshopData = transformWorkshop(workshop);

  return (
    <div className="min-h-screen bg-background py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate('/workshops')}
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <HiArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Back to workshops</span>
        </motion.button>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <WorkshopDetailsBanner
              title={workshopData.title}
              description={workshopData.description}
              image={workshopData.image}
              category={workshopData.category}
              categoryBadge={workshopData.categoryBadge}
              darkMode={isDark}
            />

            <WorkshopDetailsContent
              about={workshopData.about}
              content={workshopData.content}
              learningPoints={workshopData.learningPoints}
              prerequisites={workshopData.prerequisites}
              darkMode={isDark}
            />

            {/* Gallery — sourced directly from workshop.images */}
            {galleryImages.length > 0 && (
              <WorkshopGallery images={galleryImages} darkMode={isDark} />
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <WorkshopDetailsSidebar
                startTime={workshopData.startTime}
                endTime={workshopData.endTime}
                location={workshopData.location}
                instructors={workshopData.instructors}
                registrationDeadline={workshopData.registrationDeadline}
                workshopId={workshopData.id}
                isRegistered={workshopData.is_registered}
                registrationId={workshopData.registration_id}
                capacity={workshopData.capacity}
                remainingSpots={workshopData.remainingSpots}
                isFull={workshopData.is_full}
                darkMode={isDark}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
