import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { IoLogoLinkedin } from 'react-icons/io5';
import { FaGithub, FaTwitter } from 'react-icons/fa';

export interface BoardMemberCardData {
  name: string;
  role: string;
  bio?: string;
  image: string;
  socials?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export type BoardMemberCardSize = 'sm' | 'md' | 'lg';

interface BoardMemberCardProps {
  member: BoardMemberCardData;
  size?: BoardMemberCardSize;
  delay?: number;
  disableReveal?: boolean;
}

const SIZE_CONFIG: Record<BoardMemberCardSize, {
  avatar: string;
  name: string;
  role: string;
  bio: string;
  icon: string;
  card: string;
  padding: string;
}> = {
  sm: {
    avatar: 'w-14 h-14',
    name: 'text-sm font-bold',
    role: 'text-xs',
    bio: 'text-xs',
    icon: 'text-sm',
    card: 'w-36',
    padding: 'p-3',
  },
  md: {
    avatar: 'w-[72px] h-[72px]',
    name: 'text-base font-bold',
    role: 'text-xs',
    bio: 'text-xs',
    icon: 'text-sm',
    card: 'w-44',
    padding: 'p-4',
  },
  lg: {
    avatar: 'w-24 h-24',
    name: 'text-lg font-bold',
    role: 'text-sm',
    bio: 'text-xs',
    icon: 'text-base',
    card: 'w-52',
    padding: 'p-5',
  },
};

export const BoardMemberCard = ({
  member,
  size = 'md',
  delay = 0,
  disableReveal = false,
}: BoardMemberCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const revealed = disableReveal || isInView;
  const s = SIZE_CONFIG[size];

  const hasSocials =
    member.socials?.linkedin ||
    member.socials?.github ||
    member.socials?.twitter;

  return (
    <motion.div
      ref={ref}
      className={`group relative flex flex-col items-center rounded-2xl bg-card border border-border shadow-sm
        hover:shadow-xl hover:border-primary/40
        transition-all duration-300 cursor-default ${s.card} ${s.padding}`}
      style={{ willChange: 'transform' }}
      initial={disableReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {/* Avatar */}
      <div className="relative mb-3 shrink-0">
        <div
          className={`${s.avatar} rounded-full overflow-hidden ring-2 ring-border group-hover:ring-primary/50 transition-all duration-300 shrink-0`}
        >
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Name & Role */}
      <div className="text-center w-full">
        <p className={`${s.name} text-foreground leading-tight`}>{member.name}</p>
        <p className={`${s.role} text-primary mt-0.5 font-medium`}>{member.role}</p>
      </div>

      {/* Bio */}
      {member.bio && (
        <p className={`${s.bio} text-muted-foreground text-center mt-2 line-clamp-2 leading-relaxed`}>
          {member.bio}
        </p>
      )}

      {/* Social icons */}
      {hasSocials && (
        <div className={`flex items-center gap-2.5 mt-3 ${s.icon}`}>
          {member.socials?.linkedin && member.socials.linkedin !== '#' && (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#0077b5] transition-colors duration-200"
              onClick={e => e.stopPropagation()}
            >
              <IoLogoLinkedin />
            </a>
          )}
          {member.socials?.github && member.socials.github !== '#' && (
            <a
              href={member.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              onClick={e => e.stopPropagation()}
            >
              <FaGithub />
            </a>
          )}
          {member.socials?.twitter && member.socials.twitter !== '#' && (
            <a
              href={member.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#1DA1F2] transition-colors duration-200"
              onClick={e => e.stopPropagation()}
            >
              <FaTwitter />
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
};
