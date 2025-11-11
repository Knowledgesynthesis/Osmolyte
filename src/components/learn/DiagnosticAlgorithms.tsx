import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export const DiagnosticAlgorithms = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Diagnostic Algorithms
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Step-by-step diagnostic flowcharts
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Hyponatremia Algorithm */}
        <Card>
          <CardHeader>
            <CardTitle>Hyponatremia Workup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded font-semibold text-blue-900 dark:text-blue-300 text-center">
                Hyponatremia (Na &lt;135)
              </div>
              <div className="flex items-center justify-center">
                <div className="text-slate-500 dark:text-slate-400">↓</div>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded text-slate-900 dark:text-slate-100 text-center">
                Check <strong>Serum Osmolality</strong>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-slate-500 dark:text-slate-400">↓</div>
              </div>

              {/* Branches */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-xs text-center border border-amber-200 dark:border-amber-800">
                  <p className="font-semibold text-amber-900 dark:text-amber-300">Hypotonic</p>
                  <p className="text-amber-700 dark:text-amber-400">&lt;275</p>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded text-xs text-center border border-slate-200 dark:border-slate-700">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Isotonic</p>
                  <p className="text-slate-700 dark:text-slate-400">275-295</p>
                </div>
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-center border border-red-200 dark:border-red-800">
                  <p className="font-semibold text-red-900 dark:text-red-300">Hypertonic</p>
                  <p className="text-red-700 dark:text-red-400">&gt;295</p>
                </div>
              </div>

              {/* Most Common Path: Hypotonic */}
              <div className="border-l-4 border-amber-400 dark:border-amber-600 pl-3 space-y-2 mt-4">
                <p className="font-semibold text-amber-900 dark:text-amber-300">If Hypotonic (most common):</p>
                <div className="flex items-center justify-center">
                  <div className="text-amber-500 dark:text-amber-400">↓</div>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded text-center">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Check Volume Status</p>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="space-y-2">
                    <div className="p-2 bg-csw-50 dark:bg-csw-900/20 rounded text-xs text-center border border-csw-300 dark:border-csw-700">
                      <p className="font-semibold text-csw-900 dark:text-csw-300">Hypovolemic</p>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      <p className="font-semibold">→ Check Urine Na</p>
                      <p className="mt-1"><strong>&gt;30:</strong> CSW, Diuretics, Adrenal</p>
                      <p className="mt-1"><strong>&lt;30:</strong> GI losses, Burns</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2 bg-siadh-50 dark:bg-siadh-900/20 rounded text-xs text-center border border-siadh-300 dark:border-siadh-700">
                      <p className="font-semibold text-siadh-900 dark:text-siadh-300">Euvolemic</p>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      <p className="font-semibold">→ Check Urine Osm</p>
                      <p className="mt-1"><strong>&gt;100:</strong> SIADH, Hypothyroid</p>
                      <p className="mt-1"><strong>&lt;100:</strong> Polydipsia, Beer potomania</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs text-center border border-slate-300 dark:border-slate-700">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Hypervolemic</p>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      <p className="mt-1">CHF, Cirrhosis, Nephrotic syndrome</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Paths */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">If Isotonic:</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">Pseudohyponatremia (lipids, proteins)</p>
                </div>
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                  <p className="font-semibold text-red-900 dark:text-red-300">If Hypertonic:</p>
                  <p className="text-red-700 dark:text-red-400 mt-1">Hyperglycemia, Mannitol</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Polyuria Algorithm */}
        <Card>
          <CardHeader>
            <CardTitle>Polyuria Workup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded font-semibold text-red-900 dark:text-red-300 text-center">
                Polyuria (&gt;3 L/day)
              </div>
              <div className="flex items-center justify-center">
                <div className="text-slate-500 dark:text-slate-400">↓</div>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded text-slate-900 dark:text-slate-100 text-center">
                Check <strong>Urine Osmolality</strong>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-slate-500 dark:text-slate-400">↓</div>
              </div>

              {/* Branches */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-xs text-center border border-amber-200 dark:border-amber-800">
                  <p className="font-semibold text-amber-900 dark:text-amber-300">High Urine Osm</p>
                  <p className="text-amber-700 dark:text-amber-400">&gt;300</p>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">→ Osmotic diuresis</p>
                  <p className="text-slate-600 dark:text-slate-400">(Glucose, Urea, Mannitol)</p>
                </div>
                <div className="p-2 bg-di-50 dark:bg-di-900/20 rounded text-xs text-center border border-di-300 dark:border-di-700">
                  <p className="font-semibold text-di-900 dark:text-di-300">Low Urine Osm</p>
                  <p className="text-di-700 dark:text-di-400">&lt;300</p>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">→ Water diuresis</p>
                  <p className="text-slate-600 dark:text-slate-400">(Continue below)</p>
                </div>
              </div>

              {/* Water Diuresis Path */}
              <div className="border-l-4 border-di-400 dark:border-di-600 pl-3 space-y-2 mt-4">
                <p className="font-semibold text-di-900 dark:text-di-300">If Water Diuresis (Low Urine Osm):</p>
                <div className="flex items-center justify-center">
                  <div className="text-di-500 dark:text-di-400">↓</div>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded text-center">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Water Deprivation Test</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">(8-12 hours, measure Uosm)</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="space-y-2">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-xs text-center border border-emerald-300 dark:border-emerald-700">
                      <p className="font-semibold text-emerald-900 dark:text-emerald-300">Concentrates</p>
                      <p className="text-emerald-700 dark:text-emerald-400">Uosm &gt;600</p>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      <p className="font-semibold">✓ Normal</p>
                      <p className="mt-1">→ <strong>Primary Polydipsia</strong></p>
                      <p className="mt-1 text-xs">Psychiatric evaluation</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2 bg-di-50 dark:bg-di-900/20 rounded text-xs text-center border border-di-300 dark:border-di-700">
                      <p className="font-semibold text-di-900 dark:text-di-300">Doesn't Concentrate</p>
                      <p className="text-di-700 dark:text-di-400">Uosm &lt;600</p>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      <p className="font-semibold">→ Give DDAVP</p>
                      <p className="mt-1">Measure Uosm 2-4h later</p>
                    </div>
                  </div>
                </div>

                {/* DDAVP Response */}
                <div className="p-3 bg-di-50 dark:bg-di-900/20 rounded border border-di-300 dark:border-di-700 mt-3">
                  <p className="font-semibold text-di-900 dark:text-di-300 mb-2">After DDAVP:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="font-semibold text-di-900 dark:text-di-300">Uosm increases &gt;50%</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">→ <strong>Central DI</strong></p>
                      <p className="text-slate-600 dark:text-slate-400">• MRI brain</p>
                      <p className="text-slate-600 dark:text-slate-400">• Start DDAVP</p>
                    </div>
                    <div>
                      <p className="font-semibold text-di-900 dark:text-di-300">Uosm no change</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">→ <strong>Nephrogenic DI</strong></p>
                      <p className="text-slate-600 dark:text-slate-400">• Check lithium, Ca, K</p>
                      <p className="text-slate-600 dark:text-slate-400">• Amiloride/thiazides</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clinical Pearls */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-600 rounded">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">Hyponatremia Pearl</p>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Volume status is the key branch point: hypovolemic → CSW likely, euvolemic → SIADH likely, hypervolemic → CHF/cirrhosis
          </p>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 rounded">
          <p className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">Polyuria Pearl</p>
          <p className="text-sm text-red-800 dark:text-red-200">
            Always rule out osmotic diuresis (high urine osm) before pursuing DI workup. Check glucose, BUN, and medications
          </p>
        </div>
      </div>
    </div>
  );
};
