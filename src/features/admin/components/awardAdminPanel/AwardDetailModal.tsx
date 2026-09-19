import React, { useState, useEffect } from 'react';
import { Modal } from '@ieee-ui/ui';
import { FiCalendar } from 'react-icons/fi';
import { HiTrophy } from 'react-icons/hi2';
import { useTheme } from '@/shared/hooks/useTheme';
import type { Award } from '@/shared/types/award.types';
import IEEETrophy from '../../../../assets/IEEE_Trophy.png';

interface AwardDetailModalProps {
  award: Award | null;
  onClose: () => void;
}

const AwardDetailModal: React.FC<AwardDetailModalProps> = ({
  award,
  onClose,
}) => {
  const { isDark } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(!!award), award ? 180 : 0);
    return () => clearTimeout(t);
  }, [award]);

  return (
    <Modal isOpen={!!award} onClose={onClose} size="xl" darkMode={isDark}>
      {award && (
        <div
          data-lenis-prevent
          className={`transition-all duration-[350ms] ease-out overflow-y-auto max-h-[80vh] sm:max-h-none ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          {/* Award image */}
          <div
            className={`relative w-full h-40 sm:h-56 rounded-xl overflow-hidden mb-4 sm:mb-6 flex items-center justify-center ${
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}
          >
            <img
              src={award.image_url || IEEETrophy}
              alt={award.title}
              className="h-full w-full object-contain p-3 sm:p-5"
              onError={e => {
                (e.currentTarget as HTMLImageElement).src = IEEETrophy;
              }}
            />
          </div>

          {/* Title */}
          <h2
            className={`text-lg sm:text-2xl font-bold mb-3 sm:mb-4 leading-snug ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {award.title}
          </h2>

          {/* Meta row */}
          <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-5">
            {award.won_count > 0 && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <HiTrophy
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`}
                />
                <span
                  className={`text-xs sm:text-sm font-medium ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}
                >
                  Won {award.won_count}{' '}
                  {award.won_count === 1 ? 'time' : 'times'}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <FiCalendar
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              />
              <span
                className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {award.years && award.years.length > 0 ? award.years.join(', ') : 'Unknown'}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div
            className={`border-t mb-4 sm:mb-5 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}
          />

          {/* Description */}
          <p
            className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            {award.description}
          </p>
        </div>
      )}
    </Modal>
  );
};

export default AwardDetailModal;
