import { Canvas } from '@react-three/fiber'
import { useState, useLayoutEffect } from 'react'

import { motion } from 'framer-motion'

import { Suspense } from 'react'
import Scene from '../components/organisms/Scene'
import { Stats } from '@react-three/drei'
import IntroTitle from '../components/molecules/IntroTitle'

function SolarSystem () {
  const [fecha, setFecha] = useState('1992-04-12')

  const [planet, setPlanet] = useState('sun')

  const [loaded, setLoaded] = useState(false)

  function changeDateFromInput (value) {
    let time = Date.parse(value)
    time = isNaN(time) ? new Date(fechaPredeterminada) : time
    return time / 86400000 - 60 / 1440 + 2440587.5
  }

  useLayoutEffect(() => {
    console.log('SSSS')
  })

  return (
    <div
      id='solarSystem'
      className='w-screen h-screen transition-colors duration-1000 '
    >
      <Canvas
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100vh' }}
        shadows={true}
      >
        <Stats />
        <Suspense fallback={null}>
          <Scene
            JDday={changeDateFromInput(fecha)}
            planeta={planet}
            load={t => {
              setLoaded(t)
            }}
          />
        </Suspense>
      </Canvas>

      {!loaded && (
        <div
          className='text-2xl text-white 
        fixed top-[50vh] left-[50vw] 
        -translate-x-[50%] -translate-y-[50%]'
        >
          Loading...
        </div>
      )}
      {/*ELEMENTOS ANIMACION ENTRADA*/}
      <IntroTitle loaded={loaded} />
      {/*FIN ELEMENTOS ANIMACION ENTRADA*/}
      {true && (
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
            value={fecha}
            onChange={e => {
              changeDateFromInput(e.target.value)
              setFecha(e.target.value)
            }}
          />
          <select
            className='up out-rounded px-5 py-2.5 z-50'
            value={planet.now}
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
    </div>
  )
}

export default SolarSystem
