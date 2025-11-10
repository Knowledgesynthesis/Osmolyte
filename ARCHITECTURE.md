# Osmolyte Architecture Blueprint

## Vision
An educational dashboard that transforms complex sodium/water disorder diagnosis into an intuitive, interactive learning experience. Every interaction teaches, every visualization clarifies, every decision point builds clinical reasoning.

---

## File Structure

```
osmolyte/
├── src/
│   ├── components/
│   │   ├── core/
│   │   │   ├── Layout.tsx                 # Main app shell with navigation
│   │   │   ├── ControlPanel.tsx           # Interactive parameter controls
│   │   │   └── ExplainerAside.tsx         # Context-sensitive help panel
│   │   ├── visualizations/
│   │   │   ├── OsmoregPlot.tsx            # ADH/thirst curve visualization
│   │   │   ├── HyponatremiaFlow.tsx       # Diagnostic flowchart
│   │   │   ├── SIADHvsCSW.tsx             # Side-by-side comparator
│   │   │   ├── DISimulator.tsx            # DI workup simulator
│   │   │   └── CorrectionMeter.tsx        # Safety gauge for correction rates
│   │   ├── scenarios/
│   │   │   ├── CasePlayer.tsx             # Scenario timeline player
│   │   │   └── CaseCard.tsx               # Individual case wrapper
│   │   ├── education/
│   │   │   ├── Quiz.tsx                   # Assessment component
│   │   │   ├── PearlCards.tsx             # Mnemonic flip cards
│   │   │   └── DrugDashboard.tsx          # Medication reference
│   │   └── ui/
│   │       ├── Button.tsx                 # Accessible button
│   │       ├── Card.tsx                   # Content card
│   │       ├── Slider.tsx                 # Range input
│   │       ├── Toggle.tsx                 # Boolean control
│   │       └── Tooltip.tsx                # Contextual help
│   ├── store/
│   │   ├── index.ts                       # Zustand store setup
│   │   ├── waterBalanceSlice.ts           # Core state management
│   │   └── selectors.ts                   # Derived state logic
│   ├── lib/
│   │   ├── calculations.ts                # Medical equations
│   │   ├── diagnosticLogic.ts             # Classification algorithms
│   │   ├── scenarioEngine.ts              # Case generation
│   │   └── constants.ts                   # Medical reference data
│   ├── types/
│   │   ├── waterBalance.ts                # Core domain types
│   │   ├── scenarios.ts                   # Case data types
│   │   └── diagnostics.ts                 # Diagnostic result types
│   ├── data/
│   │   ├── scenarios.ts                   # 6+ clinical cases
│   │   ├── drugs.ts                       # Medication database
│   │   ├── pearls.ts                      # Mnemonics and pearls
│   │   └── quizzes.ts                     # Assessment questions
│   ├── App.tsx                            # Root component
│   ├── main.tsx                           # Entry point
│   └── index.css                          # Tailwind imports
├── public/
│   └── medical-disclaimer.txt             # Safety notice
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## Core Type System

### WaterBalanceState
The heart of the application - represents the complete clinical picture:

```typescript
interface WaterBalanceState {
  // Serum parameters
  serumNa: number;           // mEq/L
  serumOsm: number;          // mOsm/kg (or calculated)
  glucose: number;           // mg/dL
  BUN: number;               // mg/dL

  // Urine parameters
  urineOsm: number;          // mOsm/kg
  urineNa: number;           // mEq/L
  urineVolume: number;       // L/day

  // Clinical assessment
  volumeStatus: 'hypovolemic' | 'euvolemic' | 'hypervolemic';

  // Advanced markers
  FEurate: number;           // Fractional excretion of urate
  hematocrit: number;        // %
  serumUricAcid: number;     // mg/dL

  // Electrolytes
  calcium: number;           // mg/dL
  potassium: number;         // mEq/L

  // Clinical context flags
  hasCNSInjury: boolean;
  lithiumExposure: boolean;
  pregnancy: boolean;
  recentSurgery: boolean;

  // Interventions
  fluidsGiven: FluidIntervention[];
  medicationsGiven: Medication[];
  soluteIntake: number;      // mOsm/day

  // Time tracking
  timeElapsed: number;       // hours
}

interface FluidIntervention {
  type: 'isotonic' | 'hypertonic' | 'hypotonic';
  volume: number;            // mL
  timepoint: number;         // hours
}
```

### Diagnostic Output
```typescript
interface DiagnosticResult {
  primaryDiagnosis: 'SIADH' | 'CSW' | 'central-DI' | 'nephrogenic-DI' | 'primary-polydipsia' | 'mixed' | 'unclear';
  confidence: number;        // 0-1
  supportingFeatures: string[];
  contradictingFeatures: string[];
  nextSteps: string[];
  warningFlags: string[];
}
```

---

## State Flow & Architecture

### Zustand Store Pattern
```
User Input → Action → Store Update → Selectors → Derived State → UI Update
                                   ↓
                            Side Effects (calculations, validations)
```

### Key Selectors (Pure Functions)
1. **calculateSerumOsm**: `2·Na + glucose/18 + BUN/2.8`
2. **classifyHyponatremia**: Hypo/iso/hypertonic → volume status → urine tests
3. **diagnoseSIADH**: Euvolemic + Uosm>100 + Una>30 + low BUN/uric acid
4. **diagnoseCSW**: Hypovolemic + high Una + high Uosm + CNS injury + elevated FEurate
5. **simulateDDavpResponse**: Central (Uosm↑↑) vs Nephrogenic (Uosm unchanged)
6. **predictNaCorrection**: Based on fluid type and volume
7. **assessCorrectionSafety**: ΔNa rate vs time thresholds

---

## Component Communication

### Top-level Flow
```
App
├── Layout
│   ├── Navigation (module selector)
│   └── ExplainerAside (context help)
├── Module Router
│   ├── PhysiologyModule
│   │   └── OsmoregPlot
│   ├── HyponatremiaModule
│   │   ├── HyponatremiaFlow
│   │   └── SIADHvsCSW
│   ├── DIModule
│   │   └── DISimulator
│   ├── ScenarioModule
│   │   └── CasePlayer
│   └── AssessmentModule
│       ├── Quiz
│       ├── PearlCards
│       └── DrugDashboard
└── ControlPanel (global state controls)
```

### Data Flow Example: SIADH vs CSW Comparator
```
User adjusts volume status → Store updates → Selectors recalculate:
  - FEurate dynamics
  - Expected Una/Uosm
  - Hematocrit changes
  - Diagnostic likelihood
→ SIADHvsCSW component re-renders with:
  - Updated lab values
  - Color-coded differences
  - Clinical reasoning tooltips
→ ExplainerAside shows "What changed and why"
```

---

## Calculation Engine

### Core Equations (in lib/calculations.ts)
```typescript
// Serum osmolality
export const calculateSerumOsm = (na: number, glucose: number, bun: number): number => {
  return 2 * na + glucose / 18 + bun / 2.8;
};

// Fractional excretion of urate (FEurate)
export const calculateFEurate = (
  urineUrate: number,
  serumUrate: number,
  urineCr: number,
  serumCr: number
): number => {
  return ((urineUrate / serumUrate) / (urineCr / serumCr)) * 100;
};

// Sodium correction prediction (simplified educational model)
export const predictNaChange = (
  currentNa: number,
  fluidNa: number,
  fluidVolume: number,
  bodyWeight: number
): number => {
  const TBW = bodyWeight * 0.6; // Total body water
  return (fluidNa - currentNa) / (TBW + fluidVolume);
};

// Water deprivation test simulation
export const simulateWaterDeprivation = (
  baselineUosm: number,
  hasADH: boolean,
  respondsToADH: boolean
): {
  postDeprivationUosm: number;
  postDDAVPUosm: number;
  interpretation: string;
} => {
  // Central DI: no ADH, responds to DDAVP
  // Nephrogenic DI: may have ADH, doesn't respond to DDAVP
  // Normal/polydipsia: concentrates with deprivation

  let postDeprivationUosm: number;
  let postDDAVPUosm: number;

  if (!hasADH) {
    // Central DI
    postDeprivationUosm = Math.min(baselineUosm * 1.2, 300);
    postDDAVPUosm = respondsToADH ? postDeprivationUosm * 2 : postDeprivationUosm * 1.1;
  } else if (!respondsToADH) {
    // Nephrogenic DI
    postDeprivationUosm = Math.min(baselineUosm * 1.3, 350);
    postDDAVPUosm = postDeprivationUosm * 1.1;
  } else {
    // Normal or partial DI
    postDeprivationUosm = Math.min(baselineUosm * 2.5, 900);
    postDDAVPUosm = postDeprivationUosm * 1.05;
  }

  const interpretation =
    postDDAVPUosm > postDeprivationUosm * 1.5 ? 'Central DI' :
    postDeprivationUosm < 300 && postDDAVPUosm < 300 ? 'Nephrogenic DI' :
    'Normal or primary polydipsia';

  return { postDeprivationUosm, postDDAVPUosm, interpretation };
};
```

---

## Diagnostic Logic (lib/diagnosticLogic.ts)

### SIADH Criteria
```typescript
export const assessSIADH = (state: WaterBalanceState): DiagnosticResult => {
  const supportingFeatures: string[] = [];
  const contradictingFeatures: string[] = [];

  // Core criteria
  if (state.serumNa < 135) supportingFeatures.push('Hypotonic hyponatremia');
  if (state.volumeStatus === 'euvolemic') supportingFeatures.push('Euvolemic on exam');
  if (state.urineOsm > 100) supportingFeatures.push('Inappropriately concentrated urine');
  if (state.urineNa > 30) supportingFeatures.push('High urinary sodium');
  if (state.BUN < 10) supportingFeatures.push('Low BUN (dilution)');
  if (state.serumUricAcid < 4) supportingFeatures.push('Low uric acid (high FEurate)');

  // Contradicting
  if (state.volumeStatus === 'hypovolemic') contradictingFeatures.push('Clinical hypovolemia present');
  if (state.hasCNSInjury) contradictingFeatures.push('CNS injury raises CSW concern');

  const confidence =
    supportingFeatures.length >= 4 && contradictingFeatures.length === 0 ? 0.9 :
    supportingFeatures.length >= 3 && contradictingFeatures.length <= 1 ? 0.7 :
    0.4;

  return {
    primaryDiagnosis: 'SIADH',
    confidence,
    supportingFeatures,
    contradictingFeatures,
    nextSteps: [
      'Check cortisol and TSH to exclude adrenal/thyroid insufficiency',
      'Review medications (SSRIs, carbamazepine, etc.)',
      'Consider chest imaging if suspect pulmonary cause'
    ],
    warningFlags: confidence > 0.7 ? [] : ['Consider CSW if CNS injury present']
  };
};
```

---

## Visual & Interaction Design

### Color Semantics (Tailwind classes)
- **SIADH (Water excess)**: `bg-blue-50 border-blue-300 text-blue-900`
- **CSW (Salt wasting)**: `bg-amber-50 border-amber-300 text-amber-900`
- **DI (Water deficit)**: `bg-red-50 border-red-300 text-red-900`
- **Normal**: `bg-slate-50 border-slate-300 text-slate-900`
- **Danger/Warning**: `bg-rose-100 border-rose-400`
- **Success**: `bg-emerald-100 border-emerald-400`

### Animation Principles (Framer Motion)
- **Parameter changes**: Smooth number transitions, 300ms ease-out
- **Diagnostic updates**: Fade in/out with scale, 200ms
- **Chart updates**: Animated paths with spring physics
- **Safety warnings**: Pulse animation to draw attention
- **Card flips**: 3D rotate transform, 400ms

### Accessibility
- All interactive elements keyboard-navigable (tab order)
- ARIA labels on all sliders: `aria-label="Serum sodium" aria-valuenow={value} aria-valuemin={120} aria-valuemax={160}`
- Live regions for dynamic content: `<div aria-live="polite" aria-atomic="true">`
- Focus indicators: `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`
- Contrast ratios meet WCAG AA: 4.5:1 for text, 3:1 for UI

---

## Scenario Engine

### Scenario Structure
```typescript
interface ClinicalScenario {
  id: string;
  title: string;
  level: 'step1' | 'step2' | 'step3' | 'residency';
  initialState: WaterBalanceState;
  clinicalContext: string;
  timeline: TimelineEvent[];
  learningObjectives: string[];
  correctDiagnosis: string;
  managementPearls: string[];
}

interface TimelineEvent {
  timepoint: number;        // hours
  type: 'vitals' | 'labs' | 'exam' | 'intervention';
  data: any;
  autoReveal: boolean;      // or user-triggered
}
```

### 6 Core Scenarios
1. **Neuro-ICU SAH → CSW vs SIADH**
2. **Pneumonia → SIADH**
3. **Lithium + polyuria → Nephrogenic DI**
4. **Post-TBI → Central DI (triphasic)**
5. **Beer potomania → Low solute hypoNa**
6. **Psych ward → Primary polydipsia vs partial DI**

---

## Progressive Disclosure Strategy

### Level Gates
1. **Step 1 Mode**:
   - Show physiology animations
   - Basic diagnostic flowchart
   - 3-4 lab parameters
   - Simple management principles

2. **Step 2/3 Mode**:
   - Add volume status assessment
   - FEurate and advanced labs
   - Response test simulators
   - Correction calculators

3. **Residency/Fellow Mode**:
   - Edge cases and mixed pictures
   - Drug comparison tables
   - ICU complications
   - Research references

### UI Implementation
- Toggle switch: "Show advanced parameters"
- Collapsible sections with "Why does this matter?"
- Tooltips: Basic (always) vs Advanced (opt-in)

---

## Safety & Educational Guardrails

### Correction Meter Logic
```typescript
const SAFE_HYPO_CORRECTION = 6; // mEq/L per 24h
const MAX_HYPO_CORRECTION = 8;
const SAFE_HYPER_CORRECTION = 10;

export const assessCorrectionSafety = (
  deltaNa: number,
  timeElapsed: number
): SafetyAssessment => {
  const rate = deltaNa / (timeElapsed / 24);

  if (deltaNa < 0 && rate < SAFE_HYPO_CORRECTION) {
    return { level: 'safe', message: 'Within safe limits' };
  } else if (deltaNa < 0 && rate < MAX_HYPO_CORRECTION) {
    return { level: 'caution', message: 'Approaching upper limit - consider slowing' };
  } else if (deltaNa < 0 && rate >= MAX_HYPO_CORRECTION) {
    return {
      level: 'danger',
      message: 'RISK: Osmotic demyelination syndrome. Stop hypertonic fluids, consider D5W.'
    };
  }
  // ... similar for hypernatremia
};
```

### Disclaimer Placement
- Banner on every page: "Educational use only. Not a substitute for clinical judgment."
- Modal on first launch with acknowledgment
- Watermark on correction calculators

---

## Testing Strategy

### Unit Tests (Vitest)
- All calculation functions with edge cases
- Selector logic for diagnostics
- Scenario generation determinism

### Component Tests (React Testing Library)
- Slider interactions update store
- Flow chart navigation
- Quiz submission and feedback

### E2E Tests (Playwright)
- Complete scenario playthrough
- Mobile responsive breakpoints
- Keyboard navigation flows

---

## Performance Considerations

### Optimization
- Zustand selectors memoized with shallow equality
- Recharts lazy-loaded (code splitting)
- Canvas rendering for complex plots (60fps)
- Virtualized lists for drug tables

### Bundle Size Targets
- Initial bundle: < 200KB gzipped
- Lazy routes: < 100KB each
- Total: < 500KB for full app

---

## Success Metrics

### Functional
- ✅ All 6 scenarios playable end-to-end
- ✅ Diagnostic logic matches clinical guidelines
- ✅ Safety warnings trigger appropriately
- ✅ Mobile usable (thumb-friendly sliders)
- ✅ Screen reader can navigate completely

### Educational
- ✅ Each module has clear learning objective
- ✅ Feedback is immediate and explanatory
- ✅ Progressive disclosure doesn't overwhelm
- ✅ Mnemonics are memorable and accurate

---

## Future Enhancements (Post-MVP)

1. **Spaced Repetition**: Track weak areas, resurface
2. **Copeptin Algorithms**: When available clinically
3. **Imaging Atlas**: MRI findings
4. **Export Timeline**: PNG/CSV of case
5. **Multiplayer**: Collaborative case solving
6. **AI Tutor**: Explain concepts in simpler terms

---

*This architecture balances clinical rigor with pedagogical elegance. Every component teaches; every interaction reinforces learning. It's not just a reference—it's a thinking tool.*
