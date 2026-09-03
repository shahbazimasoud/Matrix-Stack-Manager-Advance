import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[350px] w-full flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-lg w-full p-6 rounded-3xl bg-slate-900/90 border border-rose-500/30 shadow-2xl backdrop-blur-xl text-white space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <div>
              <h3 className="text-lg font-black text-white">
                {this.props.fallbackTitle || 'UI Component Recovery'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                A rendering issue occurred in this section, but the system prevented a complete page failure.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-black/50 border border-white/5 font-mono text-[11px] text-rose-300 text-left overflow-x-auto max-h-32">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Component
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 border border-white/10"
              >
                <Home className="w-3.5 h-3.5" />
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
