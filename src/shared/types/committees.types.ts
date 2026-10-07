/**
 * Member roles within a committee
 */
export enum MemberRole {
  HEAD = 'head',
  VICE_HEAD = 'vice_head',
  MEMBER = 'member',
}

export const MEMBER_ROLE_LABELS: Record<MemberRole, string> = {
  [MemberRole.HEAD]: 'Head',
  [MemberRole.VICE_HEAD]: 'Vice Head',
  [MemberRole.MEMBER]: 'Member',
};

// ── Categories ──────────────────────────────────────────────

export interface CommitteeCategory {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategory {
  name: string;
  description: string;
}

export interface UpdateCategory {
  name?: string;
  description?: string;
}

// ── Committees ──────────────────────────────────────────────

export interface Committee {
  id: string;
  name: string;
  about: string;
  category_id: string;
  category: CommitteeCategory;
  created_at: string;
  updated_at: string;
  members?: CommitteeMember[];
}

export interface CreateCommittee {
  name: string;
  about: string;
  category_id: string;
}

export interface UpdateCommittee {
  name?: string;
  about?: string;
  category_id?: string;
}

// ── Committee Members ───────────────────────────────────────

export interface CommitteeMember {
  id: string;
  committee_id: string;
  name: string;
  email: string;
  role: MemberRole;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AddCommitteeMember {
  committee_id: string;
  name: string;
  email: string;
  role: MemberRole;
  image_url?: string;
}

export interface UpdateCommitteeMember {
  committee_id?: string;
  name?: string;
  email?: string;
  role?: MemberRole;
  image_url?: string;
}

// ── Board Members ───────────────────────────────────────────

export interface BoardMember {
  id: string;
  name: string;
  email: string;
  role: string;
  image_url?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBoardMember {
  name: string;
  email: string;
  role: string;
  image_url?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  display_order?: number;
}

export interface UpdateBoardMember {
  name?: string;
  email?: string;
  role?: string;
  image_url?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  display_order?: number;
}

// ── API Response ────────────────────────────────────────────

export interface CommitteeApiResponse<T> {
  data: T;
  count: number;
  message: string;
}
