import { useEffect } from 'react';
import { initSmoothScroll } from '@/shared/utils/smoothScroll';
import { EventsListSection } from '@/features/events/components/EventsListSection';
import { PageHeroSection } from '@/shared/components/PageHeroSection';

export const EventsPage = () => {
  // Initialize smooth scroll
  useEffect(() => {
    const cleanup = initSmoothScroll();
    return cleanup;
  }, []);

  return (
    <div className="bg-background">
      <PageHeroSection
        eyebrow="Events • Networking"
        title="Events"
        description="Discover our latest technical sessions, social gatherings, and hands-on workshops designed to empower future engineers. Join us for unforgettable experiences that shape your career."
      />
      <EventsListSection />
    </div>
  );
};

export default EventsPage;
