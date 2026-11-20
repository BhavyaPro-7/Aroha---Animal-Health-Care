import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    message: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'An unexpected error occurred.' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AROHA Application Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F7F0] text-[#202722] flex items-center justify-center p-6">
          <div className="max-w-lg w-full rounded-xl border border-[#202722]/15 bg-white p-8">
            <p className="text-xs font-medium text-[#2E7055] mb-2">AROHA</p>
            <h1 className="font-display text-2xl font-bold text-[#202722]">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#202722]/75">
              We encountered an issue syncing your care data. Please reload the page to try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-[#173D32] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2E7055] transition-colors cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
