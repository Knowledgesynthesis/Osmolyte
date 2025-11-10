import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useStore, selectDiagnosis, selectDerivedValues } from '@/store';
import { motion } from 'framer-motion';

export const DiagnosticDisplay = () => {
  const diagnosis = useStore(selectDiagnosis);
  const derived = useStore(selectDerivedValues);

  const getVariant = () => {
    if (diagnosis.primaryDiagnosis === 'SIADH') return 'siadh';
    if (diagnosis.primaryDiagnosis === 'CSW') return 'csw';
    if (diagnosis.primaryDiagnosis.includes('DI')) return 'di';
    return 'default';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-emerald-700';
    if (confidence >= 0.6) return 'text-amber-700';
    return 'text-slate-700';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant={getVariant()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Diagnostic Assessment</CardTitle>
            <Badge variant={diagnosis.confidence >= 0.7 ? 'safe' : 'caution'}>
              {(diagnosis.confidence * 100).toFixed(0)}% confidence
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Primary Diagnosis */}
            <div>
              <h4 className="text-sm font-semibold text-slate-600 mb-2">Most Likely Diagnosis</h4>
              <p className={`text-2xl font-bold ${getConfidenceColor(diagnosis.confidence)}`}>
                {diagnosis.primaryDiagnosis.toUpperCase().replace(/-/g, ' ')}
              </p>
            </div>

            {/* Calculated Values */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-white/50 rounded-lg">
              <div>
                <p className="text-xs font-medium text-slate-600">Calculated Serum Osm</p>
                <p className="text-lg font-mono font-semibold">
                  {derived.calculatedSerumOsm.toFixed(0)} mOsm/kg
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600">Total Body Water</p>
                <p className="text-lg font-mono font-semibold">
                  {derived.totalBodyWater.toFixed(1)} L
                </p>
              </div>
            </div>

            {/* Supporting Features */}
            {diagnosis.supportingFeatures.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-emerald-700 mb-2">
                  ✓ Supporting Features
                </h4>
                <ul className="space-y-1">
                  {diagnosis.supportingFeatures.map((feature, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex items-start">
                      <span className="text-emerald-600 mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contradicting Features */}
            {diagnosis.contradictingFeatures.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-700 mb-2">
                  ✗ Contradicting Features
                </h4>
                <ul className="space-y-1">
                  {diagnosis.contradictingFeatures.map((feature, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warning Flags */}
            {diagnosis.warningFlags.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="text-sm font-semibold text-amber-900 mb-2">⚠ Warnings</h4>
                <ul className="space-y-1">
                  {diagnosis.warningFlags.map((flag, idx) => (
                    <li key={idx} className="text-sm text-amber-800">
                      • {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps */}
            {diagnosis.nextSteps.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-blue-700 mb-2">
                  → Next Steps
                </h4>
                <ol className="space-y-1">
                  {diagnosis.nextSteps.map((step, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex items-start">
                      <span className="text-blue-600 mr-2 font-semibold">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
