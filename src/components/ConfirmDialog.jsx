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
      <p className="text-black/55 text-sm leading-relaxed mb-6 font-bold">{message}</p>
      <div className="flex gap-3">
        {handleCancel && (
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-white border-4 border-black shadow-[4px_4px_0px_#000] px-4 py-3 text-xs font-black uppercase tracking-wider hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onConfirm}
          className={`flex-1 px-4 py-3 text-xs font-black uppercase tracking-wider border-4 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all ${
            destructive
              ? 'bg-red-500 text-white'
              : 'bg-yellow-400 text-black'
          }`}
        >
          {label}
        </button>
      </div>
    </Modal>
  );
}