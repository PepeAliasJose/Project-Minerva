import { create } from 'zustand'

const i = localStorage.getItem('firstEnter') != 'false'

//State for config
const useConfig = create((set) => ({
  tags: !i,
  tagsOn: () => set((state) => ({ tags: true })),
  tagsOff: () => set((state) => ({ tags: false })),

  controls: !i,
  controlsOn: () => set((state) => ({ controls: true })),
  controlsOff: () => set((state) => ({ controls: false })),

  zoomWhenChange: i,
  zoomOn: () => set((state) => ({ zoomWhenChange: true })),
  zoomOff: () => set((state) => ({ zoomWhenChange: false })),

  au: true,
  auOn: () => set((state) => ({ au: true })),
  auOff: () => set((state) => ({ au: false })),

  localTime: false,
  setLocalTime: (t) => set((state) => ({ localTime: t }))
}))

export default useConfig
