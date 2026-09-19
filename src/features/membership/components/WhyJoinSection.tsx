import { SectionReveal } from '@/features/home/components/SectionReveal';
import { FaGlobe, FaBook, FaBriefcase, FaUsers } from 'react-icons/fa';

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => (
  <div className="flex items-start gap-3">
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-foreground mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

import joinUsImage from '../../../assets/join_us.png';

export const WhyJoinSection = () => {
  const features = [
    {
      title: 'Global Network',
      description: 'Connect with professionals and peers worldwide.',
      icon: <FaGlobe className="w-6 h-6 text-primary" />,
    },
    {
      title: 'Technical Resources',
      description: 'Access libraries, standards, and leading magazines.',
      icon: <FaBook className="w-6 h-6 text-primary" />,
    },
    {
      title: 'Career Development',
      description: 'Unlock career opportunities and leadership roles.',
      icon: <FaBriefcase className="w-6 h-6 text-primary" />,
    },
    {
      title: 'Student Activities',
      description: 'Participate in competitions and hackathons.',
      icon: <FaUsers className="w-6 h-6 text-primary" />,
    },
  ];

  return (
    <section className="py-12 md:py-24 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <SectionReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why Join IEEE?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              By being an IEEE member, you are joining a global community of engineers, scientists, and technology professionals. Gain access to the industry's most essential technical information, networking opportunities, career development tools, and exclusive member discounts.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <FeatureItem key={index} {...feature} />
              ))}
            </div>
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <div className="rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center h-full min-h-[400px]">
              <img src={joinUsImage} alt="IEEE CUSB Community" className="w-full h-full object-cover" />
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
};
