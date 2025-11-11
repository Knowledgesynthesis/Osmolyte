import { useState } from 'react';
import { PhysiologyFoundations } from './PhysiologyFoundations';
import { DiseaseDefinitions } from './DiseaseDefinitions';
import { ComparisonTables } from './ComparisonTables';
import { DiagnosticAlgorithms } from './DiagnosticAlgorithms';
import { EssentialFormulas } from './EssentialFormulas';

type Section = 'physiology' | 'definitions' | 'comparisons' | 'algorithms' | 'formulas';

interface LearnPageProps {
  onNavigate?: (tab: 'simulator' | 'quiz') => void;
}

export const LearnPage = ({ onNavigate }: LearnPageProps) => {
  const [activeSection, setActiveSection] = useState<Section>('physiology');

  const sections: { id: Section; label: string; description: string }[] = [
    { id: 'physiology', label: 'Physiology', description: 'ADH axis & fundamentals' },
    { id: 'definitions', label: 'Definitions', description: 'SIADH, CSW, DI explained' },
    { id: 'comparisons', label: 'Comparisons', description: 'Side-by-side tables' },
    { id: 'algorithms', label: 'Algorithms', description: 'Diagnostic flowcharts' },
    { id: 'formulas', label: 'Formulas', description: 'Essential calculations' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          Learn the Fundamentals
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Master sodium and water disorders step by step. Understand the physiology before jumping into clinical scenarios.
        </p>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex-shrink-0 px-6 py-3 rounded-lg transition-all ${
              activeSection === section.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="font-semibold">{section.label}</div>
            <div className={`text-xs mt-0.5 ${
              activeSection === section.id ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
            }`}>
              {section.description}
            </div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeSection === 'physiology' && <PhysiologyFoundations />}
        {activeSection === 'definitions' && <DiseaseDefinitions />}
        {activeSection === 'comparisons' && <ComparisonTables />}
        {activeSection === 'algorithms' && <DiagnosticAlgorithms />}
        {activeSection === 'formulas' && <EssentialFormulas />}
      </div>

      {/* Call to Action */}
      <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Ready to Practice?
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Now that you understand the fundamentals, test your knowledge with interactive simulators and clinical scenarios.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate?.('simulator')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
          >
            Go to Simulator
          </button>
          <button
            onClick={() => onNavigate?.('quiz')}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium transition-colors"
          >
            Take a Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
