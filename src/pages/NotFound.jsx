import { Link } from 'react-router-dom';
import RetroWindow from '../components/RetroWindow';
import { IconWarning, IconClose } from '../components/icons/PixelIcons';

export default function NotFound() {
  return (
    <div className="booking-page" style={{ alignItems: 'center' }}>
      <RetroWindow title="Error 404" titleVariant="orange" style={{ maxWidth: 400 }}>
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <IconWarning size={48} style={{ margin: '0 auto 12px', display: 'block', color: 'var(--color-orange)' }} />
          <div style={{ fontSize: 36, fontWeight: 700, fontFamily: "'Anton', sans-serif", color: 'var(--color-orange)', lineHeight: 1 }}>
            404
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', margin: '6px 0 8px' }}>
            Page Not Found
          </div>
          <div style={{ fontSize: 10, color: 'var(--color-gray)', marginBottom: 16 }}>
            The page you're looking for doesn't exist or has been moved.
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <Link to="/" className="retro-btn retro-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <IconClose size={14} />
              OK
            </Link>
          </div>
        </div>
      </RetroWindow>
    </div>
  );
}
