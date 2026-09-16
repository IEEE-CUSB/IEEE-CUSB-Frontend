import { useState } from 'react';
import { useTheme } from '@/shared/hooks/useTheme';
import VacanciesTab from './VacanciesTab';
import { CategoriesTab } from '../categoryAdminPanel/CategoriesTab';
import { CategoryType } from '@/shared/types/category.types';

const RecruitmentAdminView = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('vacancies');

  const tabs = [
    { id: 'vacancies', label: 'Vacancies' },
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
        {activeTab === 'vacancies' && <VacanciesTab />}
        {activeTab === 'categories' && <CategoriesTab type={CategoryType.RECRUITMENT} />}
      </div>
    </div>
  );
};

export default RecruitmentAdminView;
