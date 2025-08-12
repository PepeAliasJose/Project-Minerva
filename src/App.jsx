import SolarSystem from './pages/SolarSystem'

import { create } from 'zustand'
import {
  calculateEarthObliquityOfTheEcliptic,
  calculateEarthRotationGivenDate,
  moonCoordinatesGivenDate,
  sideralTimeAtGreenwich
} from './helpers/functions/astronomicalFunctions'
import {
  earthCoordinatesGivenDate,
  jupiterCoordinatesGivenDate,
  marsCoordinatesGivenDate,
  mercuryCoordinatesGivenDate,
  neptuneCoordinatesGivenDate,
  saturnCoordinatesGivenDate,
  uranusCoordinatesGivenDate,
  venusCoordinatesGivenDate
} from './helpers/functions/VSOP87D'
import { useEffect } from 'react'

const i = localStorage.getItem('firstEnter') != 'false'

export const useConfig = create(set => ({
  tags: !i,
  tagsOn: () => set(state => ({ tags: true })),
  tagsOff: () => set(state => ({ tags: false })),

  controls: !i,
  controlsOn: () => set(state => ({ controls: true })),
  controlsOff: () => set(state => ({ controls: false })),

  zoomWhenChange: true,
  zoomOn: () => set(state => ({ zoomWhenChange: true })),
  zoomOff: () => set(state => ({ zoomWhenChange: false })),

  au: true,
  auOn: () => set(state => ({ au: true })),
  auOff: () => set(state => ({ au: false }))
}))

export const useCustomCamera = create(set => ({
  target: [0, 0, 0],
  theta: -Math.PI / 1.75,
  phi: Math.PI / 3,
  radius: 10000,
  smoothTime: 0,
  fov: 40,
  updateTarget: t => set(() => ({ target: t })),
  updateView: (theta, phi, radius, smoothTime) =>
    set(() => ({
      theta: theta,
      phi: phi,
      radius: radius,
      smoothTime: smoothTime
    })),
  updateST: smoothTime =>
    set(() => ({
      smoothTime: smoothTime
    })),
  updateRadius: rad =>
    set(() => ({
      radius: rad
    })),
  updateFov: fov =>
    set(() => ({
      fov: fov
    }))
}))

export const usePlanets = create(set => ({
  planets: {
    mercury: { L: 0, B: 0, R: 0 },
    venus: { L: 0, B: 0, R: 0 },
    earth: { L: 0, B: 0, R: 0 },
    moon: { L: 0, B: 0, R: 0 },
    mars: { L: 0, B: 0, R: 0 },
    jupiter: { L: 0, B: 0, R: 0 },
    saturn: { L: 0, B: 0, R: 0 },
    uranus: { L: 0, B: 0, R: 0 },
    neptune: { L: 0, B: 0, R: 0 },
    earthRotation: 0,
    earthObliquity: 0
  },
  updateAllPlanets: JDday =>
    set(state => ({
      planets: {
        mercury: mercuryCoordinatesGivenDate(JDday),
        venus: venusCoordinatesGivenDate(JDday),
        earth: earthCoordinatesGivenDate(JDday),
        moon: moonCoordinatesGivenDate(JDday),
        mars: marsCoordinatesGivenDate(JDday),
        jupiter: jupiterCoordinatesGivenDate(JDday),
        saturn: saturnCoordinatesGivenDate(JDday),
        uranus: uranusCoordinatesGivenDate(JDday),
        neptune: neptuneCoordinatesGivenDate(JDday),
        earthObliquity: calculateEarthObliquityOfTheEcliptic(JDday),
        earthRotation: sideralTimeAtGreenwich(JDday)
      }
    })) //Parser from LBR to xyz
}))

export const useLines = create(set => ({
  lines: [],
  addLine: line =>
    set(state => ({
      lines: [...state.lines, line]
    })),

  removeLine: id =>
    set(state => ({
      lines: state.lines.filter(l => {
        if (l.id != id) {
          return true
        }
        return false
      })
    }))
}))

export const useOrbits = create(set => ({
  orbits: [],
  addOrbit: orbit =>
    set(state => ({
      orbits: [...state.orbits, orbit]
    })),

  removeOrbit: id =>
    set(state => ({
      orbits: state.orbits.filter(l => {
        if (l.id != id) {
          return true
        }
        return false
      })
    }))
}))

//Deprecated
export const usePlanet = create(set => ({
  planet: i ? 'saturn' : 'sun',
  setPlanet: p => set(state => ({ planet: p }))
}))
//Deprecated
export const useDate = create(set => ({
  date: '1992-04-12',
  setDate: d => set(state => ({ date: d }))
}))

export const useAnimation = create(set => ({
  intro_animation: i
}))

function App () {
  useEffect(() => {
    localStorage.setItem('firstEnter', 'false')
  }, [])

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
        (camara.current.smoothTime = st),
        (camara.current._targetEnd = { ...coords }),
        radius && (camara.current._sphericalEnd.radius = radius)
      )
    ),
  setTheta: th => set(state => (camara.current._sphericalEnd.theta = th)),
  setPhi: ph => set(state => (camara.current._sphericalEnd.phi = ph)),
  setRadius: rad =>
    set(state => (camara.current._sphericalEnd.radius = rad))
}))
*/
