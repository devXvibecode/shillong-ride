import Modal from './Modal';

export default function ConfirmDialog({
  open,
  onClose,
  onCancel,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
}) {
  const label = confirmLabel || confirmText;

  const handleCancel = onCancel || onClose;

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-white/55 text-sm leading-relaxed mb-6">{message}</p>
      <div className="flex gap-3">
        {handleCancel && (
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 neo-btn-dark px-4 py-3 text-xs uppercase tracking-wider"
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onConfirm}
          className={`flex-1 px-4 py-3 text-xs uppercase tracking-wider font-['Anton'] ${
            destructive
              ? 'neo-btn-danger-dark'
              : 'neo-btn-primary-dark'
          }`}
        >
          {label}
        </button>
      </div>
    </Modal>
  );
}