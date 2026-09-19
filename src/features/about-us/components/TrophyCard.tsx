import { motion } from 'framer-motion';
import trophy from '../../../assets/IEEE_Trophy.png';
import type { Award } from '@/shared/types/award.types';

function TrophyCard({ award, darkMode }: { award: Award; darkMode: boolean }) {
  const yearsText = award.years && award.years.length > 0
    ? award.years.length > 3
      ? `${Math.min(...award.years)} - ${Math.max(...award.years)}`
      : award.years.sort((a,b) => b-a).join(', ')
    : new Date(award.created_at).getFullYear();
  return (
    <div className="flex flex-col items-center pt-4 sm:pt-6 md:pt-8">
      <motion.div
        whileHover={{ scale: 1.1, y: -15 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center w-full cursor-pointer"
      >
        {/* Trophy Image */}
        <div className={`relative flex justify-end items-end rounded-lg z-10`}>
          <img
            src={award.image_url || trophy}
            alt={award.title}
            className="w-24 h-32 sm:w-32 sm:h-40 md:w-36 md:h-44 lg:w-40 lg:h-48 object-contain scale-[1.6] sm:scale-[1.7] md:scale-[1.8] origin-bottom translate-y-12 sm:translate-y-16 md:translate-y-20"
          />

          {award.won_count > 0 && (
            <div
              className={`flex -ml-3 sm:-ml-5 md:-ml-6 items-end gap-1 sm:gap-1.5 md:gap-2 ${darkMode ? 'text-white' : 'text-primary'}`}
            >
              <span className="text-lg sm:text-2xl md:text-2xl lg:text-3xl font-bold leading-none pb-1">
                {award.won_count}
              </span>
              <div className="text-[5px] sm:text-[6px] md:text-[7px] lg:text-[8px] uppercase font-bold pb-0.5 opacity-90">
                <p>Times</p>
                <p>Winner</p>
              </div>
            </div>
          )}
        </div>

        {/* Trophy Info */}
        <div className="text-center w-full">
          <motion.h4
            initial={{ backgroundPosition: '0% center' }}
            whileHover={{ backgroundPosition: '100% center' }}
            transition={{ duration: 2.5, ease: 'linear' }}
            className={`text-xs sm:text-sm md:text-base lg:text-lg font-bold mb-1.5 sm:mb-2 pt-0.5 pb-0.5 rounded-xl ${
              darkMode
                ? 'bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 text-white'
                : 'bg-gradient-to-r from-gray-600 via-gray-550 to-gray-600 text-white'
            } shadow-[0_14px_18px_-8px_rgba(0,0,0,0.6)]`}
          >
            {award.title}
          </motion.h4>
          <div className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide text-info uppercase mb-1.5 sm:mb-2 line-clamp-1">
            {yearsText}
          </div>
          <p
            className={`text-[10px] sm:text-xs md:text-sm leading-relaxed line-clamp-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {award.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default TrophyCard;
