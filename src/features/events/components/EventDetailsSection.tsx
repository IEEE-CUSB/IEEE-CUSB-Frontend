import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft } from 'react-icons/hi';
import { useTheme } from '@/shared/hooks/useTheme';
import { EventDetailsBanner } from './EventDetailsBanner';
import { EventDetailsSidebar } from './EventDetailsSidebar';
import { EventDetailsContent } from './EventDetailsContent';
import { EventGallery } from './EventGallery';
import { useEvent } from '@/shared/queries/events';
import type { Event } from '@/shared/types/events.types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200';

const transformEvent = (event: Event) => ({
  title: event.title,
  description: event.description,
  location: event.location,
  startTime: event.start_time,
  endTime: event.end_time,
  registrationDeadline: event.registration_deadline,
  id: event.id,
  is_registered: event.is_registered,
  registration_id: event.registration_id,
  category: event.category?.name || 'Workshop',
  categoryBadge: (event.category?.name || 'Workshop').toUpperCase(),
  image: event.image_url || FALLBACK_IMAGE,
  capacity: event.capacity,
  remainingSpots: event.remainingSpots ?? event.capacity,
  is_full: event.is_full ?? false,
  about: event.description,
  learningPoints: [] as string[],
  prerequisites: [] as string[],
  instructor: undefined,
});

export const EventDetailsSection = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const { data: event, isLoading, isError } = useEvent(id || '');

  // Gallery comes embedded in the event response
  const galleryImages = event?.images ?? [];

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

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-background py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-8">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <HiArrowLeft className="w-5 h-5" />
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  const eventData = transformEvent(event);

  return (
    <div className="min-h-screen bg-background py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate('/events')}
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <HiArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Back to Events</span>
        </motion.button>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <EventDetailsBanner
              title={eventData.title}
              description={eventData.description}
              image={eventData.image}
              category={eventData.category}
              categoryBadge={eventData.categoryBadge}
              darkMode={isDark}
            />

            <EventDetailsContent
              about={eventData.about}
              learningPoints={eventData.learningPoints}
              prerequisites={eventData.prerequisites}
              darkMode={isDark}
            />

            {/* Gallery — sourced directly from event.images */}
            {galleryImages.length > 0 && (
              <EventGallery images={galleryImages} darkMode={isDark} />
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <EventDetailsSidebar
                startTime={eventData.startTime}
                endTime={eventData.endTime}
                location={eventData.location}
                instructor={eventData.instructor}
                registrationDeadline={eventData.registrationDeadline}
                eventId={eventData.id}
                isRegistered={eventData.is_registered}
                registrationId={eventData.registration_id}
                capacity={eventData.capacity}
                remainingSpots={eventData.remainingSpots}
                isFull={eventData.is_full}
                darkMode={isDark}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
