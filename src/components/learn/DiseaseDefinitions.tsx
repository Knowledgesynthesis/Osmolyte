import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export const DiseaseDefinitions = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Disease Definitions
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Clear definitions of each condition with clinical features
        </p>
      </div>

      <div className="space-y-6">
        {/* SIADH */}
        <Card variant="siadh">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-siadh-900 dark:text-siadh-300">
                SIADH (Syndrome of Inappropriate ADH)
              </CardTitle>
              <span className="px-3 py-1 bg-siadh-200 dark:bg-siadh-800 text-siadh-900 dark:text-siadh-200 text-xs font-semibold rounded-full">
                Hyponatremia
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-siadh-900 dark:text-siadh-300 mb-1">Definition</p>
                  <p className="text-slate-700 dark:text-slate-300">
                    Excess ADH secretion despite normal or low serum osmolality
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-siadh-900 dark:text-siadh-300 mb-1">Pathophysiology</p>
                  <p className="text-slate-700 dark:text-slate-300">
                    Water retention → dilution → euvolemic hyponatremia
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-siadh-900 dark:text-siadh-300 mb-1">Clinical Presentation</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    <li><strong className="text-slate-800 dark:text-slate-300">Euvolemic</strong> (key finding!)</li>
                    <li>Normal JVP, no edema</li>
                    <li>Confusion, headache, nausea</li>
                    <li>Seizures if severe (&lt;120 mEq/L)</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-siadh-900 dark:text-siadh-300 mb-1">Labs</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    <li>Serum Na: <strong>LOW</strong> (&lt;135)</li>
                    <li>Serum Osm: Low (&lt;275)</li>
                    <li>Urine Osm: <strong>HIGH</strong> (&gt;100) ⚠️</li>
                    <li>Urine Na: <strong>HIGH</strong> (&gt;30) ⚠️</li>
                    <li>BUN: <strong>LOW</strong> (dilution)</li>
                    <li>Uric Acid: <strong>LOW</strong> (↑FE urate)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-siadh-900 dark:text-siadh-300 mb-1">Mnemonic</p>
                  <p className="italic text-slate-700 dark:text-slate-300 font-medium">
                    "Soaked Inside" - Water retained, euvolemic appearance
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-siadh-900 dark:text-siadh-300 mb-1">Management</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    <li>Fluid restriction (800-1000 mL/day)</li>
                    <li>Treat underlying cause</li>
                    <li>Salt tablets</li>
                    <li>Tolvaptan (vaptan) if refractory</li>
                    <li>Hypertonic saline if symptomatic</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CSW */}
        <Card variant="csw">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-csw-900 dark:text-csw-300">
                CSW (Cerebral Salt Wasting)
              </CardTitle>
              <span className="px-3 py-1 bg-csw-200 dark:bg-csw-800 text-csw-900 dark:text-csw-200 text-xs font-semibold rounded-full">
                Hyponatremia
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-csw-900 dark:text-csw-300 mb-1">Definition</p>
                  <p className="text-slate-700 dark:text-slate-300">
                    Renal sodium wasting after CNS injury leading to hypovolemia
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-csw-900 dark:text-csw-300 mb-1">Pathophysiology</p>
                  <p className="text-slate-700 dark:text-slate-300">
                    Natriuresis → volume depletion → hypovolemic hyponatremia
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-csw-900 dark:text-csw-300 mb-1">Clinical Presentation</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    <li><strong className="text-slate-800 dark:text-slate-300">HYPOVOLEMIC</strong> (KEY!)</li>
                    <li>Recent SAH, TBI, neurosurgery</li>
                    <li>Dry mucous membranes</li>
                    <li>Orthostatic hypotension</li>
                    <li>Decreased skin turgor</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-csw-900 dark:text-csw-300 mb-1">Labs</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    <li>Serum Na: <strong>LOW</strong> (&lt;135)</li>
                    <li>Urine Osm: <strong>HIGH</strong> (&gt;100)</li>
                    <li>Urine Na: <strong>HIGH</strong> (&gt;30)</li>
                    <li>BUN: <strong>HIGH</strong> (volume depletion) ⚠️</li>
                    <li>Hematocrit: <strong>HIGH</strong> (hemoconcentration) ⚠️</li>
                    <li>FE urate: High → normalizes after repletion</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-csw-900 dark:text-csw-300 mb-1">Mnemonic</p>
                  <p className="italic text-slate-700 dark:text-slate-300 font-medium">
                    "CNS Salt Wasting needs Salt + Water"
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-csw-900 dark:text-csw-300 mb-1">Management</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    <li><strong>Volume repletion</strong> (NS or 3% saline)</li>
                    <li>Salt tablets</li>
                    <li>Fludrocortisone (adjunct)</li>
                    <li>NEVER fluid restrict (will worsen!)</li>
                    <li>Monitor for vasospasm (SAH patients)</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Central DI */}
        <Card variant="di">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-di-900 dark:text-di-300">
                Central Diabetes Insipidus
              </CardTitle>
              <span className="px-3 py-1 bg-di-200 dark:bg-di-800 text-di-900 dark:text-di-200 text-xs font-semibold rounded-full">
                Hypernatremia
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-di-900 dark:text-di-300 mb-1">Definition</p>
                  <p className="text-slate-700 dark:text-slate-300">
                    Impaired ADH secretion from hypothalamus/pituitary
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-di-900 dark:text-di-300 mb-1">Pathophysiology</p>
                  <p className="text-slate-700 dark:text-slate-300">
                    No ADH → can't concentrate urine → polyuria + hypernatremia
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-di-900 dark:text-di-300 mb-1">Clinical Presentation</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    <li><strong>Polyuria</strong> (&gt;3 L/day)</li>
                    <li>Excessive thirst (polydipsia)</li>
                    <li>Recent neurosurgery, TBI, or tumor</li>
                    <li>Dehydration if no water access</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-di-900 dark:text-di-300 mb-1">Labs</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    <li>Serum Na: <strong>HIGH</strong> (&gt;145)</li>
                    <li>Serum Osm: High (&gt;295)</li>
                    <li>Urine Osm: <strong>LOW</strong> (&lt;300) ⚠️</li>
                    <li>Urine volume: &gt;3 L/day</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-di-900 dark:text-di-300 mb-1">Diagnostic Test</p>
                  <p className="text-slate-700 dark:text-slate-300 mb-2">Water deprivation + DDAVP challenge:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    <li>Urine fails to concentrate with deprivation</li>
                    <li><strong>Responds to DDAVP</strong> (Uosm ↑ &gt;50%) ✓</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-di-900 dark:text-di-300 mb-1">Management</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    <li>Desmopressin (DDAVP) replacement</li>
                    <li>Ensure free water access</li>
                    <li>MRI brain for structural causes</li>
                    <li>Monitor sodium closely</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nephrogenic DI */}
        <Card variant="di">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-di-900 dark:text-di-300">
                Nephrogenic Diabetes Insipidus
              </CardTitle>
              <span className="px-3 py-1 bg-di-200 dark:bg-di-800 text-di-900 dark:text-di-200 text-xs font-semibold rounded-full">
                Hypernatremia
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-di-900 dark:text-di-300 mb-1">Definition</p>
                  <p className="text-slate-700 dark:text-slate-300">
                    Kidney resistance to ADH (V2 receptor or aquaporin defect)
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-di-900 dark:text-di-300 mb-1">Pathophysiology</p>
                  <p className="text-slate-700 dark:text-slate-300">
                    ADH present but kidneys don't respond → polyuria + hypernatremia
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-di-900 dark:text-di-300 mb-1">Clinical Presentation</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    <li><strong>Polyuria</strong> (&gt;3 L/day)</li>
                    <li>Lithium use (most common)</li>
                    <li>Hypercalcemia or hypokalemia</li>
                    <li>Pregnancy (transient)</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-di-900 dark:text-di-300 mb-1">Labs</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    <li>Serum Na: <strong>HIGH</strong> (&gt;145)</li>
                    <li>Serum Osm: High (&gt;295)</li>
                    <li>Urine Osm: <strong>LOW</strong> (&lt;300)</li>
                    <li>Check Ca²⁺ and K⁺</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-di-900 dark:text-di-300 mb-1">Diagnostic Test</p>
                  <p className="text-slate-700 dark:text-slate-300 mb-2">Water deprivation + DDAVP challenge:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    <li>Urine fails to concentrate with deprivation</li>
                    <li><strong>NO response to DDAVP</strong> (Uosm unchanged) ⚠️</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-di-900 dark:text-di-300 mb-1">Management</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    <li>Treat cause (stop lithium, correct Ca/K)</li>
                    <li>Amiloride (if lithium-induced)</li>
                    <li>Thiazide + low-Na diet (paradoxical effect)</li>
                    <li>NSAIDs (↓GFR, use with caution)</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
