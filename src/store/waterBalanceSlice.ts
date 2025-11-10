/**
 * Zustand store for water balance state management
 */

import { StateCreator } from 'zustand';
import { WaterBalanceState, FluidIntervention, Medication, VolumeStatus } from '@/types';

export interface WaterBalanceSlice extends WaterBalanceState {
  // Actions
  setSerumNa: (value: number) => void;
  setSerumOsm: (value: number | null) => void;
  setGlucose: (value: number) => void;
  setBUN: (value: number) => void;
  setSerumCreatinine: (value: number) => void;
  setUrineOsm: (value: number) => void;
  setUrineNa: (value: number) => void;
  setUrineVolume: (value: number) => void;
  setVolumeStatus: (status: VolumeStatus) => void;
  setFEurate: (value: number | null) => void;
  setHematocrit: (value: number) => void;
  setSerumUricAcid: (value: number) => void;
  setCalcium: (value: number) => void;
  setPotassium: (value: number) => void;
  setHasCNSInjury: (value: boolean) => void;
  setLithiumExposure: (value: boolean) => void;
  setPregnancy: (value: boolean) => void;
  setRecentSurgery: (value: boolean) => void;
  setMalignancy: (value: boolean) => void;
  setSoluteIntake: (value: number) => void;
  setWeight: (value: number) => void;
  setAge: (value: number) => void;
  setSex: (sex: 'male' | 'female') => void;
  addFluid: (fluid: FluidIntervention) => void;
  addMedication: (med: Medication) => void;
  advanceTime: (hours: number) => void;
  resetState: () => void;
  loadState: (state: Partial<WaterBalanceState>) => void;
}

const initialState: WaterBalanceState = {
  serumNa: 140,
  serumOsm: null,
  glucose: 90,
  BUN: 15,
  serumCreatinine: 1.0,
  urineOsm: 500,
  urineNa: 50,
  urineVolume: 1.5,
  volumeStatus: 'euvolemic',
  FEurate: null,
  hematocrit: 40,
  serumUricAcid: 5.0,
  calcium: 9.5,
  potassium: 4.0,
  hasCNSInjury: false,
  lithiumExposure: false,
  pregnancy: false,
  recentSurgery: false,
  malignancy: false,
  fluidsGiven: [],
  medicationsGiven: [],
  soluteIntake: 600,
  timeElapsed: 0,
  weight: 70,
  age: 50,
  sex: 'male',
};

export const createWaterBalanceSlice: StateCreator<WaterBalanceSlice> = (set) => ({
  ...initialState,

  setSerumNa: (value) => set({ serumNa: value }),
  setSerumOsm: (value) => set({ serumOsm: value }),
  setGlucose: (value) => set({ glucose: value }),
  setBUN: (value) => set({ BUN: value }),
  setSerumCreatinine: (value) => set({ serumCreatinine: value }),
  setUrineOsm: (value) => set({ urineOsm: value }),
  setUrineNa: (value) => set({ urineNa: value }),
  setUrineVolume: (value) => set({ urineVolume: value }),
  setVolumeStatus: (status) => set({ volumeStatus: status }),
  setFEurate: (value) => set({ FEurate: value }),
  setHematocrit: (value) => set({ hematocrit: value }),
  setSerumUricAcid: (value) => set({ serumUricAcid: value }),
  setCalcium: (value) => set({ calcium: value }),
  setPotassium: (value) => set({ potassium: value }),
  setHasCNSInjury: (value) => set({ hasCNSInjury: value }),
  setLithiumExposure: (value) => set({ lithiumExposure: value }),
  setPregnancy: (value) => set({ pregnancy: value }),
  setRecentSurgery: (value) => set({ recentSurgery: value }),
  setMalignancy: (value) => set({ malignancy: value }),
  setSoluteIntake: (value) => set({ soluteIntake: value }),
  setWeight: (value) => set({ weight: value }),
  setAge: (value) => set({ age: value }),
  setSex: (sex) => set({ sex }),

  addFluid: (fluid) =>
    set((state) => ({
      fluidsGiven: [...state.fluidsGiven, fluid],
    })),

  addMedication: (med) =>
    set((state) => ({
      medicationsGiven: [...state.medicationsGiven, med],
    })),

  advanceTime: (hours) =>
    set((state) => ({
      timeElapsed: state.timeElapsed + hours,
    })),

  resetState: () => set(initialState),

  loadState: (partialState) =>
    set((state) => ({
      ...state,
      ...partialState,
      // Set baseline if not already set and Na is abnormal
      baselineNa: partialState.serumNa !== undefined && !state.baselineNa ? partialState.serumNa : state.baselineNa,
    })),
});
