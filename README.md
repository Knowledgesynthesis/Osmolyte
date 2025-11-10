# Osmolyte: SIADH–CSW–DI Navigator

An interactive educational dashboard for learning about sodium and water disorders, specifically SIADH (Syndrome of Inappropriate ADH), CSW (Cerebral Salt Wasting), and DI (Diabetes Insipidus).

## Overview

Osmolyte is designed to help medical students, residents, and healthcare professionals master the diagnosis and management of complex electrolyte disorders through interactive simulations, real-time diagnostic feedback, and evidence-based educational content.

## Features

### 🎯 Interactive Simulator
- **Real-time Diagnostic Engine**: Adjust clinical parameters and see immediate diagnostic updates
- **Control Panel**: Interactive sliders for serum sodium, glucose, BUN, urine osmolality, urine sodium, and more
- **Volume Status Assessment**: Select between hypovolemic, euvolemic, and hypervolemic states
- **Clinical Context Flags**: CNS injury, lithium exposure, pregnancy, and other relevant factors

### 📊 Diagnostic Tools

#### Diagnostic Display
- Real-time confidence scores for differential diagnoses
- Supporting and contradicting features with clinical reasoning
- Calculated values (serum osmolality, total body water)
- Evidence-based next steps and warning flags

#### SIADH vs CSW Comparator
- Side-by-side comparison of key diagnostic features
- Confidence scores for each diagnosis
- Interactive comparison table highlighting key differentiators
- Clinical pearls for distinguishing these challenging conditions

#### Correction Safety Meter
- Real-time monitoring of sodium correction rates
- Visual safety indicators (safe/caution/danger zones)
- Educational guardrails preventing osmotic demyelination syndrome
- Automatic calculation of correction rate per 24 hours

### 📚 Educational Content

#### Clinical Scenarios
Six comprehensive, evidence-based clinical scenarios:
1. **Neuro-ICU SAH with Hyponatremia** - CSW vs SIADH differential (Residency level)
2. **Pneumonia with Euvolemic Hyponatremia** - Classic SIADH presentation (Step 2)
3. **Lithium-Induced Nephrogenic DI** - Management of drug-induced DI (Step 3)
4. **Post-Traumatic Central DI** - Acute DI after neurosurgery (Residency level)
5. **Beer Potomania** - Low solute intake hyponatremia (Step 2)
6. **Psychogenic Polydipsia** - Differential diagnosis with partial DI (Step 3)

#### Quick Quiz
- 8 board-style questions covering key concepts
- Instant feedback with detailed explanations
- Difficulty levels: Easy, Medium, Hard
- Score tracking and performance analytics

#### Clinical Pearls & Mnemonics
- 12 high-yield pearls with flip-card interface
- Memorable mnemonics (e.g., "SIADH: Soaked Inside")
- Categorized by diagnosis, management, physiology, and pitfalls
- Progressive disclosure by training level

## Technology Stack

### Core Framework
- **React 18** with **TypeScript** for type-safe component development
- **Vite** for fast development and optimized production builds
- **Tailwind CSS** for responsive, utility-first styling

### State Management & Logic
- **Zustand** for lightweight, performant state management
- Custom selectors for derived state and diagnostic logic
- Deterministic medical algorithms based on clinical guidelines

### UI & Animations
- **Framer Motion** for smooth, purposeful animations
- Custom-designed color semantics for medical conditions
- WCAG 2.2 AA compliant for accessibility

### Medical Logic
- Evidence-based diagnostic algorithms
- Serum osmolality calculations
- Free water deficit/excess calculations
- Sodium correction rate monitoring with safety limits
- Water deprivation test simulation
- FE urate dynamics modeling

## Installation & Usage

### Prerequisites
- Node.js 18+ and npm

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:3000`

## Educational Philosophy

### Progressive Disclosure
Content is layered by training level:
- **Step 1**: Core physiology and basic diagnostic algorithms
- **Step 2**: Pattern recognition and initial management
- **Step 3**: Complex cases and disposition decisions
- **Residency**: Edge cases, advanced monitoring, ICU management

### Safety-First Design
- Prominent medical disclaimers on every page
- Educational ranges only (not prescriptive dosing)
- Correction rate warnings prevent dangerous practices
- Emphasis on institutional protocols and clinical judgment

### Evidence-Based Content
All diagnostic criteria, management recommendations, and safety limits are based on:
- Current nephrology and endocrinology guidelines
- Peer-reviewed medical literature
- Expert consensus on electrolyte disorders
- USMLE board examination content

## Key Concepts Covered

### SIADH (Syndrome of Inappropriate ADH)
- Euvolemic hypotonic hyponatremia
- High urine osmolality (>100) and high urine sodium (>30)
- Low BUN and uric acid from dilution
- Management: fluid restriction, salt tablets, vaptans

### CSW (Cerebral Salt Wasting)
- Hypovolemic hyponatremia after CNS injury
- High urinary sodium loss despite volume depletion
- FE urate normalizes after volume repletion
- Management: volume repletion with saline, salt supplementation

### Diabetes Insipidus
- **Central DI**: Impaired ADH release
  - Causes: neurosurgery, TBI, pituitary tumors
  - Treatment: desmopressin (DDAVP)
- **Nephrogenic DI**: Renal resistance to ADH
  - Causes: lithium, hypercalcemia, hypokalemia
  - Treatment: amiloride, thiazides, low-Na diet

## Safety & Disclaimers

**IMPORTANT**: This application is for educational purposes ONLY.

- NOT a substitute for professional medical advice
- NOT for clinical decision-making or patient care
- Always consult current guidelines and institutional protocols
- Verify all information with qualified healthcare providers

## Project Structure

```
osmolyte/
├── src/
│   ├── components/        # React components
│   │   ├── core/          # Layout, ControlPanel
│   │   ├── visualizations/# DiagnosticDisplay, SIADHvsCSW, CorrectionMeter
│   │   ├── education/     # Quiz, PearlCards
│   │   └── ui/            # Base UI components (Button, Card, Slider)
│   ├── store/             # Zustand state management
│   ├── lib/               # Medical calculations and diagnostic logic
│   ├── types/             # TypeScript type definitions
│   └── data/              # Clinical scenarios, pearls, drugs, quizzes
├── public/                # Static assets
└── README.md
```

## Contributing

This is an educational project. Contributions should:
- Maintain clinical accuracy and evidence-based content
- Include proper medical disclaimers
- Follow accessibility guidelines (WCAG 2.2 AA)
- Use TypeScript for type safety
- Document medical sources and references

## License

Educational use only. Not for commercial distribution or clinical use.

## Acknowledgments

Built with the ultrathink philosophy: elegant code, clinical rigor, and educational excellence.

Inspired by the need to demystify complex sodium and water disorders for learners at all levels.

---

**Remember**: In clinical practice, always correlate with the complete clinical picture, follow institutional protocols, and consult nephrology when uncertain. This tool teaches principles, but every patient is unique.
