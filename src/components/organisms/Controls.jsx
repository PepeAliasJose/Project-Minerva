import { AnimatePresence, motion } from 'framer-motion'
import { useConfig, useDate, usePlanet } from '../../App'
import { useEffect, useState } from 'react'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Stats } from '@react-three/drei'

function Controls ({}) {
  const { controls } = useConfig()
  const { setPlanet, planet } = usePlanet()
  const { date, setDate } = useDate()

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
