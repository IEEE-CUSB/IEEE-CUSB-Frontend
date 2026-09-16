import { Link } from 'react-router-dom';
import { useEvents } from '@/shared/queries/events';
import { EventCard } from '@/features/events/components/EventCard';
import { SectionReveal } from './SectionReveal';
import { useTheme } from '@/shared/hooks/useTheme';
import type { Event } from '@/shared/types/events.types';

const getEventStatus = (event: Event): 'Upcoming' | 'Ongoing' | 'Completed' => {
  const now = new Date();
  const startTime = new Date(event.start_time);
  const endTime = new Date(event.end_time);

  if (now < startTime) return 'Upcoming';
  if (now >= startTime && now <= endTime) return 'Ongoing';
  return 'Completed';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

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
    category: event.category?.name || 'Technical',
    categoryBadge: (event.category?.name || 'Technical').toUpperCase(),
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    is_registered: event.is_registered,
    registration_id: event.registration_id,
  };
};

export const UpcomingEventsSection = () => {
  const { isDark } = useTheme();
  const { data, isLoading } = useEvents({ page: 1, limit: 6 });

  const events = Array.isArray(data?.data) ? data.data : [];
  const upcomingEvents = events
    .map(transformEvent)
    .filter(e => e.status === 'Upcoming' || e.status === 'Ongoing')
    .slice(0, 3);

  if (isLoading) {
    return (
      <section className="py-12 md:py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-2">
              Upcoming Events
            </h2>
            <p className="text-muted-foreground">
              Don't miss out on our latest activities and workshops
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden shadow-lg animate-pulse ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className={`h-40 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className="p-4">
                  <div className={`h-6 rounded mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <div className={`h-4 rounded w-3/4 mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <div className={`h-4 rounded w-1/2 mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <div className={`h-10 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (upcomingEvents.length === 0) return null;

  return (
    <section id="events" className="py-12 md:py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <SectionReveal>
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-2">
                Upcoming Events
              </h2>
              <p className="text-muted-foreground">
                Don't miss out on our latest activities and workshops
              </p>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-end sm:items-center">
              <a
                href="https://www.facebook.com/IEEECUSB/events"
                target="_blank"
                rel="noreferrer"
                className="text-[#1877F2] font-semibold hover:underline"
              >
                See all events on Facebook →
              </a>
              <span className="text-muted-foreground hidden sm:inline">•</span>
              <Link
                to="/events"
                className="text-primary font-semibold hover:underline"
              >
                View All Events →
              </Link>
            </div>
          </SectionReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {upcomingEvents.map((event, index) => (
            <SectionReveal key={event.id} delay={index * 0.1}>
              <EventCard event={event} index={index} darkMode={isDark} />
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
