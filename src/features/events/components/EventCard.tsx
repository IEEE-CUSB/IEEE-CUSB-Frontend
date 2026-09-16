import { motion } from 'framer-motion';
import { HiCalendar, HiLocationMarker, HiClock } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/shared/store/hooks';
import {
  useRegisterForEvent,
  useCancelRegistration,
} from '@/shared/queries/events';
import { RoleName } from '@/shared/types/auth.types';

interface EventCardProps {
  event: {
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

export const EventCard = ({ event, index, darkMode }: EventCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  const isAdmin =
    user?.role?.name === RoleName.ADMIN ||
    user?.role?.name === RoleName.SUPER_ADMIN;

  const { mutate: register, isPending: isRegistering } = useRegisterForEvent();
  const { mutate: cancelRegistration, isPending: isCancelling } =
    useCancelRegistration();

  const isRegistrationClosed = event.registrationDeadline
    ? new Date() > new Date(event.registrationDeadline)
    : false;

  const isPending = isRegistering || isCancelling;

  const handleRegister = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    register(event.id.toString());
  };

  const handleCancelRegistration = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.id) {
      cancelRegistration(event.id.toString());
    }
  };


  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
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
    switch (status.toLowerCase()) {
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
      } ${event.status === 'Completed' ? 'opacity-75' : ''}`}
    >
      {/* Event Image */}
      <div className="relative h-40 overflow-hidden bg-gray-200">
        <img
          src={event.image}
          alt={event.title}
          className={`w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-110 ${
            event.status === 'Completed' ? 'grayscale' : ''
          }`}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getCategoryColor(typeof event.category === "string" ? event.category : (event.category?.name || ""))} transition-all duration-200`}
          >
            {event.categoryBadge}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getStatusColor(event.status)} transition-all duration-200`}
          >
            {event.statusBadge}
          </span>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3
          className={`text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300 ${
            event.status === 'Completed'
              ? 'text-gray-500'
              : darkMode
                ? 'text-white'
                : 'text-gray-900'
          }`}
        >
          {event.title}
        </h3>

        <div
          className={`space-y-1.5 mb-3 text-xs transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
        >
          <div className="flex items-center gap-2">
            <HiCalendar className="w-4 h-4 text-primary" />
            <span>{event.date}</span>
            <span>•</span>
            <HiClock className="w-4 h-4 text-primary" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-start gap-2">
            <HiLocationMarker className="w-4 h-4 text-primary mt-0.5" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="mt-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            onClick={() => navigate(`/events/${event.id}`)}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg ${
              event.status === 'Completed'
                ? darkMode
                  ? 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-500 hover:text-gray-100'
                : darkMode
                  ? 'bg-gray-700 text-gray-100 hover:bg-gray-100 hover:text-gray-900'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-900 hover:text-gray-200'
            }`}
          >
            {event.status === 'Completed' ? 'View Recap' : 'View Details'}
          </motion.button>

          {/* Registration Button - Only for non-completed events AND non-admin users */}
          {event.status !== 'Completed' && !isAdmin && (
            <>
              {/* Spots remaining indicator */}
              {event.remainingSpots !== undefined && (!isRegistrationClosed || event.is_registered) && (
                <p
                  className={`text-xs text-center mt-2 font-medium ${
                    event.is_full
                      ? darkMode
                        ? 'text-red-400'
                        : 'text-red-500'
                      : darkMode
                        ? 'text-gray-400'
                        : 'text-gray-500'
                  }`}
                >
                  {event.is_full
                    ? 'Event is full'
                    : `${event.remainingSpots} spot${event.remainingSpots !== 1 ? 's' : ''} remaining`}
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                onClick={
                  event.is_registered ? handleCancelRegistration : handleRegister
                }
                disabled={isPending || (!event.is_registered && (event.is_full || isRegistrationClosed))}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg mt-2 ${
                  event.is_registered
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                    : (event.is_full || isRegistrationClosed)
                      ? darkMode
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/90 shadow-primary/25'
                } ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isPending
                  ? 'Processing...'
                  : event.is_registered
                    ? 'Cancel Registration'
                    : isRegistrationClosed
                      ? 'Registration Closed'
                      : event.is_full
                        ? 'Event Full'
                        : 'Register Now'}
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
