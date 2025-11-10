import { ReactNode, useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Osmolyte
              </h1>
              <p className="text-sm text-slate-600">
                SIADH • CSW • DI Navigator
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span className="px-2 py-1 bg-slate-100 rounded">Educational Tool</span>
              <span className="px-2 py-1 bg-slate-100 rounded">Not for Clinical Use</span>
            </div>
          </div>
        </div>
      </header>

      {/* Medical Disclaimer Banner */}
      {showDisclaimer && (
        <div className="disclaimer">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-start justify-between">
            <div className="flex-1">
              <p className="font-semibold">Educational Use Only</p>
              <p className="mt-1">
                This tool is for educational purposes only and is not a substitute for professional medical advice,
                diagnosis, or treatment. Always consult qualified healthcare providers for patient care decisions.
              </p>
            </div>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="ml-4 text-amber-600 hover:text-amber-800 font-semibold"
              aria-label="Dismiss disclaimer"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-slate-600 text-center">
            Interactive educational dashboard for learning sodium and water disorders.
            Always follow institutional protocols and current evidence-based guidelines.
          </p>
        </div>
      </footer>
    </div>
  );
};
