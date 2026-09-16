import { useState } from 'react';
import { EventsFilterBar } from './EventsFilterBar';
import { EventCard } from './EventCard';
import { useEvents } from '@/shared/queries/events';
import { Pagination } from '@/shared/components/ui/Pagination';
import type { Event } from '@/shared/types/events.types';
import { useTheme } from '@/shared/hooks/useTheme';

type FilterType = 'All' | 'Technical' | 'Non-Technical' | 'Social';

// Helper function to determine event status based on dates
const getEventStatus = (event: Event): 'Upcoming' | 'Ongoing' | 'Completed' => {
  const now = new Date();
  const startTime = new Date(event.start_time);
  const endTime = new Date(event.end_time);

  if (now < startTime) return 'Upcoming';
  if (now >= startTime && now <= endTime) return 'Ongoing';
  return 'Completed';
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Helper function to format time
const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Transform API event to display format
const transformEvent = (event: Event) => {
  const status = getEventStatus(event);
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    location: event.location,
    date: formatDate(event.start_time),
    time: formatTime(event.start_time),
    endTime: formatTime(event.end_time),
    status,
    statusBadge: status,
    capacity: event.capacity,
    remainingSpots: event.remainingSpots ?? event.capacity,
    is_full: event.is_full ?? false,
    registrationDeadline: event.registration_deadline,
    // Use real category from API
    category: event.category?.name || 'Technical',
    categoryBadge: (event.category?.name || 'Technical').toUpperCase(),
    image: event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    is_registered: event.is_registered,
    registration_id: event.registration_id,
  };
};

export const EventsListSection = () => {
  const { isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, isError, error, isFetching } = useEvents({
    page,
    limit,
  });

  // Safely extract events array - handle different response structures
  const events = Array.isArray(data?.data) ? data.data : [];
  const totalPages = data?.totalPages ?? 1;

  // Transform and filter events
  const getFilteredEvents = () => {
    const transformedEvents = events.map(transformEvent);

    if (activeFilter === 'All') return transformedEvents;
    return transformedEvents.filter(event => event.category === activeFilter);
  };

  const filteredEvents = getFilteredEvents();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top of the events section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <section
        className={`py-8 md:py-16 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-background'}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <EventsFilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            darkMode={isDark}
          />

          {/* Loading skeleton grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className={`rounded-2xl overflow-hidden shadow-lg animate-pulse transition-colors duration-300 ${
                  isDark
                    ? 'bg-gray-800 shadow-blue-900/10'
                    : 'bg-white shadow-gray-100'
                }`}
              >
                <div
                  className={`h-40 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
                />
                <div className="p-4">
                  <div
                    className={`h-6 rounded mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
                  />
                  <div
                    className={`h-4 rounded w-3/4 mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
                  />
                  <div
                    className={`h-4 rounded w-1/2 mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
                  />
                  <div
                    className={`h-10 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section
        className={`py-16 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-background'}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4 font-medium transition-colors duration-300">
              Failed to load events. Please try again later.
            </p>
            <p
              className={`transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              {error instanceof Error
                ? error.message
                : 'Unknown error occurred'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`py-8 md:py-16 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-background'}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Filter, Search and Sort Bar */}
        <EventsFilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          darkMode={isDark}
        />

        {/* Empty state */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p
              className={`text-lg transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              No events found. Check back later for upcoming events!
            </p>
          </div>
        ) : (
          <>
            {/* Events Grid - 4 columns */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                  darkMode={isDark}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isFetching}
              className="mt-12"
            />
          </>
        )}
      </div>
    </section>
  );
};
