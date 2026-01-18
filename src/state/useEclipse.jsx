import { create } from 'zustand'
import { persist } from 'zustand/middleware'

//State for eclipse simulation
export const useEclipse = create(
  persist((set) => ({
    eclip: false,
    setEclip: (t) => set((state) => ({ eclip: t })),
    penum: false,
    setPenum: (t) => set((state) => ({ penum: t }))
  }))
)
