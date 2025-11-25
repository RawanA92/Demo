// store/usePlayerMovement.js
import { create } from "zustand";

export const usePlayerMovement = create((set) => ({
  move: { x: 0, z: 0 },

  setMoveVector: (x, z) => set({ move: { x, z } }),
}));
