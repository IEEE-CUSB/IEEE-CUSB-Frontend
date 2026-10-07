import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommitteeCard } from './CommitteeCard';
import { SectionIcon } from './SectionIcon';
import { MemberCard as BoardMemberCard } from '@/shared/components/MemberCard';
import type {
  BoardMember,
  CommitteeCategory,
  Committee,
} from '@/shared/types/committees.types';

interface TabbedViewProps {
  boardMembers: BoardMember[];
  categories: CommitteeCategory[];
  committees: Committee[];
  onViewDetails: (committee: Committee) => void;
}

export const TabbedView = ({
  boardMembers,
  categories,
  committees,
  onViewDetails,
}: TabbedViewProps) => {
  const [activeTab, setActiveTab] = useState(0);

  // Group committees by category
  const sections = categories.map((category) => ({
    name: category.name,
    committees: committees.filter((c) => c.category_id === category.id),
  }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* ─── Executive Board (Pinned) ─── */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-10 flex items-center gap-2">
          <span className="w-1.5 h-8 bg-primary rounded-full" />
          Executive Board
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {boardMembers.map((exec, i) => (
            <BoardMemberCard
              key={exec.id}
              member={{
                name: exec.name,
                role: exec.role,
                bio: exec.bio || '',
                image: exec.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(exec.name)}&background=0f172a&color=fff&size=256`,
                socials: {
                  linkedin: exec.linkedin,
                  github: exec.github,
                  twitter: exec.twitter,
                },
              }}
              roleOverride={exec.role}
              delay={i * 0.08}
              size="md"
            />
          ))}
        </div>
      </div>

      {/* ─── Filter Tabs ─── */}
      {sections.length > 0 && (
        <div className="mb-8">
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {sections.map((section, i) => (
              <button
                key={section.name}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${
                  activeTab === i
                    ? 'bg-primary border-primary text-white shadow-md'
                    : 'bg-card border-border text-foreground hover:border-primary/40'
                }`}
              >
                <SectionIcon
                  sectionName={section.name}
                  size="sm"
                  active={activeTab === i}
                />
                {section.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Tab Content: Committee Cards ─── */}
      <AnimatePresence mode="wait">
        {(() => {
          const currentSection = sections[activeTab];
          if (!currentSection) return null;
          return (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <SectionIcon sectionName={currentSection.name} size="lg" />
                {currentSection.name} Committees
              </h3>
              <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
                {currentSection.committees.map((committee, i) => (
                  <CommitteeCard
                    key={committee.id}
                    committee={committee}
                    delay={i * 0.08}
                    onViewDetails={onViewDetails}
                  />
                ))}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

