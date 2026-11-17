import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'Une erreur inattendue est survenue.',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6 py-12">
          <div className="max-w-lg w-full bg-white border border-stone-200 rounded-xl p-8 text-stone-900">
            <h1 className="text-2xl font-semibold mb-3">
              Service momentanément indisponible
            </h1>
            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              Une erreur technique s’est produite lors du chargement des données. Vous pouvez
              actualiser la page ou nous contacter directement sur WhatsApp au 07 59 80 21 41.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 text-sm font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              Actualiser la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
