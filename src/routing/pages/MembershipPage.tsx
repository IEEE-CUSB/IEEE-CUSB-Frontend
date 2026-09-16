import { useEffect } from 'react';
import { initSmoothScroll } from '@/shared/utils/smoothScroll';
import { MembershipHeroSection } from '@/features/membership/components/MembershipHeroSection';
import { WhyJoinSection } from '@/features/membership/components/WhyJoinSection';
import { MembershipBenefitsSection } from '@/features/membership/components/MembershipBenefitsSection';
import { RecruitmentSection } from '@/features/membership/components/RecruitmentSection';

export const MembershipPage = () => {
  useEffect(() => {
    const cleanup = initSmoothScroll();
    return cleanup;
  }, []);

  return (
    <div className="bg-background">
      <MembershipHeroSection />
      <WhyJoinSection />
      <MembershipBenefitsSection />
      <RecruitmentSection />
    </div>
  );
};

export default MembershipPage;
