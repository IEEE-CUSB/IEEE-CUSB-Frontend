import React, { useState } from 'react';
// Removing TabbedView import
import { useTheme } from '@/shared/hooks/useTheme';
import InstructorsTab from './InstructorsTab';
import WorkshopsTab from './WorkshopsTab';
import { CategoriesTab } from '../categoryAdminPanel/CategoriesTab';
import { CategoryType } from '@/shared/types/category.types';

const WorkshopAdminView: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('workshops');

  const tabs = [
    { id: 'workshops', label: 'Workshops' },
    { id: 'instructors', label: 'Instructors' },
    { id: 'categories', label: 'Categories' },
  ];

  return (
    <div className={`flex h-full flex-col ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex mb-4 px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent hover:text-primary hover:border-primary/50 text-gray-500 dark:text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'workshops' && <WorkshopsTab />}
        {activeTab === 'instructors' && <InstructorsTab />}
        {activeTab === 'categories' && <CategoriesTab type={CategoryType.WORKSHOP} />}
      </div>
    </div>
  );
};

export default WorkshopAdminView;
