import SolarSystem from './pages/SolarSystem'

import { create } from 'zustand'

import {
  calculateEarthObliquityOfTheEcliptic,
  earthCoordinatesGivenDate,
  earthNutationInLongitude,
  earthNutationInObliquity,
  jupiterCoordinatesGivenDate,
  marsCoordinatesGivenDate,
  mercuryCoordinatesGivenDate,
  moonCoordinatesGivenDate,
  neptuneCoordinatesGivenDate,
  saturnCoordinatesGivenDate,
  sideralTimeAtGreenwich,
  uranusCoordinatesGivenDate,
  venusCoordinatesGivenDate
} from './core/VSOP87D'
import { useEffect } from 'react'

const i = localStorage.getItem('firstEnter') != 'false'

//State for config
export const useConfig = create(set => ({
  tags: !i,
  tagsOn: () => set(state => ({ tags: true })),
  tagsOff: () => set(state => ({ tags: false })),

  controls: !i,
  controlsOn: () => set(state => ({ controls: true })),
  controlsOff: () => set(state => ({ controls: false })),

  zoomWhenChange: i,
  zoomOn: () => set(state => ({ zoomWhenChange: true })),
  zoomOff: () => set(state => ({ zoomWhenChange: false })),

  au: true,
  auOn: () => set(state => ({ au: true })),
  auOff: () => set(state => ({ au: false })),

  localTime: false,
  setLocalTime: t => set(state => ({ localTime: t }))
}))

//State for eclipse simulation
export const useEclipse = create(set => ({
  eclip: false,
  eclipOn: () => set(state => ({ eclip: true })),
  eclipOff: () => set(state => ({ eclip: false }))
}))

//State for camera
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

//State for planet coords
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
    earthObliquity: 0,
    earthRotationCompensation: 0
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
        earthRotation: sideralTimeAtGreenwich(JDday),
        earthRotationCompensation: Math.cos(earthNutationInObliquity(JDday))
      }
    })) //Parser from LBR to xyz
}))

//State for line management
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

//State for orbit management
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
      <div
        className='fixed z-[60] bottom-2.5 w-screen
       text-center text-[0.81em] font-semibold underline'
      >
        <a
          className='text-[var(--soft-text)]'
          href='https://pepercfoundry.web.app/'
          target='_blank'
          rel='noopener noreferrer'
        >
          Pepe RC Foundry - 2025
        </a>
      </div>
    </>
  )
}

export default App
