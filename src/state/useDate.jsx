import { create } from 'zustand'

export const useDate = create((set) => ({
  date: '1992-04-12T12:00:00',
  setDate: (t) => set((state) => ({ date: t }))
}))
