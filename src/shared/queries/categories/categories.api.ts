import { apiClient } from '@/shared/config/api.config';
import { API_ENDPOINTS } from '@/shared/constants/apiConstants';
import { Category, CategoryType } from '@/shared/types/category.types';
import { BackendPaginatedResponse, PaginatedPayload, PaginationParams } from '@/shared/types/auth.types';

export interface CategoryQueryParams extends PaginationParams {
  type?: CategoryType | string;
}

export const categoriesApi = {
  getCategories: async (params?: CategoryQueryParams): Promise<PaginatedPayload<Category, 'categories'>> => {
    const filteredParams = params
      ? Object.fromEntries(
          Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== '')
            .map(([k, v]) => [k, String(v)])
        )
      : undefined;

    const response = await apiClient.get<BackendPaginatedResponse<Category, 'categories'>>(
      API_ENDPOINTS.CATEGORIES.GET_ALL,
      { params: filteredParams }
    );
    return response.data.data;
  },

  createCategory: async (data: Partial<Category>): Promise<Category> => {
    const response = await apiClient.post<{ message: string; data: { category: Category } }>(
      API_ENDPOINTS.CATEGORIES.CREATE,
      data
    );
    return response.data.data.category;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CATEGORIES.DELETE(id));
  },

  getCategoryUsage: async (id: string): Promise<number> => {
    const response = await apiClient.get<{ message: string; data: { usageCount: number } }>(
      `/admin/categories/${id}/usage`
    );
    return response.data.data.usageCount;
  },
};
