import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store';
import { VolumeStatus } from '@/types';

export const ControlPanel = () => {
  const serumNa = useStore((state) => state.serumNa);
  const setSerumNa = useStore((state) => state.setSerumNa);

  const glucose = useStore((state) => state.glucose);
  const setGlucose = useStore((state) => state.setGlucose);

  const BUN = useStore((state) => state.BUN);
  const setBUN = useStore((state) => state.setBUN);

  const urineOsm = useStore((state) => state.urineOsm);
  const setUrineOsm = useStore((state) => state.setUrineOsm);

  const urineNa = useStore((state) => state.urineNa);
  const setUrineNa = useStore((state) => state.setUrineNa);

  const volumeStatus = useStore((state) => state.volumeStatus);
  const setVolumeStatus = useStore((state) => state.setVolumeStatus);

  const hasCNSInjury = useStore((state) => state.hasCNSInjury);
  const setHasCNSInjury = useStore((state) => state.setHasCNSInjury);

  const lithiumExposure = useStore((state) => state.lithiumExposure);
  const setLithiumExposure = useStore((state) => state.setLithiumExposure);

  const serumUricAcid = useStore((state) => state.serumUricAcid);
  const setSerumUricAcid = useStore((state) => state.setSerumUricAcid);

  const resetState = useStore((state) => state.resetState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinical Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Serum Labs */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Serum Labs
            </h4>
            <Slider
              label="Serum Sodium"
              value={serumNa}
              onValueChange={setSerumNa}
              min={110}
              max={165}
              step={1}
              unit="mEq/L"
            />
            <Slider
              label="Glucose"
              value={glucose}
              onValueChange={setGlucose}
              min={60}
              max={400}
              step={5}
              unit="mg/dL"
            />
            <Slider
              label="BUN"
              value={BUN}
              onValueChange={setBUN}
              min={3}
              max={60}
              step={1}
              unit="mg/dL"
            />
            <Slider
              label="Serum Uric Acid"
              value={serumUricAcid}
              onValueChange={setSerumUricAcid}
              min={1}
              max={12}
              step={0.1}
              unit="mg/dL"
            />
          </div>

          {/* Urine Labs */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Urine Labs
            </h4>
            <Slider
              label="Urine Osmolality"
              value={urineOsm}
              onValueChange={setUrineOsm}
              min={50}
              max={1200}
              step={10}
              unit="mOsm/kg"
            />
            <Slider
              label="Urine Sodium"
              value={urineNa}
              onValueChange={setUrineNa}
              min={5}
              max={150}
              step={5}
              unit="mEq/L"
            />
          </div>

          {/* Volume Status */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Volume Status
            </h4>
            <div className="flex gap-2">
              {(['hypovolemic', 'euvolemic', 'hypervolemic'] as VolumeStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setVolumeStatus(status)}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    volumeStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Clinical Context */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Clinical Context
            </h4>
            <Toggle
              label="CNS Injury (SAH, TBI, Surgery)"
              checked={hasCNSInjury}
              onCheckedChange={setHasCNSInjury}
            />
            <Toggle
              label="Lithium Exposure"
              checked={lithiumExposure}
              onCheckedChange={setLithiumExposure}
            />
          </div>

          {/* Reset Button */}
          <Button
            variant="secondary"
            onClick={resetState}
            className="w-full"
          >
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
