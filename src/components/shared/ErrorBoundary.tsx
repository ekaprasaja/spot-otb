"use client";

import React, { ErrorInfo } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { logger } from '@/utils/logger';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error in component tree:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="text-2xl font-outfit font-bold text-white mb-4">Terjadi Kesalahan Sistem</h2>
          <p className="text-foreground/60 mb-8 max-w-md mx-auto">
            Aplikasi mengalami kendala teknis yang tidak terduga. Silakan muat ulang halaman untuk melanjutkan pemantauan klinis.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
          >
            <RefreshCcw className="w-4 h-4" /> Muat Ulang Aplikasi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
