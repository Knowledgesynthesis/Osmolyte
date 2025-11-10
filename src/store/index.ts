/**
 * Main Zustand store configuration
 */

import { create } from 'zustand';
import { createWaterBalanceSlice, WaterBalanceSlice } from './waterBalanceSlice';

export type RootState = WaterBalanceSlice;

export const useStore = create<RootState>()((...a) => ({
  ...createWaterBalanceSlice(...a),
}));

// Export selectors
export * from './selectors';
