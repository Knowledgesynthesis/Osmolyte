import { useState } from 'react';
import { Layout } from './components/core/Layout';
import { ControlPanel } from './components/core/ControlPanel';
import { DiagnosticDisplay } from './components/visualizations/DiagnosticDisplay';
import { SIADHvsCSW } from './components/visualizations/SIADHvsCSW';
import { CorrectionMeter } from './components/visualizations/CorrectionMeter';
import { Quiz } from './components/education/Quiz';
import { PearlCards } from './components/education/PearlCards';
import { Button } from './components/ui/Button';
import { scenarios } from './data';
import { useStore } from './store';

type Tab = 'simulator' | 'quiz' | 'pearls';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('simulator');
  const loadState = useStore((state) => state.loadState);

  const handleLoadScenario = (scenarioId: string) => {
    const scenario = scenarios.find((s) => s.id === scenarioId);
    if (scenario) {
      loadState(scenario.initialState);
    }
  };

  return (
    <Layout>
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {(['simulator', 'quiz', 'pearls'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Simulator Tab */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          {/* Scenario Selector */}
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Load Clinical Scenario
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {scenarios.map((scenario) => (
                <Button
                  key={scenario.id}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleLoadScenario(scenario.id)}
                  className="text-left justify-start"
                >
                  <div>
                    <div className="font-semibold text-sm">{scenario.title}</div>
                    <div className="text-xs text-slate-500">{scenario.level}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

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
