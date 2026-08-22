import React from 'react';
import Modal from './Modal';
import Button from './Button';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <p className="text-sm text-slate-600 mb-6">{message}</p>
      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant={isDanger ? 'primary' : 'secondary'} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
