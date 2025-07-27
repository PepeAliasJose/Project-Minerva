import { AnimatePresence, motion } from 'framer-motion'
import { useConfig, useDate, usePlanet } from '../../App'
import { useEffect, useState } from 'react'

function Controls ({}) {
  const { controls } = useConfig()
  const { setPlanet, planet } = usePlanet()
  const { date, setDate } = useDate()

  return (
    <AnimatePresence>
      {controls && (
        <motion.div
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
          className='absolute bottom-10 sm:bottom-15 left-0 w-full justify-center 
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
  const [show, setShow] = useState(true)
  return <motion.div></motion.div>
}

export default Controls
