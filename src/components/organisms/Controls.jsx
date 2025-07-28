import { AnimatePresence, motion } from 'framer-motion'
import { useAnimation, useConfig, useCustomCamera, usePlanets } from '../../App'
import { useEffect, useState } from 'react'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Stats } from '@react-three/drei'
import {
  changeDateFromInput,
  earthCoordinatesGivenDate,
  moonParseLBDToXYZ,
  parseLBRToXYZ
} from '../../helpers/functions/astronomicalFunctions'

function Controls ({}) {
  const { controls, zoomWhenChange } = useConfig() //Configuracion
  const { intro_animation } = useAnimation()

  //Fecha y planeta seleccionado
  const [date, setDate] = useState('1992-04-12')
  const [planet, setPlanet] = useState(intro_animation ? 'saturn' : 'sun')

  //Planetas
  const {
    mercury,
    venus,
    earth,
    moon,
    mars,
    jupiter,
    saturn,
    uranus,
    neptune,
    updateAllPlanets
  } = usePlanets()

  //Target de la camara
  const { updateTarget, updateRadius, updateST } = useCustomCamera()

  useEffect(() => {
    const JDday = changeDateFromInput(date)
    updateAllPlanets(JDday)
  }, [date])

  useEffect(() => {
    updateST(0.6)
    updateCameraTarget(planet)
  }, [planet])

  useEffect(() => {
    updateST(0)
    updateCameraTarget(planet)
  }, [mercury])

  function updateCameraTarget (planet) {
    switch (planet) {
      case 'sun':
        updateTarget([0, 0, 0])
        zoomWhenChange && updateRadius(14)
        break
      case 'mercury':
        updateTarget(parseLBRToXYZ(mercury))
        zoomWhenChange && updateRadius(0.7)
        break
      case 'venus':
        updateTarget(parseLBRToXYZ(venus))
        zoomWhenChange && updateRadius(0.7)
        break
      case 'earth':
        updateTarget(parseLBRToXYZ(earth))
        zoomWhenChange && updateRadius(0.7)
        break
      case 'moon':
        const e = parseLBRToXYZ(earth)
        const m = moonParseLBDToXYZ(moon)
        updateTarget([e[0] + m[0], e[1] + m[1], e[2] + m[2]])
        zoomWhenChange && updateRadius(0.2)
        break
      case 'mars':
        updateTarget(parseLBRToXYZ(mars))
        zoomWhenChange && updateRadius(0.7)
        break
      case 'saturn':
        updateTarget(parseLBRToXYZ(saturn))
        zoomWhenChange && updateRadius(1.3)
        break
      case 'jupiter':
        updateTarget(parseLBRToXYZ(jupiter))
        zoomWhenChange && updateRadius(1.7)
        break
      case 'uranus':
        updateTarget(parseLBRToXYZ(uranus))
        zoomWhenChange && updateRadius(1)
        break
      case 'neptune':
        updateTarget(parseLBRToXYZ(neptune))
        zoomWhenChange && updateRadius(1)
        break
      default:
        updateTarget([0, 0, 0])
        zoomWhenChange && updateRadius(14)
        break
    }
  }

  return (
    <AnimatePresence>
      {controls && (
        <motion.div
          key={'Controls'}
          initial={{
            opacity: 0,
            transition: { duration: 0.3, ease: 'easeInOut' }
          }}
          animate={{
            opacity: 1,
            transition: { delay: 0.6, duration: 0.3, ease: 'easeInOut' }
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.7, ease: 'easeInOut' }
          }}
          className='absolute bottom-5 left-0 w-full justify-center 
       flex flex-row-reverse gap-10 items-center text-[#B4B5B7]'
        >
          <input
            className='up out-rounded px-5 py-2.5 z-50'
            type='date'
            value={date}
            onChange={e => {
              //changeDateFromInput(e.target.value)
              setDate(e.target.value)
            }}
          />
          <select
            className='up out-rounded px-5 py-2.5 z-50'
            value={planet}
            onChange={e => {
              setPlanet(e.target.value)
            }}
          >
            <option className='text-black' value={'sun'}>
              Sol
            </option>
            <option className='text-black' value={'mercury'}>
              Mercurio
            </option>
            <option className='text-black' value={'venus'}>
              Venus
            </option>
            <option className='text-black' value={'earth'}>
              Tierra
            </option>
            <option className='text-black' value={'moon'}>
              Luna
            </option>
            <option className='text-black' value={'mars'}>
              Marte
            </option>
            <option className='text-black' value={'jupiter'}>
              Jupiter
            </option>
            <option className='text-black' value={'saturn'}>
              Saturno
            </option>
            <option className='text-black' value={'uranus'}>
              Urano
            </option>
            <option className='text-black' value={'neptune'}>
              Neptuno
            </option>
          </select>
        </motion.div>
      )}
      <SettingsMenu />
    </AnimatePresence>
  )
}

function SettingsMenu () {
  const [show, setShow] = useState(false)
  const [stats, setStats] = useState(false)
  return (
    <motion.div
      key={'settings-menu'}
      className={
        'fixed z-50 transition-all top-5 right-5 overflow-clip up out-rounded p-2 backdrop-blur-md ' +
        (show ? ' size-80 ' : ' size-12 ')
      }
    >
      {stats && <Stats />}
      <Cog6ToothIcon
        className={
          'size-6 transition-all duration-500 absolute top-3 right-3 ' +
          (show && ' -rotate-180 ')
        }
        onClick={() => {
          setShow(!show)
        }}
      />
      <p className='m-4 mt-12'>Etiquetas: </p>
      <p className='m-4'>Calcular distancia: </p>
      <p className='m-4 '>Calcular orbita: </p>
    </motion.div>
  )
}

export default Controls
