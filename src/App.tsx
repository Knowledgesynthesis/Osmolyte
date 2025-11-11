import { useState } from 'react';
import { Layout } from './components/core/Layout';
import { ControlPanel } from './components/core/ControlPanel';
import { DiagnosticDisplay } from './components/visualizations/DiagnosticDisplay';
import { SIADHvsCSW } from './components/visualizations/SIADHvsCSW';
import { CorrectionMeter } from './components/visualizations/CorrectionMeter';
import { Quiz } from './components/education/Quiz';
import { PearlCards } from './components/education/PearlCards';
import { LearnPage } from './components/learn';
import { scenarios } from './data';
import { useStore } from './store';

type Tab = 'learn' | 'simulator' | 'scenarios' | 'quiz' | 'pearls';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('learn');
  const loadState = useStore((state) => state.loadState);

  const handleLoadScenario = (scenarioId: string) => {
    const scenario = scenarios.find((s) => s.id === scenarioId);
    if (scenario) {
      loadState(scenario.initialState);
    }
  };

  const tabs: Array<{ id: Tab; label: string; icon?: string }> = [
    { id: 'learn', label: 'Learn' },
    { id: 'simulator', label: 'Simulator' },
    { id: 'scenarios', label: 'Scenarios' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'pearls', label: 'Pearls' },
  ];

  return (
    <Layout>
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Learn Tab */}
      {activeTab === 'learn' && <LearnPage onNavigate={setActiveTab} />}

      {/* Simulator Tab */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Controls */}
            <div className="lg:col-span-1">
              <ControlPanel />
            </div>

            {/* Right Column: Displays */}
            <div className="lg:col-span-2 space-y-6">
              <DiagnosticDisplay />
              <SIADHvsCSW />
              <CorrectionMeter />
            </div>
          </div>
        </div>
      )}

      {/* Scenarios Tab */}
      {activeTab === 'scenarios' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Clinical Scenarios
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Load a scenario to practice diagnosis and management
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => {
                  handleLoadScenario(scenario.id);
                  setActiveTab('simulator');
                }}
                className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{scenario.title}</h3>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                    {scenario.level}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {scenario.presentingComplaint}
                </p>
                <div className="flex flex-wrap gap-1">
                  {scenario.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Tab */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto">
          <Quiz />
        </div>
      )}

      {/* Pearls Tab */}
      {activeTab === 'pearls' && (
        <div>
          <PearlCards />
        </div>
      )}
    </Layout>
  );
}

export default App;
