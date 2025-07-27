import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import SolarSystem from './pages/SolarSystem'

import { create } from 'zustand'

const i = false

export const useConfig = create(set => ({
  tags: !i,
  tagsOn: () => set(state => ({ tags: true })),
  tagsOff: () => set(state => ({ tags: false })),

  controls: !i,
  controlsOn: () => set(state => ({ controls: true })),
  controlsOff: () => set(state => ({ controls: false })),

  zoomWhenChange: true,
  zoomOn: () => set(state => ({ zoomWhenChange: true })),
  zoomOff: () => set(state => ({ zoomWhenChange: false }))
}))

export const usePlanet = create(set => ({
  planet: i ? 'saturn' : 'sun',
  setPlanet: p => set(state => ({ planet: p }))
}))

export const useDate = create(set => ({
  date: '1992-04-12',
  setDate: d => set(state => ({ date: d }))
}))

export const useAnimation = create(set => ({
  intro_animation: i
}))

function App () {
  return (
    <>
      <SolarSystem />
    </>
  )
}

export default App

/*
export const useCamara = create(set => ({
  camara: undefined,
  setCamara: camara => set(state => ({ camara: camara })),
  changeTarget: (radius = null, coords, st) =>
    set(
      state => (
        (state.camara.current.smoothTime = st),
        (state.camara.current._targetEnd = { ...coords }),
        radius && (state.camara.current._sphericalEnd.radius = radius)
      )
    ),
  setTheta: th => set(state => (state.camara.current._sphericalEnd.theta = th)),
  setPhi: ph => set(state => (state.camara.current._sphericalEnd.phi = ph)),
  setRadius: rad =>
    set(state => (state.camara.current._sphericalEnd.radius = rad))
}))
*/
