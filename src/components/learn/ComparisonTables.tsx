import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export const ComparisonTables = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Comparison Tables
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Side-by-side comparisons to master the differentials
        </p>
      </div>

      {/* Hyponatremia Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Hyponatremia Pathway: SIADH vs CSW vs Beer Potomania</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            The critical differential in hypotonic hyponatremia
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Feature</th>
                  <th className="px-4 py-3 text-left font-semibold text-siadh-700 dark:text-siadh-400 bg-siadh-50 dark:bg-siadh-900/20">
                    SIADH
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-csw-700 dark:text-csw-400 bg-csw-50 dark:bg-csw-900/20">
                    CSW
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Beer Potomania
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-amber-50 dark:bg-amber-900/10">
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                    Volume Status ⭐
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 bg-siadh-50/50 dark:bg-siadh-900/10">
                    <strong className="text-siadh-700 dark:text-siadh-400">Euvolemic</strong>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 bg-csw-50/50 dark:bg-csw-900/10">
                    <strong className="text-csw-700 dark:text-csw-400">Hypovolemic</strong>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    Euvolemic
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Serum Na</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Low</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Low</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Low</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Urine Osm</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">&gt;100</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">&gt;100</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    <strong className="text-red-700 dark:text-red-400">&lt;100 ⚠️</strong> (dilute!)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Urine Na</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">&gt;30</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">&gt;30</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">&lt;30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                    BUN ⭐
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    <strong className="text-siadh-700 dark:text-siadh-400">LOW</strong> (dilution)
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    <strong className="text-csw-700 dark:text-csw-400">HIGH</strong> (volume loss)
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">LOW</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Uric Acid</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Low</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Low initially</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Low</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Hematocrit</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Normal/low</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    <strong className="text-csw-700 dark:text-csw-400">HIGH</strong> (hemoconcentration)
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Normal</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">FE Urate</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    High, <strong>stays elevated</strong>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    High, <strong className="text-csw-700 dark:text-csw-400">normalizes after repletion ✓</strong>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">—</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">CNS Injury</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Variable</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    <strong className="text-csw-700 dark:text-csw-400">Almost always</strong>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">No</td>
                </tr>
                <tr className="bg-amber-50 dark:bg-amber-900/10">
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                    Response to NS ⭐
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    <strong className="text-siadh-700 dark:text-siadh-400">Worsens/no change</strong>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    <strong className="text-csw-700 dark:text-csw-400">IMPROVES ✓</strong>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    <strong className="text-red-700 dark:text-red-400">Rapid auto-correction risk!</strong>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">Management</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    <strong className="text-siadh-700 dark:text-siadh-400">Fluid restriction</strong>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    <strong className="text-csw-700 dark:text-csw-400">Volume repletion</strong>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    Normal diet slowly, monitor Na q2-4h
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-600 rounded">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">Clinical Pearl</p>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              In the neuro-ICU, if unsure between SIADH and CSW, treat as CSW initially with volume repletion. If CSW, the patient improves. If actually SIADH, moderate fluid is safer than restricting fluids in true CSW.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Polyuria/Hypernatremia Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Polyuria/Hypernatremia Pathway: Central DI vs Nephrogenic DI vs Primary Polydipsia</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Distinguishing causes of polyuria and hypernatremia
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Feature</th>
                  <th className="px-4 py-3 text-left font-semibold text-di-700 dark:text-di-400 bg-di-50 dark:bg-di-900/20">
                    Central DI
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-di-700 dark:text-di-400 bg-di-50 dark:bg-di-900/20">
                    Nephrogenic DI
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Primary Polydipsia
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Serum Na</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 bg-di-50/50 dark:bg-di-900/10">HIGH</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 bg-di-50/50 dark:bg-di-900/10">HIGH</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    <strong className="text-blue-700 dark:text-blue-400">Low-normal</strong> (diluted from excess water)
                  </td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Polyuria</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Yes (&gt;3L)</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Yes (&gt;3L)</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Yes (&gt;3L)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Baseline Urine Osm</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Low (&lt;300)</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Low (&lt;300)</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Low (&lt;300)</td>
                </tr>
                <tr className="bg-amber-50 dark:bg-amber-900/10">
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                    After Water Deprivation ⭐
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 bg-di-50/50 dark:bg-di-900/10">
                    <strong className="text-di-700 dark:text-di-400">Stays low</strong> (no ADH)
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 bg-di-50/50 dark:bg-di-900/10">
                    <strong className="text-di-700 dark:text-di-400">Stays low</strong> (ADH ineffective)
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    <strong className="text-emerald-700 dark:text-emerald-400">Concentrates normally ✓</strong> (&gt;600)
                  </td>
                </tr>
                <tr className="bg-amber-50 dark:bg-amber-900/10">
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                    After DDAVP ⭐
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 bg-di-50/50 dark:bg-di-900/10">
                    <strong className="text-di-700 dark:text-di-400">Rises &gt;50% ✓</strong>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 bg-di-50/50 dark:bg-di-900/10">
                    <strong className="text-di-700 dark:text-di-400">No change ⚠️</strong>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    No change (already concentrated)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Common Causes</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    Neurosurgery, TBI, pituitary tumor
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    Lithium, hypercalcemia, hypokalemia
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    Psychiatric, compulsive behavior
                  </td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">Management</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    <strong className="text-di-700 dark:text-di-400">DDAVP</strong>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    <strong className="text-di-700 dark:text-di-400">Amiloride, thiazides</strong>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    Behavioral, psych management
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 rounded">
            <p className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">Critical Pitfall</p>
            <p className="text-sm text-red-800 dark:text-red-200">
              Never give DDAVP to a patient with primary polydipsia who continues drinking water - this will cause severe, life-threatening hyponatremia!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
