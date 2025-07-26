import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import SolarSystem from './pages/SolarSystem'

import { create } from 'zustand'

export const useConfig = create(set => ({
  tags: true,
  interface: false,
  tagsOn: () => set(state => ({ tags: true })),
  tagsOff: () => set(state => ({ tags: false })),
  interfaceOn: () => set(state => ({ interface: true })),
  interfaceOff: () => set(state => ({ interface: false }))
}))

export const useCamara = create(set => ({
  camara: undefined,
  setCamara: camara => set(state => ({ camara: camara })),
  setTheta: th => set(state => (state.camara.current._sphericalEnd.theta = th)),
  setPhi: ph => set(state => (state.camara.current._sphericalEnd.phi = ph)),
  setRadius: rad =>
    set(state => (state.camara.current._sphericalEnd.radius = rad))
}))

export const useAnimation = create(set => ({
  intro_animation: false
}))

function App () {
  return (
    <>
      <SolarSystem />
    </>
  )
}

export default App
