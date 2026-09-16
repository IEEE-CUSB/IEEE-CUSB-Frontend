import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi, CategoryQueryParams } from './categories.api';
import { QUERY_KEYS } from '@/shared/constants/apiConstants';

export const useGetCategories = (params?: CategoryQueryParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.CATEGORIES.ALL, params],
    queryFn: () => categoriesApi.getCategories(params),
  });
};

export const useGetCategoryUsage = (id?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.CATEGORIES.ONE(id || ''), 'usage'],
    queryFn: () => categoriesApi.getCategoryUsage(id!),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
    },
  });
};
