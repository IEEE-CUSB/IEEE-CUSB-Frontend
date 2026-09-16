import { motion } from 'framer-motion';
import { HiCalendar, HiLocationMarker, HiClock } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/shared/store/hooks';
import {
  useRegisterWorkshop,
  useCancelWorkshopRegistration,
} from '@/shared/queries/workshops';
import { RoleName } from '@/shared/types/auth.types';

interface WorkshopCardProps {
  workshop: {
    id: string | number;
    title: string;
    category?: string | { id: string; name: string; type: string } | null;
    categoryBadge: string;
    status: string;
    statusBadge: string;
    date: string;
    time: string;
    location: string;
    image: string;
    description: string;
    is_registered?: boolean;
    registration_id?: string;
    remainingSpots?: number;
    is_full?: boolean;
    registrationDeadline?: string;
  };
  index: number;
  darkMode?: boolean;
}

export const WorkshopCard = ({
  workshop,
  index,
  darkMode,
}: WorkshopCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  const isAdmin =
    user?.role?.name === RoleName.ADMIN ||
    user?.role?.name === RoleName.SUPER_ADMIN;

  const { mutate: register, isPending: isRegistering } = useRegisterWorkshop();
  const { mutate: cancelRegistration, isPending: isCancelling } =
    useCancelWorkshopRegistration();

  const isRegistrationClosed = workshop.registrationDeadline
    ? new Date() > new Date(workshop.registrationDeadline)
    : false;

  const isPending = isRegistering || isCancelling;

  const handleRegister = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    register(workshop.id.toString());
  };

  const handleCancelRegistration = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (workshop.id) {
      cancelRegistration(workshop.id.toString());
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'technical':
        return darkMode
          ? 'bg-blue-900/40 text-blue-300'
          : 'bg-blue-100 text-blue-700';
      case 'non-technical':
        return darkMode
          ? 'bg-purple-900/40 text-purple-300'
          : 'bg-purple-100 text-purple-700';
      case 'social':
        return darkMode
          ? 'bg-orange-900/40 text-orange-300'
          : 'bg-orange-100 text-orange-700';
      default:
        return darkMode
          ? 'bg-gray-800 text-gray-300'
          : 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'upcoming':
        return darkMode
          ? 'bg-green-900/40 text-green-300'
          : 'bg-green-100 text-green-700';
      case 'completed':
        return darkMode
          ? 'bg-gray-800 text-gray-300'
          : 'bg-gray-100 text-gray-700';
      default:
        return darkMode
          ? 'bg-gray-800 text-gray-300'
          : 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -12 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col group ${
        darkMode ? 'bg-gray-800 shadow-blue-900/5' : 'bg-white'
      } ${workshop.status === 'Completed' ? 'opacity-75' : ''}`}
    >
      {/* Workshop Image */}
      <div className="relative h-40 overflow-hidden bg-gray-200">
        <img
          src={workshop.image}
          alt={workshop.title}
          className={`w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-110 ${
            workshop.status === 'Completed' ? 'grayscale' : ''
          }`}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getCategoryColor(typeof workshop.category === "string" ? workshop.category : (workshop.category?.name || ""))} transition-all duration-200`}
          >
            {workshop.categoryBadge}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getStatusColor(workshop.status)} transition-all duration-200`}
          >
            {workshop.statusBadge}
          </span>
        </div>
      </div>

      {/* Workshop Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3
          className={`text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300 ${
            workshop.status === 'Completed'
              ? 'text-gray-500'
              : darkMode
                ? 'text-white'
                : 'text-gray-900'
          }`}
        >
          {workshop.title}
        </h3>

        <div
          className={`space-y-1.5 mb-3 text-xs transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
        >
          <div className="flex items-center gap-2">
            <HiCalendar className="w-4 h-4 text-primary" />
            <span>{workshop.date}</span>
            <span>•</span>
            <HiClock className="w-4 h-4 text-primary" />
            <span>{workshop.time}</span>
          </div>
          <div className="flex items-start gap-2">
            <HiLocationMarker className="w-4 h-4 text-primary mt-0.5" />
            <span>{workshop.location}</span>
          </div>
        </div>

        <div className="mt-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            onClick={() => navigate(`/workshops/${workshop.id}`)}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg ${
              workshop.status === 'Completed'
                ? darkMode
                  ? 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-500 hover:text-gray-100'
                : darkMode
                  ? 'bg-gray-700 text-gray-100 hover:bg-gray-100 hover:text-gray-900'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-900 hover:text-gray-200'
            }`}
          >
            {workshop.status === 'Completed' ? 'View Recap' : 'View Details'}
          </motion.button>

          {/* Registration Button - Only for non-completed workshops AND non-admin users */}
          {workshop.status !== 'Completed' && !isAdmin && (
            <>
              {/* Spots remaining indicator */}
              {workshop.remainingSpots !== undefined &&
                (!isRegistrationClosed || workshop.is_registered) && (
                  <p
                    className={`text-xs text-center mt-2 font-medium ${
                      workshop.is_full
                        ? darkMode
                          ? 'text-red-400'
                          : 'text-red-500'
                        : darkMode
                          ? 'text-gray-400'
                          : 'text-gray-500'
                    }`}
                  >
                    {workshop.is_full
                      ? 'Workshop is full'
                      : `${workshop.remainingSpots} spot${workshop.remainingSpots !== 1 ? 's' : ''} remaining`}
                  </p>
                )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                onClick={
                  workshop.is_registered
                    ? handleCancelRegistration
                    : handleRegister
                }
                disabled={
                  isPending ||
                  (!workshop.is_registered &&
                    (workshop.is_full || isRegistrationClosed))
                }
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg mt-2 ${
                  workshop.is_registered
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                    : workshop.is_full || isRegistrationClosed
                      ? darkMode
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/90 shadow-primary/25'
                } ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isPending
                  ? 'Processing...'
                  : workshop.is_registered
                    ? 'Cancel Registration'
                    : isRegistrationClosed
                      ? 'Registration Closed'
                      : workshop.is_full
                        ? 'Workshop Full'
                        : 'Register Now'}
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
