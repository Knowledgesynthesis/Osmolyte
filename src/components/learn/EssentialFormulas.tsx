import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export const EssentialFormulas = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Essential Formulas
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Key calculations you need to know
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Serum Osmolality */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Serum Osmolality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <p className="font-mono text-center text-lg text-blue-900 dark:text-blue-300">
                  Serum Osm = 2 × Na + (Glucose / 18) + (BUN / 2.8)
                </p>
              </div>
              <div className="text-sm space-y-2">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Normal: 275-295 mOsm/kg</p>
                </div>
                <div>
                  <p className="text-slate-700 dark:text-slate-300 mb-1">Add if present:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    <li>Ethanol / 4.6</li>
                    <li>Methanol / 3.2</li>
                  </ul>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <p className="text-xs font-semibold text-amber-900 dark:text-amber-300">Clinical Use:</p>
                  <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
                    Classify hyponatremia as hypotonic, isotonic, or hypertonic to guide diagnosis
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Body Water */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Body Water (TBW)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                  <p className="font-mono text-sm text-blue-900 dark:text-blue-300">
                    Males: TBW = 0.6 × weight (kg)
                  </p>
                </div>
                <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded border border-pink-200 dark:border-pink-800">
                  <p className="font-mono text-sm text-pink-900 dark:text-pink-300">
                    Females: TBW = 0.5 × weight (kg)
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
                  <p className="font-mono text-sm text-purple-900 dark:text-purple-300">
                    Elderly: Subtract 0.1 from coefficient
                  </p>
                </div>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                <p><strong>Example:</strong> 70 kg male → TBW = 0.6 × 70 = 42 L</p>
                <p className="mt-1"><strong>Why it matters:</strong> Used for sodium correction calculations and free water deficit/excess</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fractional Excretion of Urate */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fractional Excretion of Urate (FE Urate)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                <p className="font-mono text-center text-sm text-purple-900 dark:text-purple-300">
                  FE Urate = [(U_urate / S_urate) / (U_Cr / S_Cr)] × 100
                </p>
              </div>
              <div className="text-sm space-y-2">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Normal: 4-11%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-700 dark:text-slate-300"><strong>SIADH:</strong> &gt;12%, <strong className="text-siadh-700 dark:text-siadh-400">stays elevated</strong></p>
                  <p className="text-slate-700 dark:text-slate-300"><strong>CSW:</strong> &gt;12%, <strong className="text-csw-700 dark:text-csw-400">normalizes after volume repletion ✓</strong></p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">Clinical Pearl:</p>
                  <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                    FE urate dynamics can confirm CSW diagnosis retrospectively - check before and after volume repletion
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sodium Correction */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sodium Correction (Simplified)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-2 border-emerald-200 dark:border-emerald-800">
                <p className="font-mono text-center text-sm text-emerald-900 dark:text-emerald-300">
                  ΔNa = (Infusate_Na - Serum_Na) / (TBW + 1)
                </p>
              </div>
              <div className="text-sm space-y-3">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Common Infusate Na Concentrations:</p>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                    <li><strong>0.9% NS:</strong> 154 mEq/L</li>
                    <li><strong>3% Hypertonic:</strong> 513 mEq/L</li>
                    <li><strong>0.45% NS:</strong> 77 mEq/L</li>
                    <li><strong>D5W:</strong> 0 mEq/L</li>
                  </ul>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 rounded">
                  <p className="text-xs font-semibold text-red-900 dark:text-red-300">Safe Correction Limits:</p>
                  <ul className="text-xs text-red-800 dark:text-red-200 mt-1 space-y-1">
                    <li><strong>Hyponatremia:</strong> ≤6-8 mEq/L per 24h</li>
                    <li><strong>Hypernatremia:</strong> ≤10 mEq/L per 24h</li>
                    <li><strong>Never exceed:</strong> 0.5 mEq/L per hour</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Free Water Deficit */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Free Water Deficit (Hypernatremia)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
                <p className="font-mono text-center text-sm text-red-900 dark:text-red-300">
                  Free Water Deficit = TBW × [(Current_Na / Desired_Na) - 1]
                </p>
              </div>
              <div className="text-sm space-y-2">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Example:</p>
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <p>• 70 kg male, Na = 160 mEq/L, target 145</p>
                    <p>• TBW = 0.6 × 70 = 42 L</p>
                    <p>• Deficit = 42 × [(160/145) - 1] = 4.3 L</p>
                  </div>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <p className="text-xs font-semibold text-amber-900 dark:text-amber-300">Remember:</p>
                  <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
                    This is educational only - actual correction must account for ongoing losses and be individualized!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Free Water Excess */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Free Water Excess (Hyponatremia)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <p className="font-mono text-center text-sm text-blue-900 dark:text-blue-300">
                  Free Water Excess = TBW × [1 - (Current_Na / Desired_Na)]
                </p>
              </div>
              <div className="text-sm space-y-2">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Example:</p>
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <p>• 70 kg male, Na = 120 mEq/L, target 135</p>
                    <p>• TBW = 0.6 × 70 = 42 L</p>
                    <p>• Excess = 42 × [1 - (120/135)] = 4.7 L</p>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">Clinical Use:</p>
                  <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                    Guides fluid restriction amount in SIADH management
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
