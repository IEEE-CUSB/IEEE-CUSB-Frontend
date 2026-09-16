import { useState } from 'react';
import { useWorkshops } from '@/shared/queries/workshops';
import { Pagination } from '@/shared/components/ui/Pagination';
import type { Workshop } from '@/shared/types/workshops.types';
import { useTheme } from '@/shared/hooks/useTheme';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useGetCategories } from '@/shared/queries/categories/categories.queries';
import { CategoryType } from '@/shared/types/category.types';
import { WorkshopsFilterBar } from './WorkshopsFilterBar';
import { WorkshopCard } from './WorkshopCard';

type FilterType = string;


// Helper function to determine workshop status based on dates
const getWorkshopStatus = (
  workshop: Workshop
): 'Upcoming' | 'Ongoing' | 'Completed' => {
  const now = new Date();
  const startTime = new Date(workshop.start_time);
  const endTime = new Date(workshop.end_time);

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

// Transform API workshop to display format
const transformWorkshop = (workshop: Workshop) => {
  const status = getWorkshopStatus(workshop);
  return {
    id: workshop.id,
    title: workshop.title,
    description: workshop.description,
    location: workshop.location,
    date: formatDate(workshop.start_time),
    time: formatTime(workshop.start_time),
    endTime: formatTime(workshop.end_time),
    status,
    statusBadge: status,
    capacity: workshop.capacity,
    remainingSpots: workshop.remainingSpots ?? workshop.capacity,
    is_full: workshop.is_full ?? false,
    registrationDeadline: workshop.registration_deadline,
    // Use real category from API
    category: workshop.category?.name || 'Technical',
    categoryBadge: (workshop.category?.name || 'Technical').toUpperCase(),
    image:
      workshop.image_url ||
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    is_registered: workshop.is_registered,
    registration_id: workshop.registration_id,
  };
};

export const WorkshopsListSection = () => {
  const { isDark } = useTheme();
  const [activeCategoryId, setActiveCategoryId] = useState<string>("All");
  const [page, setPage] = useState(1);
  const limit = 12;
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data: categoriesData } = useGetCategories({ type: CategoryType.WORKSHOP, limit: 100 });

  const { data, isLoading, isError, error, isFetching } = useWorkshops({
    page,
    limit,
    search: debouncedSearch,
    category_id: activeCategoryId !== 'All' ? activeFilter : undefined,
  });

  // Safely extract workshops array - handle different response structures
  const workshops = Array.isArray(data?.data) ? data.data : [];
  const totalPages = data?.totalPages ?? 1;

  // Transform workshops
  const getFilteredWorkshops = () => {
    return workshops.map(transformWorkshop);
  };

  const filteredWorkshops = getFilteredWorkshops();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top of the workshops section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <section
        className={`py-8 md:py-16 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-background'}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <WorkshopsFilterBar
            activeFilter={activeCategoryId}
            onFilterChange={setActiveCategoryId}
            search={search}
            onSearchChange={setSearch}
            darkMode={isDark}
            categories={categoriesData?.categories}
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
              Failed to load Workshops. Please try again later.
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
        <WorkshopsFilterBar
          activeFilter={activeCategoryId}
          onFilterChange={setActiveCategoryId}
          search={search}
          onSearchChange={setSearch}
          darkMode={isDark}
            categories={categoriesData?.categories}
        />

        {/* Empty state */}
        {filteredWorkshops.length === 0 ? (
          <div className="text-center py-12">
            <p
              className={`text-lg transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              No Workshops found. Check back later for upcoming Workshops!
            </p>
          </div>
        ) : (
          <>
            {/* Workshops Grid - 4 columns */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredWorkshops.map((workshop, index) => (
                <WorkshopCard
                  key={workshop.id}
                  workshop={workshop}
                  index={index}
                  darkMode={isDark}
            categories={categoriesData?.categories}
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
