import { motion } from 'framer-motion';
import type { Category } from '@/shared/types/category.types';

interface EventsFilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  darkMode?: boolean;
  categories?: Category[];
}

export const EventsFilterBar = ({
  activeFilter,
  onFilterChange,
  darkMode,
  categories = [],
}: EventsFilterBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`flex flex-col-reverse md:flex-row items-stretch md:items-center gap-4 mb-8 p-3 rounded-lg shadow-sm transition-all duration-300 ${
        darkMode ? 'bg-gray-800 shadow-blue-900/5' : 'bg-white shadow-gray-100'
      }`}
    >
      {/* Filters Group - Horizontal Scroll on Mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 -mx-1 px-1 no-scrollbar md:overflow-visible">
        <motion.button
            onClick={() => onFilterChange('All')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeFilter === 'All'
                ? 'bg-primary text-white'
                : darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
            />
            </svg>
            All
        </motion.button>

        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => onFilterChange(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeFilter === category.id
                ? 'bg-primary text-white'
                : darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </motion.button>
        ))}
      </div>

      {/* Search and Sort Group */}
      <div className="flex items-center gap-2 w-full md:w-auto md:ml-auto">
        {/* Search Bar */}
        <div className="relative flex-1 md:w-64">
            <input
            type="text"
            placeholder="Search events..."
            className={`w-full px-4 py-2 pl-10 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ${
                darkMode
                ? 'bg-gray-700/50 text-white placeholder-gray-500'
                : 'bg-gray-50 text-gray-900 placeholder-gray-400'
            }`}
            />
            <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
            </svg>
        </div>

        {/* Sort Button */}
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
            darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
            <svg
            className={`w-4 h-4 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
            </svg>
            <span
            className={`font-medium transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
            Sort
            </span>
        </motion.button>
      </div>
    </motion.div>
  );
};
