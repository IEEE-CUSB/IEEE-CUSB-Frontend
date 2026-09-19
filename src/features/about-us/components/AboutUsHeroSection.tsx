import { motion } from 'framer-motion';
import { PageHeroSection } from '@/shared/components/PageHeroSection';
import ieeeBuildingImage from '../../../assets/about/ieee_building.jpg';

interface AboutUsHeroSectionProps {
  darkMode?: boolean;
}

export const AboutUsHeroSection = ({ darkMode }: AboutUsHeroSectionProps) => {
  const rightImage = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.4,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      className="relative"
    >
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-info/10 to-info/5">
        {/* Image */}
        <div className="aspect-[4/3] relative">
          <img
            src={ieeeBuildingImage}
            alt="IEEE CUSB Excellence"
            className="w-full h-full object-cover"
          />

          {/* Overlay Badge */}
          <div className="absolute bottom-6 left-6 right-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 text-white"
            >
              <div className="text-4xl font-bold mb-1">12+ Years</div>
              <div className="text-sm text-gray-300">
                of Technical Excellence
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );


  return (
    <PageHeroSection
      layout="standard"
      eyebrow="ESTABLISHED 2011"
      title={
        <>
          Engineering the <span className="text-info">Future Together</span>
        </>
      }
      description="We are a community of passionate students at Cairo University, dedicated to advancing technology and fostering innovation through technical excellence and professional development."
      rightContent={rightImage}
      className={
        darkMode
          ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 md:h-screen'
          : 'bg-gradient-to-b from-gray-50 to-white md:h-screen'
      }
      titleClassName={darkMode ? 'text-white' : 'text-gray-900'}
      descriptionClassName={darkMode ? 'text-gray-300' : 'text-gray-600'}
      showDotGrid={false}
    />
  );
};
