import { AnimatePresence, motion } from 'framer-motion'
import { useAnimation, useCustomCamera, usePlanets } from '../../App'
import { useEffect, useState } from 'react'

import {
  changeDateFromInput,
  moonParseLBDToXYZ,
  parseLBRToXYZ
} from '../../core/helpers/functions/astronomicalFunctions'
import PlanetSelector from '../atoms/PlanetSelector'

import useConfig from '../../state/useConfig'
import { useDate } from '../../state/useDate'

function Controls({}) {
  const { controls, zoomWhenChange, localTime } = useConfig()
  const { intro_animation } = useAnimation()

  //Fecha y planeta seleccionado
  const { date, setDate } = useDate()
  const [planet, setPlanet] = useState(intro_animation ? 'saturn' : 'sun')

  //Planetas
  const { planets, updateAllPlanets } = usePlanets()

  //Target de la camara
  const { updateTarget, updateRadius, updateST } = useCustomCamera()

  useEffect(() => {
    const JDday = changeDateFromInput(date, localTime)
    updateAllPlanets(JDday)
  }, [date, localTime])

  useEffect(() => {
    updateST(0.5)
    updateCameraTarget(planet)
  }, [planet])

  useEffect(() => {
    updateST(0)
    updateCameraTarget(planet)
  }, [planets])

  function updateCameraTarget(planet) {
    //console.log(planet, planets[planet])
    switch (planet) {
      case 'sun':
        updateTarget([0, 0, 0])
        zoomWhenChange && updateRadius(14)
        break
      case 'moon':
        const e = parseLBRToXYZ(planets.earth)
        const m = moonParseLBDToXYZ(planets.moon)
        updateTarget([e[0] + m[0], e[1] + m[1], e[2] + m[2]])
        zoomWhenChange && updateRadius(0.2)
        break
      default:
        updateTarget(parseLBRToXYZ(planets[planet]))
        zoomWhenChange && updateRadius(1.4)
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
          className='absolute bottom-10 left-0 w-full z-50 inline-flex justify-center'
        >
          <div className='grid sm:grid-cols-3 w-fit gap-2'>
            <div
              className='out-rounded justify-self-end h-10 w-32 col-start-1
            inline-flex items-center justify-center '
            >
              <PlanetSelector planet={planet} setPlanet={setPlanet} />
            </div>

            <div
              className='up out-rounded 
            col-start-1 sm:col-start-2 
            row-start-2 sm:row-start-1
            col-span-2 sm:col-span-1 h-10 inline-flex justify-center items-center'
            >
              <input
                aria-label='Fecha para calcular'
                className='px-5 py-2 z-50 rounded-full'
                type='datetime-local'
                defaultValue={date}
                onChange={(e) => {
                  //changeDateFromInput(e.target.value)
                  setDate(e.target.value)
                }}
              />
            </div>

            <div className='up out-rounded w-32 col-start-2 sm:col-start-3'>
              <p className='p-2 text-sm h-10 text-center content-center'>
                {localTime ? ' Local T ' : ' Universal T '}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Controls
