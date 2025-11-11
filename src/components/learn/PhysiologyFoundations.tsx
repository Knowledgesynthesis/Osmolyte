import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export const PhysiologyFoundations = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Physiology Foundations
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Understanding the system is essential before diagnosing the disease
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ADH Axis */}
        <Card>
          <CardHeader>
            <CardTitle>ADH (Vasopressin) Axis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="font-mono text-sm text-center text-blue-900 dark:text-blue-300">
                  Hypothalamus → Posterior Pituitary → Bloodstream → Kidney V2 Receptors → Aquaporin-2 → Water Reabsorption
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong className="text-blue-700 dark:text-blue-400">What triggers ADH release?</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  <li>High serum osmolality (&gt;295 mOsm/kg)</li>
                  <li>Hypovolemia (detected by baroreceptors)</li>
                  <li>Nausea, pain, stress</li>
                </ul>
                <p className="text-slate-700 dark:text-slate-300 mt-3">
                  <strong className="text-blue-700 dark:text-blue-400">What does ADH do?</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Binds V2 receptors in collecting duct</li>
                  <li>Increases aquaporin-2 channels</li>
                  <li>Allows water reabsorption from urine</li>
                  <li>Concentrates urine, dilutes blood</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Osmolality vs Tonicity */}
        <Card>
          <CardHeader>
            <CardTitle>Osmolality vs Tonicity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Osmolality</p>
                <p className="text-slate-600 dark:text-slate-400">
                  Total concentration of ALL solutes (including urea, glucose, ethanol). Measured in lab.
                </p>
                <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs">
                  Osm = 2×Na + Glucose/18 + BUN/2.8
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Normal: 275-295 mOsm/kg</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Tonicity</p>
                <p className="text-slate-600 dark:text-slate-400">
                  Concentration of <strong>effective</strong> osmoles (Na, glucose). Determines water movement across membranes.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                  <strong>Key:</strong> Urea crosses membranes freely → doesn't affect tonicity
                </p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-600 rounded">
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-300">Why it matters:</p>
                <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
                  High osmolality with normal tonicity (e.g., uremia) doesn't cause hyponatremia!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volume vs Osmolality */}
        <Card>
          <CardHeader>
            <CardTitle>Volume vs Osmolality: Two Systems</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Volume Regulation (Sodium)</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Controlled by RAAS (renin-angiotensin-aldosterone)</li>
                  <li>Baroreceptors detect blood pressure/volume</li>
                  <li>Aldosterone → Na reabsorption → water follows</li>
                  <li>Clinical: JVP, edema, orthostatics</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Osmolality Regulation (Water)</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Controlled by ADH and thirst</li>
                  <li>Osmoreceptors detect concentration</li>
                  <li>ADH → water reabsorption → dilutes blood</li>
                  <li>Clinical: mental status, sodium level</li>
                </ul>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">They interact:</p>
                <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                  Severe volume depletion overrides osmolality control → ADH release even if osmolality is low (non-osmotic ADH release)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kidney Water Handling */}
        <Card>
          <CardHeader>
            <CardTitle>Kidney Water Handling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Normal Process</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Proximal tubule: 65% water reabsorbed (isotonic)</li>
                  <li>Loop of Henle: Creates medullary gradient</li>
                  <li>Distal tubule: Fine-tunes Na reabsorption</li>
                  <li>Collecting duct: ADH controls water reabsorption</li>
                </ol>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded">
                <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Key Concepts:</p>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <li>
                    <strong className="text-slate-800 dark:text-slate-300">Medullary gradient:</strong> High osmolality in kidney medulla (up to 1200 mOsm/kg) allows urine concentration
                  </li>
                  <li>
                    <strong className="text-slate-800 dark:text-slate-300">Aquaporin-2:</strong> Water channel inserted when ADH present → water flows from tubule to blood
                  </li>
                  <li>
                    <strong className="text-slate-800 dark:text-slate-300">No ADH:</strong> Collecting duct impermeable → dilute urine (50-100 mOsm/kg)
                  </li>
                  <li>
                    <strong className="text-slate-800 dark:text-slate-300">Max ADH:</strong> Urine concentrates to ~1200 mOsm/kg
                  </li>
                </ul>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-400 dark:border-purple-600 rounded">
                <p className="text-xs font-semibold text-purple-900 dark:text-purple-300">Free Water Clearance</p>
                <p className="text-xs text-purple-800 dark:text-purple-200 mt-1">
                  The volume of water the kidney can excrete without electrolytes. Positive when diluting urine (no ADH), negative when concentrating (ADH present).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
