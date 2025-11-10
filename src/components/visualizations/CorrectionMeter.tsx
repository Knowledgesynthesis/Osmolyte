import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useStore, selectCorrectionSafety, selectIsHyponatremic } from '@/store';
import { motion } from 'framer-motion';

export const CorrectionMeter = () => {
  const safety = useStore(selectCorrectionSafety);
  const isHyponatremic = useStore(selectIsHyponatremic);
  const serumNa = useStore((state) => state.serumNa);
  const baselineNa = useStore((state) => state.baselineNa);
  const timeElapsed = useStore((state) => state.timeElapsed);

  if (!safety || timeElapsed === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Correction Safety Meter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            <p>Adjust time elapsed to monitor correction rate</p>
            <p className="text-sm mt-2">
              Safe limits: Hyponatremia ≤6-8 mEq/L per 24h • Hypernatremia ≤10 mEq/L per 24h
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSafetyBarWidth = (rate: number | undefined) => {
    if (!rate) return 0;
    const maxRate = isHyponatremic ? 12 : 15;
    return Math.min((rate / maxRate) * 100, 100);
  };

  const getSafetyBarColor = () => {
    if (safety.level === 'safe') return 'bg-emerald-500';
    if (safety.level === 'caution') return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Correction Safety Meter</CardTitle>
            <Badge variant={safety.level}>
              {safety.level.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current Values */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs font-medium text-slate-600">Baseline Na</p>
                <p className="text-xl font-mono font-semibold">
                  {baselineNa} mEq/L
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600">Current Na</p>
                <p className="text-xl font-mono font-semibold">
                  {serumNa} mEq/L
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600">Time Elapsed</p>
                <p className="text-xl font-mono font-semibold">
                  {timeElapsed} hours
                </p>
              </div>
            </div>

            {/* Correction Rate Display */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Correction Rate</span>
                <span className="text-lg font-mono font-bold">
                  {safety.correctionRate?.toFixed(1)} mEq/L per 24h
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-8 bg-slate-200 rounded-full overflow-hidden relative">
                <motion.div
                  className={`h-full ${getSafetyBarColor()}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${getSafetyBarWidth(safety.correctionRate)}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
                {/* Safe Zone Indicator */}
                <div
                  className="absolute top-0 bottom-0 border-r-2 border-dashed border-slate-400"
                  style={{ left: isHyponatremic ? '50%' : '66%' }}
                >
                  <span className="absolute -top-6 -right-8 text-xs text-slate-600 font-medium">
                    {isHyponatremic ? '6 mEq/L' : '10 mEq/L'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0</span>
                <span>{isHyponatremic ? '12 mEq/L per 24h' : '15 mEq/L per 24h'}</span>
              </div>
            </div>

            {/* Safety Message */}
            <motion.div
              className={`p-4 rounded-lg border-2 ${
                safety.level === 'safe'
                  ? 'bg-emerald-50 border-emerald-300'
                  : safety.level === 'caution'
                  ? 'bg-amber-50 border-amber-300'
                  : 'bg-red-50 border-red-300'
              }`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className={`font-semibold mb-2 ${
                safety.level === 'safe'
                  ? 'text-emerald-900'
                  : safety.level === 'caution'
                  ? 'text-amber-900'
                  : 'text-red-900'
              }`}>
                {safety.message}
              </p>
              {safety.recommendation && (
                <p className={`text-sm ${
                  safety.level === 'safe'
                    ? 'text-emerald-800'
                    : safety.level === 'caution'
                    ? 'text-amber-800'
                    : 'text-red-800'
                }`}>
                  <strong>Recommendation:</strong> {safety.recommendation}
                </p>
              )}
            </motion.div>

            {/* Educational Note */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                Why Correction Limits Matter
              </h4>
              <p className="text-sm text-blue-800">
                {isHyponatremic
                  ? 'Too-rapid correction of chronic hyponatremia can cause osmotic demyelination syndrome (ODS), leading to permanent neurologic damage including locked-in syndrome. Target ≤6 mEq/L per 24h.'
                  : 'Too-rapid lowering of hypernatremia can cause cerebral edema as water shifts into brain cells. Lower ≤10 mEq/L per 24h.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
