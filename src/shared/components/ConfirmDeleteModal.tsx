import React from 'react';
import { Modal, Button } from '@ieee-ui/ui';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  itemName: string;
  entityLabel?: string;
  warningMessage?: string;
  isDark: boolean;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  itemName,
  entityLabel = 'item',
  warningMessage,
  isDark,
  isPending,
  onConfirm,
  onClose,
}) => (
  <Modal
    title={title || `Delete ${entityLabel}`}
    isOpen={isOpen}
    onClose={onClose}
    size="small"
    darkMode={isDark}
  >
    <div className="space-y-5">
      <div className="flex justify-center">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center ${
            isDark ? 'bg-red-900/30' : 'bg-red-50'
          }`}
        >
          <FaExclamationTriangle
            className={`w-7 h-7 ${isDark ? 'text-red-400' : 'text-red-500'}`}
          />
        </div>
      </div>

      <div className="text-center space-y-2">
        {warningMessage ? (
          <p className={`font-semibold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            {warningMessage}
          </p>
        ) : (
          <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Are you sure you want to delete this {entityLabel}?
          </p>
        )}
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          You are about to delete{' '}
          <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            "{itemName}"
          </span>
          . This action cannot be undone.
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          buttonText="Cancel"
          onClick={onClose}
          type="basic"
          width="fit"
          darkMode={isDark}
          disabled={isPending}
        />
        <Button
          buttonText={isPending ? 'Deleting…' : `Delete ${entityLabel}`}
          onClick={onConfirm}
          type="danger"
          width="fit"
          darkMode={isDark}
          disabled={isPending}
        />
      </div>
    </div>
  </Modal>
);

export default ConfirmDeleteModal;
