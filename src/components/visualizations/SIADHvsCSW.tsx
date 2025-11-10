import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useStore, selectSIADHAssessment, selectCSWAssessment } from '@/store';
import { motion } from 'framer-motion';

export const SIADHvsCSW = () => {
  const siadhAssessment = useStore(selectSIADHAssessment);
  const cswAssessment = useStore(selectCSWAssessment);

  const comparisonData = [
    {
      feature: 'Volume Status',
      siadh: 'Euvolemic',
      csw: 'Hypovolemic',
      key: 'KEY DIFFERENCE',
    },
    {
      feature: 'Urine Osm',
      siadh: 'High (>100)',
      csw: 'High (>100)',
    },
    {
      feature: 'Urine Na',
      siadh: 'High (>30)',
      csw: 'High (>30)',
    },
    {
      feature: 'BUN',
      siadh: 'Low (dilution)',
      csw: 'High (volume depletion)',
    },
    {
      feature: 'Uric Acid',
      siadh: 'Low',
      csw: 'Initially low, normalizes with repletion',
    },
    {
      feature: 'Response to NS',
      siadh: 'May worsen or no change',
      csw: 'Improves',
      key: 'DIAGNOSTIC CLUE',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>SIADH vs CSW Comparator</CardTitle>
        <p className="text-sm text-slate-600 mt-2">
          Both cause euvolemic-appearing hyponatremia with high urine Na and Osm.
          Volume status is the key differentiator.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Confidence Scores */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              className="p-4 rounded-lg bg-siadh-100 border-2"
              style={{
                borderColor: siadhAssessment.confidence > cswAssessment.confidence
                  ? '#3b82f6'
                  : '#e2e8f0'
              }}
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-semibold text-siadh-900 mb-1">SIADH</h4>
              <p className="text-2xl font-bold text-siadh-700">
                {(siadhAssessment.confidence * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-siadh-600 mt-1">confidence</p>
            </motion.div>

            <motion.div
              className="p-4 rounded-lg bg-csw-100 border-2"
              style={{
                borderColor: cswAssessment.confidence > siadhAssessment.confidence
                  ? '#f59e0b'
                  : '#e2e8f0'
              }}
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-semibold text-csw-900 mb-1">CSW</h4>
              <p className="text-2xl font-bold text-csw-700">
                {(cswAssessment.confidence * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-csw-600 mt-1">confidence</p>
            </motion.div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Feature</th>
                  <th className="px-4 py-3 text-left font-semibold text-siadh-700 bg-siadh-50">
                    SIADH
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-csw-700 bg-csw-50">
                    CSW
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-t border-slate-200 ${
                      row.key ? 'bg-amber-50' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{row.feature}</div>
                      {row.key && (
                        <div className="text-xs text-amber-700 font-semibold mt-1">
                          {row.key}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{row.siadh}</td>
                    <td className="px-4 py-3 text-slate-700">{row.csw}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Clinical Pearl */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Clinical Pearl</h4>
            <p className="text-sm text-blue-800">
              In the neuro-ICU, if unsure between SIADH and CSW, treat as CSW initially with volume
              repletion. If CSW, patient will improve. If actually SIADH, moderate fluid administration
              is safer than restricting fluids in true CSW.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
