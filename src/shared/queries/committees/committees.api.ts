import { apiClient } from '@/shared/config/api.config';
import { API_ENDPOINTS } from '@/shared/constants/apiConstants';
import type {
  AddCommitteeMember,
  Committee,
  CommitteeApiResponse,
  CommitteeCategory,
  CommitteeMember,
  CreateCategory,
  CreateCommittee,
  UpdateCategory,
  UpdateCommittee,
  UpdateCommitteeMember,
} from '@/shared/types/committees.types';

import { PaginationParams, BackendPaginatedResponse, PaginatedPayload } from '@/shared/types/auth.types';

export const committeeApi = {
  // ── Categories ──────────────────────────────────────────

  getCategories: async (params?: PaginationParams): Promise<PaginatedPayload<CommitteeCategory, 'categories'>> => {
    const defaultParams = { type: 'COMMITTEE' };
    const filteredParams = params
      ? Object.fromEntries(
          Object.entries({ ...defaultParams, ...params })
            .filter(([_, v]) => v !== undefined && v !== '')
            .map(([k, v]) => [k, String(v)])
        )
      : defaultParams;

    const response = await apiClient.get<
      BackendPaginatedResponse<CommitteeCategory, 'categories'>
    >(API_ENDPOINTS.COMMITTEE_CATEGORIES.GET_ALL, { params: filteredParams });
    return response.data.data;
  },

  createCategory: async (data: CreateCategory): Promise<CommitteeCategory> => {
    const payload = { ...data, type: 'COMMITTEE' };
    const response = await apiClient.post<
      CommitteeApiResponse<CommitteeCategory>
    >(API_ENDPOINTS.COMMITTEE_CATEGORIES.CREATE, payload);
    return response.data.data;
  },

  updateCategory: async (
    id: string,
    data: UpdateCategory
  ): Promise<CommitteeCategory> => {
    const response = await apiClient.patch<
      CommitteeApiResponse<CommitteeCategory>
    >(API_ENDPOINTS.COMMITTEE_CATEGORIES.UPDATE(id), data);
    return response.data.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.COMMITTEE_CATEGORIES.DELETE(id));
  },

  // ── Committees ──────────────────────────────────────────

  getCommittees: async (params?: PaginationParams): Promise<PaginatedPayload<Committee, 'committees'>> => {
    const filteredParams = params
      ? Object.fromEntries(
          Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== '')
            .map(([k, v]) => [k, String(v)])
        )
      : undefined;

    const response = await apiClient.get<
      BackendPaginatedResponse<Committee, 'committees'>
    >(API_ENDPOINTS.COMMITTEES.GET_ALL, { params: filteredParams });
    return response.data.data;
  },

  getCommitteesByCategory: async (
    categoryId: string,
    params?: PaginationParams
  ): Promise<PaginatedPayload<Committee, 'committees'>> => {
    const filteredParams = params
      ? Object.fromEntries(
          Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== '')
            .map(([k, v]) => [k, String(v)])
        )
      : {};

    const response = await apiClient.get<
      BackendPaginatedResponse<Committee, 'committees'>
    >(API_ENDPOINTS.COMMITTEES.GET_ALL, {
      params: { category_id: categoryId, ...filteredParams },
    });
    return response.data.data;
  },

  getCommitteeById: async (id: string): Promise<Committee> => {
    const response = await apiClient.get<CommitteeApiResponse<Committee>>(
      API_ENDPOINTS.COMMITTEES.GET_ONE(id)
    );
    return response.data.data;
  },

  createCommittee: async (data: CreateCommittee): Promise<Committee> => {
    const response = await apiClient.post<CommitteeApiResponse<Committee>>(
      API_ENDPOINTS.COMMITTEES.CREATE,
      data
    );
    return response.data.data;
  },

  updateCommittee: async (
    id: string,
    data: UpdateCommittee
  ): Promise<Committee> => {
    const response = await apiClient.patch<CommitteeApiResponse<Committee>>(
      API_ENDPOINTS.COMMITTEES.UPDATE(id),
      data
    );
    return response.data.data;
  },

  deleteCommittee: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.COMMITTEES.DELETE(id));
  },

  // ── Committee Members ───────────────────────────────────

  getCommitteeMembers: async (
    committeeId: string,
    params?: PaginationParams
  ): Promise<PaginatedPayload<CommitteeMember, 'members'>> => {
    const filteredParams = params
      ? Object.fromEntries(
          Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== '')
            .map(([k, v]) => [k, String(v)])
        )
      : undefined;

    const response = await apiClient.get<
      BackendPaginatedResponse<CommitteeMember, 'members'>
    >(API_ENDPOINTS.COMMITTEES.GET_MEMBERS(committeeId), { params: filteredParams });
    return response.data.data;
  },

  createCommitteeMember: async (
    data: AddCommitteeMember
  ): Promise<CommitteeMember> => {
    const response = await apiClient.post<
      CommitteeApiResponse<CommitteeMember>
    >(API_ENDPOINTS.COMMITTEES.CREATE_COMMITTEE_MEMBER, data);
    return response.data.data;
  },

  updateCommitteeMember: async (
    id: string,
    data: UpdateCommitteeMember
  ): Promise<CommitteeMember> => {
    const response = await apiClient.patch<
      CommitteeApiResponse<CommitteeMember>
    >(API_ENDPOINTS.COMMITTEES.UPDATE_COMMITTEE_MEMBER(id), data);
    return response.data.data;
  },

  deleteCommitteeMember: async (id: string): Promise<void> => {
    await apiClient.delete(
      API_ENDPOINTS.COMMITTEES.DELETE_COMMITTEE_MEMBER(id)
    );
  },

  uploadCommitteeMemberImage: async (id: string, file: File): Promise<CommitteeMember> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post<CommitteeApiResponse<CommitteeMember>>(
      API_ENDPOINTS.COMMITTEES.UPLOAD_MEMBER_IMAGE(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  deleteCommitteeMemberImage: async (id: string): Promise<CommitteeMember> => {
    const response = await apiClient.delete<CommitteeApiResponse<CommitteeMember>>(
      API_ENDPOINTS.COMMITTEES.DELETE_MEMBER_IMAGE(id)
    );
    return response.data.data;
  },
};
