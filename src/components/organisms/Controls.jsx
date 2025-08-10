import { AnimatePresence, motion } from 'framer-motion'
import { useAnimation, useConfig, useCustomCamera, usePlanets } from '../../App'
import { useEffect, useState } from 'react'

import {
  changeDateFromInput,
  moonParseLBDToXYZ,
  parseLBRToXYZ
} from '../../helpers/functions/astronomicalFunctions'
import PlanetSelector from '../atoms/PlanetSelector'
import ActionsMenu from '../molecules/ActionsMenu'
import SettingsMenu from '../molecules/SettingsMenu'

function Controls ({}) {
  const { controls, zoomWhenChange } = useConfig() //Configuracion
  const { intro_animation } = useAnimation()

  //Fecha y planeta seleccionado
  const [date, setDate] = useState('1992-04-12T14:00:00') //1992-04-12T00:00:00 //2025-07-30T14:00:00
  const [planet, setPlanet] = useState(intro_animation ? 'saturn' : 'sun')

  //Planetas
  const { planets, updateAllPlanets } = usePlanets()

  //Target de la camara
  const { updateTarget, updateRadius, updateST } = useCustomCamera()

  useEffect(() => {
    const JDday = changeDateFromInput(date)
    updateAllPlanets(JDday)
  }, [date])

  useEffect(() => {
    updateST(0.5)
    updateCameraTarget(planet)
  }, [planet])

  useEffect(() => {
    updateST(0)
    updateCameraTarget(planet)
  }, [planets])

  function updateCameraTarget (planet) {
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
          className='absolute bottom-5 left-0 w-full justify-center 
       flex flex-row-reverse gap-10 items-center z-50'
        >
          <div className='up out-rounded'>
            <input
              aria-label='Fecha para calcular'
              className=' px-5 py-2.5 z-50 rounded-full'
              type='datetime-local'
              defaultValue={date}
              onChange={e => {
                //changeDateFromInput(e.target.value)
                setDate(e.target.value)
              }}
            />
          </div>

          <div className='up out-rounded'>
            <PlanetSelector planet={planet} setPlanet={setPlanet} />
          </div>
        </motion.div>
      )}
      <SettingsMenu key={'SetingsMenu'} />
      <ActionsMenu key={'ActionMenu'} date={changeDateFromInput(date)} />
    </AnimatePresence>
  )
}

export default Controls
