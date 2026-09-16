import React, { useMemo, useState } from 'react';
import { type ColumnDef, DataTable } from '@ieee-ui/ui';
import { FiTrash2, FiTag } from 'react-icons/fi';
import { useTheme } from '@/shared/hooks/useTheme';
import { ConfirmDeleteModal } from '@/shared/components/ConfirmDeleteModal';
import { useGetCategories, useCreateCategory, useDeleteCategory, useGetCategoryUsage } from '@/shared/queries/categories/categories.queries';
import { Category, CategoryType } from '@/shared/types/category.types';
import toast from 'react-hot-toast';

interface CategoriesTabProps {
  type: CategoryType;
}

const DeleteCategoryModal = ({
  isOpen,
  onClose,
  category,
  onConfirm,
  isPending
}: {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
  onConfirm: () => void;
  isPending: boolean;
}) => {
  const { data: usageCount, isLoading } = useGetCategoryUsage(isOpen ? category?.id : undefined);
  const { isDark } = useTheme();

  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Category"
      itemName={category?.name || ''}
      entityLabel="category"
      isDark={isDark}
      isPending={isPending}
      warningMessage={
        isLoading 
          ? "Checking usage..." 
          : usageCount && usageCount > 0
            ? `WARNING: This category is currently assigned to ${usageCount} items. If you delete it, these items will automatically be reassigned to the "Other" category.`
            : "Are you sure you want to delete this category?"
      }
    />
  );
};

export const CategoriesTab: React.FC<CategoriesTabProps> = ({ type }) => {
  const { isDark } = useTheme();
  
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useGetCategories({ type, limit: 100 });
  const categories = data?.categories || [];
  
  const createMutation = useCreateCategory();
  const deleteMutation = useDeleteCategory();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCategory) {
      await deleteMutation.mutateAsync(selectedCategory.id);
      setIsDeleteOpen(false);
      setSelectedCategory(undefined);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await createMutation.mutateAsync({ name: newCategoryName.trim(), type });
      setNewCategoryName('');
      setIsAdding(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add category');
    }
  };

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        header: 'Category Name',
        accessorKey: 'name',
        cell: item => (
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-primary/20' : 'bg-primary/10'}`}>
              <FiTag className={`w-4 h-4 ${isDark ? 'text-primary-light' : 'text-primary'}`} />
            </div>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.name}</p>
          </div>
        ),
      },
      {
        header: 'Created At',
        accessorKey: 'created_at',
        cell: item => (
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {new Date(item.created_at).toLocaleDateString()}
          </span>
        ),
      },
      {
        header: 'Actions',
        className: 'text-right',
        cell: item => (
          <div className="flex items-center justify-end gap-2">
            {item.name !== 'Other' && (
              <button
                onClick={() => handleDeleteClick(item)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'text-gray-500 hover:text-red-400 hover:bg-red-400/10'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
                title="Delete Category"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ),
      },
    ],
    [isDark]
  );

  return (
    <div className="space-y-6">
      {isAdding ? (
        <form onSubmit={handleAddCategory} className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Add New Category</h3>
          <div className="flex gap-3">
            <input
              type="text"
              autoFocus
              placeholder="Category Name..."
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm border focus:ring-2 focus:ring-primary outline-none transition-all ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
            <button
              type="submit"
              disabled={createMutation.isPending || !newCategoryName.trim()}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50"
            >
              {createMutation.isPending ? 'Adding...' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => { setIsAdding(false); setNewCategoryName(''); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                isDark ? 'border-gray-600 hover:bg-gray-700 text-white' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <DataTable
        title="Categories Management"
        subtitle={`Manage categories for ${type.toLowerCase()}s.`}
        headerIcon={<FiTag className="w-5 h-5 text-primary" />}
        headerAction={
          !isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/90 active:scale-95 transition-all duration-200 shadow-md shadow-primary/20 flex-shrink-0"
            >
              Add Category
            </button>
          )
        }
        data={filteredCategories}
        columns={columns}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search categories..."
        emptyMessage="No categories found."
        darkMode={isDark}
      />

      <DeleteCategoryModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        category={selectedCategory}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
};
