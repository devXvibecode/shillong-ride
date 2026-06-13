import { Component } from 'react';
import { Link } from 'react-router-dom';

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
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6 opacity-30">⚠</div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Something went wrong</h2>
            <p className="text-white/50 text-sm mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
                className="px-6 py-3 bg-amber-400 text-black font-bold rounded-lg border-2 border-var-border shadow-[4px_4px_0_0_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.8)] transition-all"
              >
                Reload Page
              </button>
              <Link
                to="/"
                className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg border-2 border-white/20 hover:bg-white/20 transition-all"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
