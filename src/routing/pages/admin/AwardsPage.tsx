import { useState, useMemo, useCallback } from 'react';
import { useTheme } from '@/shared/hooks/useTheme';
import { HiTrophy } from 'react-icons/hi2';
import { FiEdit2, FiTrash2, FiAward } from 'react-icons/fi';
import { type ColumnDef } from '@ieee-ui/ui';
import { AdminMobileCard } from '@/shared/components/AdminMobileCard';
import { DataTable } from '@ieee-ui/ui';
import AddEditAwardModal from '@/features/admin/components/awardAdminPanel/AddEditAwardModal';
import AwardDetailModal from '@/features/awards/components/AwardDetailModal';
import { ConfirmDeleteModal } from '@/shared/components/ConfirmDeleteModal';
import {
  useAwards,
  useCreateAward,
  useUpdateAward,
  useDeleteAward,
} from '@/shared/queries/awards';
import type {
  Award,
  CreateAwardRequest,
  UpdateAwardRequest,
} from '@/shared/types/award.types';
import { AWARD_SOURCE_LABELS } from '@/shared/types/award.types';
import IEEETrophy from '@/assets/IEEE_Trophy.png';
import { useDebounce } from '@/shared/hooks/useDebounce';

export const AwardsPage = () => {
  const { isDark } = useTheme();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  /* API hooks */
  const { data: awardsData, isLoading } = useAwards({ search: debouncedSearch });
  const createAward = useCreateAward();
  const updateAward = useUpdateAward();
  const deleteAward = useDeleteAward();

  const awards = useMemo(() => awardsData?.awards ?? [], [awardsData]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAward, setSelectedAward] = useState<Award | undefined>(undefined);
  const [viewAward, setViewAward] = useState<Award | null>(null);
  const [deleteAwardTarget, setDeleteAwardTarget] = useState<Award | null>(null);

  /* handlers */
  const handleAdd = useCallback(() => {
    setSelectedAward(undefined);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((award: Award) => {
    setSelectedAward(award);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((award: Award) => {
    setDeleteAwardTarget(award);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteAwardTarget) return;
    deleteAward.mutate(deleteAwardTarget.id, {
      onSuccess: () => setDeleteAwardTarget(null),
    });
  }, [deleteAward, deleteAwardTarget]);

  const handleSave = useCallback(
    async (data: CreateAwardRequest | UpdateAwardRequest, id?: string) => {
      if (id) {
        const updated = await updateAward.mutateAsync({
          id,
          data: data as UpdateAwardRequest,
        });
        setIsModalOpen(false);
        setSelectedAward(undefined);
        return updated;
      } else {
        const created = await createAward.mutateAsync(data as CreateAwardRequest);
        setIsModalOpen(false);
        return created;
      }
    },
    [createAward, updateAward]
  );

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedAward(undefined);
  }, []);

  const handleView = useCallback((award: Award) => {
    setViewAward(award);
  }, []);

  const handleCloseView = useCallback(() => {
    setViewAward(null);
  }, []);

  /* table columns */
  const columns = useMemo<ColumnDef<Award>[]>(
    () => [
      {
        header: 'Award',
        cell: (item: Award) => (
          <div
            onClick={() => handleView(item)}
            className="flex items-center gap-3 min-w-0 cursor-pointer"
          >
            <div
              className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden ${
                isDark ? 'bg-yellow-900/30' : 'bg-yellow-50'
              }`}
            >
              <img
                src={item.image_url || IEEETrophy}
                alt="trophy"
                className="w-6 h-6 object-contain"
                onError={e => {
                  (e.currentTarget as HTMLImageElement).src = IEEETrophy;
                }}
              />
            </div>
            <div className="min-w-0">
              <p
                className={`font-semibold text-sm truncate hover:underline ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {item.title}
              </p>
              {item.won_count > 0 && (
                <p
                  className={`text-xs truncate flex items-center gap-1 ${
                    isDark ? 'text-yellow-400' : 'text-yellow-600'
                  }`}
                >
                  <HiTrophy className="w-3 h-3" />
                  {item.won_count}× won
                </p>
              )}
            </div>
          </div>
        ),
      },
      {
        header: 'Year',
        cell: (item: Award) => (
          <div onClick={() => handleView(item)} className="cursor-pointer">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold border ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-gray-300'
                  : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}
            >
              {AWARD_SOURCE_LABELS[item.source]} • {item.year}
            </span>
          </div>
        ),
        className: 'text-center',
      },
      {
        header: 'Description',
        cell: (item: Award) => (
          <div onClick={() => handleView(item)} className="cursor-pointer">
            <span
              className={`line-clamp-2 text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
              title={item.description}
            >
              {item.description}
            </span>
          </div>
        ),
      },
      {
        header: 'Actions',
        className: 'text-right',
        cell: (item: Award) => (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => handleEdit(item)}
              className={`group p-2 rounded-lg transition-all duration-200 ${
                isDark
                  ? 'text-gray-500 hover:text-primary hover:bg-primary/10'
                  : 'text-gray-400 hover:text-primary hover:bg-primary/5'
              }`}
              title="Edit award"
            >
              <FiEdit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => handleDelete(item)}
              className={`group p-2 rounded-lg transition-all duration-200 ${
                isDark
                  ? 'text-gray-500 hover:text-red-400 hover:bg-red-400/10'
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
              title="Delete award"
            >
              <FiTrash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        ),
      },
    ],
    [isDark, handleEdit, handleDelete, handleView]
  );

  const isPending = createAward.isPending || updateAward.isPending;

  return (
    <div className="space-y-6">
      <DataTable
        title="Awards Management"
        subtitle="Manage IEEE awards and recognitions"
        headerIcon={<FiAward className="w-5 h-5 text-primary" />}
        headerAction={
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/90 active:scale-95 transition-all duration-200 shadow-md shadow-primary/20 flex-shrink-0"
          >
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" d="M0 0h24v24H0V0z" />
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            Add Award
          </button>
        }
        data={awards}
        columns={columns}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by title or description…"
        emptyMessage="No awards yet"
        darkMode={isDark}
        renderMobileCard={award => (
          <AdminMobileCard
            isDark={isDark}
            title={award.title}
            subtitle={award.description}
            badge={`${AWARD_SOURCE_LABELS[award.source]} • ${award.years && award.years.length > 0 ? award.years.join(', ') : 'Unknown'}`}
            avatar={
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden ${isDark ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}
              >
                <img
                  src={award.image_url || IEEETrophy}
                  alt="trophy"
                  className="w-6 h-6 object-contain"
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).src = IEEETrophy;
                  }}
                />
              </div>
            }
            onEdit={() => handleEdit(award)}
            onDelete={() => handleDelete(award)}
            onView={() => handleView(award)}
          />
        )}
      />

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <AddEditAwardModal
          isOpen={isModalOpen}
          onClose={handleClose}
          onSave={handleSave}
          award={selectedAward}
          isPending={isPending}
        />
      )}

      {/* Detail Modal */}
      <AwardDetailModal award={viewAward} onClose={handleCloseView} />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteAwardTarget}
        itemName={deleteAwardTarget?.title ?? ''}
        entityLabel="award"
        isDark={isDark}
        isPending={deleteAward.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteAwardTarget(null)}
      />
    </div>
  );
};
