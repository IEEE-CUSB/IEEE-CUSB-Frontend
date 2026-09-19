import { useState } from 'react';
import { useAwards } from '@/shared/queries/awards/awards.queries';
import TrophyRow from '@/features/awards/components/TrophyRow';
import { PageHeroSection } from '@/shared/components/PageHeroSection';
import { useTheme } from '@/shared/hooks/useTheme';
import { AwardSparkles } from '../../features/awards/components/AwardSparkles';
import AwardDetailModal from '@/features/awards/components/AwardDetailModal';
import type { Award } from '@/shared/types/award.types';

export const AwardsPage = () => {
  const { isDark } = useTheme();
  const { data: awardsData, isLoading, isError } = useAwards();
  const awards = awardsData?.awards || [];
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);

  return (
    <>
      <PageHeroSection
        eyebrow="Awards & Recognition"
        title="A Legacy of Excellence"
        description="From local recognition to global stages — our awards reflect the dedication of every member who gave their time, skills, and passion to make this branch extraordinary."
        layout="standard"
        backgroundContent={<AwardSparkles />}
        showDotGrid={false}
      />
      <section>
        <div className="grid grid-cols-1 gap-16 p-6 max-w-3xl mx-auto  pb-12 sm:pb-16 md:pb-24 ">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-info" />
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Failed to load awards. Please try again later.
              </p>
            </div>
          ) : !awards || awards.length === 0 ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                No awards to display yet.
              </p>
            </div>
          ) : (
            awards.map((award, i) => (
              <TrophyRow key={award.id} award={award} index={i} darkMode={isDark} onClick={() => setSelectedAward(award)} />
            ))
          )}
        </div>
      </section>

      <AwardDetailModal award={selectedAward} onClose={() => setSelectedAward(null)} />
    </>
  );
};
