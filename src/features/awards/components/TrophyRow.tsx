import { useRef } from 'react';
import gsap from 'gsap';
import trophy from '../../../assets/IEEE_Trophy.png';
import { useGSAP } from '@gsap/react';
import type { Award } from '@/shared/types/award.types';
import { AWARD_SOURCE_LABELS } from '@/shared/types/award.types';
import LaurelLeft from '../../../assets/LaurelLeftSide-removebg-preview.png';
import LaurelRight from '../../../assets/LaurelRightSide-removebg-preview.png';

export const TrophyRow = ({
  award,
  index,
  darkMode,
  onClick
}: {
  award: Award;
  index: number;
  darkMode: boolean;
  onClick?: () => void;
}) => {
  const isEven = index % 2 === 0;
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (
      !cardRef.current ||
      !imgRef.current ||
      !contentRef.current ||
      !titleRef.current
    )
      return;
    const xOffset = window.innerWidth < 768 ? 30 : 60;

    const scrollConfig = {
      trigger: cardRef.current,
      start: 'top 82%',
      toggleActions: 'play none none reset',
    };

    gsap.fromTo(
      titleRef.current,
      { x: isEven ? -xOffset : xOffset, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: scrollConfig,
      }
    );

    gsap.fromTo(
      contentRef.current,
      { x: isEven ? xOffset : -xOffset, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2,
        scrollTrigger: scrollConfig,
      }
    );

    gsap.fromTo(
      imgRef.current,
      { x: isEven ? -xOffset : xOffset, y: 60, opacity: 0, scale: 0.92 },
      {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        delay: 0.4,
        scrollTrigger: scrollConfig,
      }
    );
  }, [isEven]);

  return (
    <div ref={cardRef} onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
      <div
        className={`flex flex-col items-center gap-8 pt-4 sm:pt-6 md:pt-8 ${
          isEven ? 'md:flex-row' : 'md:flex-row-reverse'
        }`}
      >
        {/* Trophy Image */}
        <div className="flex flex-col items-center w-full md:w-1/2">
          <div
            className="relative flex justify-end items-end rounded-lg z-10"
            ref={imgRef}
          >
            <img
              src={award.image_url || trophy}
              alt={award.title}
              className="w-24 h-32 sm:w-32 sm:h-40 md:w-36 md:h-44 lg:w-40 lg:h-48 object-contain scale-[1.6] sm:scale-[1.7] md:scale-[1.8] origin-bottom translate-y-8 sm:translate-y-10 md:translate-y-12"
            />
            {award.won_count > 0 ? (
              <div
                className={`flex -ml-3 sm:-ml-5 md:-ml-6 items-end gap-1 sm:gap-1.5 md:gap-2 ${
                  darkMode ? 'text-white' : 'text-primary'
                }`}
              >
                <span className="text-lg sm:text-2xl md:text-2xl lg:text-3xl font-bold leading-none pb-1">
                  {award.won_count}
                </span>
                <div className="text-[5px] sm:text-[6px] md:text-[7px] lg:text-[8px] uppercase font-bold pb-0.5 opacity-90">
                  <p>Times</p>
                  <p>Winner</p>
                </div>
              </div>
            ) : (
              <span
                className={`absolute bottom-1 right-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  darkMode
                    ? 'bg-gray-800/80 border-gray-600 text-gray-400'
                    : 'bg-white/80 border-gray-300 text-gray-500'
                } backdrop-blur-sm shadow-sm`}
              >
                Not Acquired
              </span>
            )}
          </div>

          {/* Title bar — now has its own ref */}
          <div className="text-center w-full" ref={titleRef}>
            <h4
              className={`flex items-center justify-center text-xs sm:text-sm md:text-base lg:text-lg font-bold rounded-t-xl rounded-b-md ${
                darkMode
                  ? 'bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 text-white'
                  : 'bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 text-white'
              } shadow-[0_14px_18px_-8px_rgba(0,0,0,0.6)]`}
            >
              <img
                src={LaurelLeft}
                alt=""
                className="w-8 md:w-10 lg:w-12 flex-shrink-0 opacity-90"
              />
              <div>
                <div>{award.title}</div>
                <div className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide text-info uppercase mb-1.5 sm:mb-2 line-clamp-1">
                  {AWARD_SOURCE_LABELS[award.source]} • {award.years && award.years.length > 0 ? award.years.join(', ') : 'Unknown'}
                </div>
              </div>
              <img
                src={LaurelRight}
                alt=""
                className="w-8 md:w-10 lg:w-12 flex-shrink-0 opacity-90"
              />
            </h4>
          </div>
        </div>

        {/* Description */}
        <div
          className={`relative w-full md:w-1/2 text-center`}
          ref={contentRef}
        >
          <div
            className="absolute top-1/2 left-1/2 pointer-events-none -z-10"
            style={{
              width: 'min(80vw, 400px)',
              height: '200px',
              transform: 'translate(-50%, -50%)',
              background:
                'radial-gradient(ellipse at center, rgba(74,144,217,0.25) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />
          <p
            className={`text-base md:text-lg lg:text-xl  ${
              darkMode ? 'text-white' : 'text-foreground'
            }`}
          >
            {award.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrophyRow;
