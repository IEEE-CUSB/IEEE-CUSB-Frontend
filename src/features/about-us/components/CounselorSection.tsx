import { motion } from 'framer-motion';
import { HiMail } from 'react-icons/hi';
import { IoLogoLinkedin } from 'react-icons/io5';
import raniaOsamaImage from '../../../assets/team/Rania_Osama.png';

interface CounselorSectionProps {
  darkMode?: boolean;
}

const COUNSELOR = {
  name: 'Rania Osama Hassan',
  role: 'Branch Counselor',
  email: 'rania.osama@eng.cu.edu.eg',
  linkedin: 'https://www.linkedin.com/in/rania-osama-84290043/',
  image: raniaOsamaImage,
};

export const CounselorSection = ({ darkMode }: CounselorSectionProps) => {
  return (
    <section
      className={`py-12 md:py-20 px-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }}
        >
          <h2
            className={`text-3xl md:text-4xl font-bold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Branch Counselor
          </h2>
          <p
            className={`mb-10 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            Guiding and mentoring our student branch
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0.0, 0.2, 1],
            delay: 0.2,
          }}
          className="inline-block"
        >
          <div
            className={`rounded-2xl overflow-hidden shadow-xl max-w-sm mx-auto ${
              darkMode ? 'bg-gray-900' : 'bg-white'
            }`}
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={COUNSELOR.image}
                alt={COUNSELOR.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-bold">{COUNSELOR.name}</h3>
                <p className="text-sm text-white/80">{COUNSELOR.role}</p>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <a
                href={`mailto:${COUNSELOR.email}`}
                className={`flex items-center gap-3 text-sm rounded-lg px-4 py-2.5 transition-colors ${
                  darkMode
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <HiMail className="w-5 h-5 text-primary" />
                <span>{COUNSELOR.email}</span>
              </a>

              <a
                href={COUNSELOR.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 text-sm rounded-lg px-4 py-2.5 transition-colors ${
                  darkMode
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <IoLogoLinkedin className="w-5 h-5 text-[#0077b5]" />
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
