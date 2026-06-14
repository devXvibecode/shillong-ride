import { Component } from 'react';
import { Link } from 'react-router-dom';
import { IconWarning } from './icons/PixelIcons';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', background: 'var(--color-desktop)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div className="retro-window" style={{ maxWidth: 440, width: '100%' }}>
            <div className="retro-titlebar" style={{ background: 'var(--color-error)' }}>
              <div className="retro-titlebar-left">
                <span className="retro-titlebar-text">FATAL ERROR</span>
              </div>
              <div className="retro-titlebar-controls">
                <button className="retro-control retro-control-close" onClick={() => window.location.reload()}>×</button>
              </div>
            </div>
            <div className="retro-window-body" style={{ textAlign: 'center', padding: 24 }}>
              <IconWarning size={48} style={{ margin: '0 auto 12px', display: 'block', color: 'var(--color-error)' }} />
              <div style={{ fontSize: 16, fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>
                Something went wrong
              </div>
              <div style={{
                fontSize: 10, color: 'var(--color-error)',
                fontFamily: "'JetBrains Mono', monospace",
                background: '#FFEEEE', padding: 8, marginBottom: 12,
                border: '2px solid var(--color-black)', textAlign: 'left',
                wordBreak: 'break-all', maxHeight: 100, overflow: 'auto',
              }}>
                {this.state.error?.message || 'An unexpected error occurred'}
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button
                  onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
                  className="retro-btn retro-btn-primary"
                >
                  Restart
                </button>
                <Link
                  to="/"
                  className="retro-btn"
                  onClick={() => this.setState({ hasError: false, error: null })}
                >
                  Close
                </Link>
              </div>
            </div>
            <div className="retro-statusbar" style={{ justifyContent: 'center', fontSize: 9 }}>
              Error Code: {this.state.error?.name || 'UNKNOWN'}
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
