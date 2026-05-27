import Modal from './Modal';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmText = 'Confirm', destructive = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-white/55 text-sm leading-relaxed mb-6">{message}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 brut-btn px-4 py-3 text-sm uppercase tracking-wider"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`flex-1 px-4 py-3 text-sm uppercase tracking-wider font-['Anton'] ${
            destructive
              ? 'bg-red-600 border-2 border-red-800 text-white font-bold rounded-xl shadow-[3px_3px_0_#991b1b] hover:shadow-[4px_4px_0_#991b1b] hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-[2px_2px_0_#991b1b] transition-all'
              : 'brut-btn-primary'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
