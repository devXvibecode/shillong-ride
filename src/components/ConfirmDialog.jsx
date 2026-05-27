import Modal from './Modal';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, destructive }) {
  return (
    <Modal open={open} onClose={onCancel}>
      <div className="text-center">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
          destructive ? 'bg-red-500/20' : 'bg-orange-500/20'
        }`}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={destructive ? '#ef4444' : '#f97316'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {destructive ? (
              <>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </>
            ) : (
              <circle cx="12" cy="12" r="10" />
            )}
          </svg>
        </div>
        {title && <h3 className="text-white font-['Anton'] text-lg uppercase tracking-wider mb-2">{title}</h3>}
        <p className="text-white/55 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="flex-1 glass-btn py-3 text-sm">{cancelLabel}</button>
          <button type="button" onClick={onConfirm} className={`flex-1 py-3 text-sm rounded-xl font-['Anton'] uppercase tracking-wider ${
            destructive
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all'
              : 'glass-btn-primary'
          }`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
