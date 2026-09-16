import React, { useState, useEffect } from 'react';
import { Modal } from '@ieee-ui/ui';
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiTag,
} from 'react-icons/fi';
import { useTheme } from '@/shared/hooks/useTheme';
import type { Event } from '@/shared/types/events.types';
import { format } from 'date-fns/format';

interface EventDetailModalProps {
  event: Event | null;
  onClose: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
}) => {
  const { isDark } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(!!event), event ? 180 : 0);
    return () => clearTimeout(t);
  }, [event]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical':
        return isDark
          ? 'bg-blue-900/30 text-blue-300'
          : 'bg-blue-50 text-blue-700';
      case 'Non-Technical':
        return isDark
          ? 'bg-purple-900/30 text-purple-300'
          : 'bg-purple-50 text-purple-700';
      case 'Social':
        return isDark
          ? 'bg-orange-900/30 text-orange-300'
          : 'bg-orange-50 text-orange-700';
      default:
        return isDark
          ? 'bg-gray-800 text-gray-300'
          : 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusInfo = (event: Event) => {
    const now = new Date();
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);

    if (now < start)
      return {
        label: 'Upcoming',
        color: isDark
          ? 'bg-green-900/30 text-green-300'
          : 'bg-green-50 text-green-700',
      };
    if (now >= start && now <= end)
      return {
        label: 'Ongoing',
        color: isDark
          ? 'bg-blue-900/30 text-blue-300'
          : 'bg-blue-50 text-blue-700',
      };
    return {
      label: 'Completed',
      color: isDark
        ? 'bg-gray-800 text-gray-400'
        : 'bg-gray-50 text-gray-700',
    };
  };

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  return (
    <Modal isOpen={!!event} onClose={onClose} size="large" darkMode={isDark}>
      {event && (
        <div
          data-lenis-prevent
          className={`transition-all duration-[350ms] ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          {/* Banner image */}
          <div
            className={`relative w-full h-48 rounded-2xl overflow-hidden mb-6 ${
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
              alt={event.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Badges on top of image */}
            <div className="absolute bottom-3 left-3 flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getCategoryColor(typeof event.category === "string" ? event.category : (event.category?.name || ""))}`}
              >
                <FiTag className="w-3 h-3 inline mr-1" />
                {typeof event.category === "string" ? event.category : event.category?.name}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getStatusInfo(event).color}`}
              >
                {getStatusInfo(event).label}
              </span>
            </div>
          </div>

          {/* Title */}
          <h2
            className={`text-xl font-bold mb-4 leading-snug ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {event.title}
          </h2>

          {/* Meta row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {/* Date */}
            <div className="flex items-center gap-2">
              <FiCalendar
                className={`w-4 h-4 shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-500'}`}
              />
              <span
                className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {isValidDate(event.start_time)
                  ? format(new Date(event.start_time), 'MMM d, yyyy')
                  : 'TBA'}
              </span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2">
              <FiClock
                className={`w-4 h-4 shrink-0 ${isDark ? 'text-green-400' : 'text-green-500'}`}
              />
              <span
                className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {isValidDate(event.start_time) && isValidDate(event.end_time)
                  ? `${format(new Date(event.start_time), 'h:mm a')} – ${format(new Date(event.end_time), 'h:mm a')}`
                  : 'TBA'}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <FiMapPin
                className={`w-4 h-4 shrink-0 ${isDark ? 'text-purple-400' : 'text-purple-500'}`}
              />
              <span
                className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {event.location}
              </span>
            </div>

            {/* Capacity */}
            <div className="flex items-center gap-2">
              <FiUsers
                className={`w-4 h-4 shrink-0 ${isDark ? 'text-orange-400' : 'text-orange-500'}`}
              />
              <span
                className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {event.is_full
                  ? `Full (${event.capacity} capacity)`
                  : `${event.remainingSpots} / ${event.capacity} spots remaining`}
              </span>
            </div>
          </div>

          {/* Registration deadline */}
          {isValidDate(event.registration_deadline) && (
            <div
              className={`flex items-center gap-2 mb-5 px-3 py-2 rounded-lg text-sm ${
                new Date() > new Date(event.registration_deadline)
                  ? isDark
                    ? 'bg-red-900/20 text-red-300'
                    : 'bg-red-50 text-red-600'
                  : isDark
                    ? 'bg-yellow-900/20 text-yellow-300'
                    : 'bg-yellow-50 text-yellow-700'
              }`}
            >
              <FiClock className="w-4 h-4 shrink-0" />
              <span className="font-medium">
                Registration deadline:{' '}
                {format(
                  new Date(event.registration_deadline),
                  'MMM d, yyyy • h:mm a'
                )}
                {new Date() > new Date(event.registration_deadline) &&
                  ' (expired)'}
              </span>
            </div>
          )}

          {/* Divider */}
          <div
            className={`border-t mb-5 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}
          />

          {/* Description */}
          <div>
            <h3
              className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              Description
            </h3>
            <p
              className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {event.description}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default EventDetailModal;
