import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAwards } from '@/shared/queries/awards/awards.queries';
import TrophyCard from './TrophyCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { NavLink } from 'react-router-dom';
import AwardDetailModal from '@/features/awards/components/AwardDetailModal';
import type { Award } from '@/shared/types/award.types';

interface TrophiesAwardsSectionProps {
  darkMode?: boolean;
}

export const TrophiesAwardsSection = ({
  darkMode,
}: TrophiesAwardsSectionProps) => {
  const { data: awardsData, isLoading, isError } = useAwards();
  const awards = awardsData?.awards || [];
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);

  return (
    <section
      className={`py-12 md:py-24 px-6 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Trophy Shelf */}
        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="mb-10 flex justify-between items-center gap-10"
          >
            <div>
              <div className="text-sm font-bold tracking-widest text-info uppercase mb-3">
                Achievements Hall
              </div>
              <h3
                className={`text-3xl md:text-4xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Trophies and Awards
              </h3>
            </div>
            <NavLink
              to="/awards"
              className="text-primary font-semibold hover:underline"
            >
              View All Trophies →
            </NavLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          >
          
            <div className=" relative w-full p-10 min-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-info" />
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Failed to load awards. Please try again later.
                </p>
              </div>
            ) : !awards || awards.length === 0 ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No awards to display yet.
                </p>
              </div>
            ) : (
              <>
            <button
              className={`prev-btn absolute left-2  top-1/2 -translate-y-1/2 z-10 flex-shrink-0 p-2 sm:p-2.5 md:p-3 rounded-full  cursor-pointer
  transition-colors duration-200 ${
                darkMode
                  ? 'bg-info/20 hover:bg-info/30 text-white'
                  : 'bg-info/15 hover:bg-info/25 text-info'
              }`}
            >
              <HiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>

            <button
              className={`next-btn absolute right-2 top-1/2 -translate-y-1/2 z-10 flex-shrink-0 p-2 sm:p-2.5 md:p-3 rounded-full cursor-pointer
  transition-colors duration-200  ${
                darkMode
                  ? 'bg-info/20 hover:bg-info/30 text-white'
                  : 'bg-info/15 hover:bg-info/25 text-info'
              }`}
            >
              <HiChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={45}
              slidesPerView={1}
              navigation={{
                nextEl: '.next-btn',
                prevEl: '.prev-btn',
              }}
              pagination={{ clickable: true, dynamicBullets: true }}
              loop={true}
              speed={800}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 25 },
                768: { slidesPerView: 2, spaceBetween: 35 },
                1024: { slidesPerView: 3, spaceBetween: 45 },
              }}
              className="!py-8 !px-2 sm:!py-10 sm:!px-5 md:!py-11 md:!px-8 lg:!py-14 lg:!px-10"
            >
              {awards.map((item) => (
                <SwiperSlide key={item.id} style={{ overflow: 'visible' }} onClick={() => setSelectedAward(item)}>
                  <TrophyCard award={item} darkMode={darkMode ?? false} />
                </SwiperSlide>
              ))}
            </Swiper>
              </>
            )}
          </div>
          </motion.div>
        </div>
      </div>
      
      <AwardDetailModal award={selectedAward} onClose={() => setSelectedAward(null)} />
    </section>
  );
};