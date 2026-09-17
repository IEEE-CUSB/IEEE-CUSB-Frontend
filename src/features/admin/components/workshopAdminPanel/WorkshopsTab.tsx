import React, { useMemo, useState } from 'react';
import { type ColumnDef } from '@ieee-ui/ui';
import { FiEdit2, FiTrash2, FiClock, FiUsers } from 'react-icons/fi';
import { useTheme } from '@/shared/hooks/useTheme';
import { ConfirmDeleteModal } from '@/shared/components/ConfirmDeleteModal';
import { AdminMobileCard } from '@/shared/components/AdminMobileCard';
import { DataTable } from '@ieee-ui/ui';
import { useDebounce } from '@/shared/hooks/useDebounce';
import AddEditWorkshopModal from './AddEditWorkshopModal';
import { WorkshopRegistrationsModal } from './WorkshopRegistrationsModal';
import {
  useGetAdminWorkshops,
  useCreateWorkshop,
  useUpdateWorkshop,
  useDeleteWorkshop,
} from '@/shared/queries/workshops';
import type { Workshop, CreateWorkshopRequest, UpdateWorkshopRequest } from '@/shared/types/workshops.types';

const WorkshopsTab: React.FC = () => {
  const { isDark } = useTheme();
  
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [page, setPage] = useState(1);
  const limit = 10;

  // Reset page when search changes
  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Queries & Mutations
  const searchType = filterValues.searchBy || 'search';
  const { data, isLoading } = useGetAdminWorkshops({
    include_unpublished: true,
    page,
    limit,
    search: searchType === 'search' ? debouncedSearch : undefined,
    location: searchType === 'location' ? debouncedSearch : undefined,
  });
  const workshops = data?.data || [];
  
  const createMutation = useCreateWorkshop();
  const updateMutation = useUpdateWorkshop();
  const deleteMutation = useDeleteWorkshop();

  // State
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | undefined>(undefined);
  const [isRegistrationsModalOpen, setIsRegistrationsModalOpen] = useState(false);
  const [selectedWorkshopForRegistrations, setSelectedWorkshopForRegistrations] = useState<Workshop | undefined>(undefined);

  // Handlers
  const handleAdd = () => {
    setSelectedWorkshop(undefined);
    setIsAddEditOpen(true);
  };

  const handleEdit = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsAddEditOpen(true);
  };

  const handleDeleteClick = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsDeleteOpen(true);
  };

  const handleViewRegistrations = (workshop: Workshop) => {
    setSelectedWorkshopForRegistrations(workshop);
    setIsRegistrationsModalOpen(true);
  };

  const handleSave = async (
    data: CreateWorkshopRequest | UpdateWorkshopRequest,
    id?: string
  ) => {
    if (id) {
      await updateMutation.mutateAsync({ id, data });
    } else {
      await createMutation.mutateAsync(data as CreateWorkshopRequest);
    }

    setIsAddEditOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedWorkshop) {
      await deleteMutation.mutateAsync(selectedWorkshop.id);
      setIsDeleteOpen(false);
      setSelectedWorkshop(undefined);
    }
  };

  const columns = useMemo<ColumnDef<Workshop>[]>(
    () => [
      {
        header: 'Workshop Title',
        accessorKey: 'title',
        className: `font-medium max-w-[200px] truncate ${isDark ? 'text-white' : 'text-gray-900'}`,
      },
      {
        header: 'Date & Time',
        accessorKey: 'start_time',
        cell: item => (
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {new Date(item.start_time).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        ),
      },
      {
        header: 'Capacity',
        accessorKey: 'capacity',
        cell: item => (
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {item.is_full ? (
              <span className={isDark ? 'text-red-400 font-medium' : 'text-red-500 font-medium'}>
                Full ({item.capacity})
              </span>
            ) : (
              `${item.remainingSpots ?? item.capacity}/${item.capacity}`
            )}
          </span>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'is_full',
        cell: item => {
          const isFull = item.is_full;
          const isPast = new Date(item.end_time) < new Date();
          let statusText = 'Open';
          let statusColor = isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-600';

          if (isPast) {
            statusText = 'Completed';
            statusColor = isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600';
          } else if (isFull) {
            statusText = 'Full';
            statusColor = isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-600';
          }

          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
              {statusText}
            </span>
          );
        },
      },
      {
        header: 'Actions',
        className: 'text-right',
        cell: item => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleEdit(item)}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'text-gray-500 hover:text-primary hover:bg-primary/10'
                  : 'text-gray-400 hover:text-primary hover:bg-primary/5'
              }`}
              title="Edit Workshop"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleViewRegistrations(item)}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'text-gray-500 hover:text-blue-400 hover:bg-blue-400/10'
                  : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
              }`}
              title="View Registrations"
            >
              <FiUsers className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteClick(item)}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'text-gray-500 hover:text-red-400 hover:bg-red-400/10'
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
              title="Delete Workshop"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [isDark]
  );

  return (
    <div className="space-y-6">
      <DataTable
        title="Workshops Management"
        subtitle="Manage technical workshops and sessions."
        headerIcon={<FiClock className="w-5 h-5 text-primary" />}
        headerAction={
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/90 active:scale-95 transition-all duration-200 shadow-md shadow-primary/20 flex-shrink-0"
          >
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" d="M0 0h24v24H0V0z" />
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            Add Workshop
          </button>
        }
        data={workshops}
        columns={columns}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={`Search by ${filterValues.searchBy === 'location' ? 'location' : 'title or description'}...`}
        filters={[
          {
            key: 'searchBy',
            label: 'Search Field',
            placeholder: 'Search By...',
            options: [
              { label: 'Title/Description', value: 'search' },
              { label: 'Location', value: 'location' },
            ],
          },
        ]}
        filterValues={filterValues}
        onFilterChange={(key, value) => setFilterValues(prev => ({ ...prev, [key]: value }))}
        onClearFilters={() => {
          setFilterValues({});
          setSearch('');
        }}
        emptyMessage="No workshops found. Click 'Add Workshop' to create one."
        darkMode={isDark}
        page={page}
        totalPages={data?.totalPages || 1}
        totalCount={data?.total || 0}
        onPageChange={setPage}
        renderMobileCard={(workshop) => {
          const isPast = new Date(workshop.end_time) < new Date();
          const badgeText = isPast ? 'Completed' : workshop.is_full ? 'Full' : 'Open';
          return (
            <AdminMobileCard
              isDark={isDark}
              title={workshop.title}
              subtitle={`${new Date(workshop.start_time).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })} · ${workshop.is_full ? `Full (${workshop.capacity})` : `${workshop.remainingSpots ?? workshop.capacity}/${workshop.capacity} spots`}`}
              badge={badgeText}
              description={workshop.description}
              avatar={
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-primary/20' : 'bg-primary/10'}`}>
                  <FiClock className={`w-5 h-5 ${isDark ? 'text-primary-light' : 'text-primary'}`} />
                </div>
              }
              onEdit={() => handleEdit(workshop)}
              onDelete={() => handleDeleteClick(workshop)}
              extraActions={[{
                icon: <FiUsers className="w-3.5 h-3.5" />,
                label: 'Registrations',
                onClick: () => handleViewRegistrations(workshop),
                color: 'info'
              }]}
            />
          );
        }}
      />

      <AddEditWorkshopModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        workshop={selectedWorkshop}
        apiWorkshop={selectedWorkshop}
        onSave={handleSave}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Workshop"
        itemName={selectedWorkshop?.title || ''}
        entityLabel="workshop"
        isDark={isDark}
        isPending={deleteMutation.isPending}
      />

      {isRegistrationsModalOpen && selectedWorkshopForRegistrations && (
        <WorkshopRegistrationsModal
          isOpen={isRegistrationsModalOpen}
          onClose={() => {
            setIsRegistrationsModalOpen(false);
            setSelectedWorkshopForRegistrations(undefined);
          }}
          workshopId={selectedWorkshopForRegistrations.id}
          workshopTitle={selectedWorkshopForRegistrations.title}
        />
      )}
    </div>
  );
};

export default WorkshopsTab;
