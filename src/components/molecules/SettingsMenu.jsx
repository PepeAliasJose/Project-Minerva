import { AnimatePresence, motion } from 'framer-motion'
import { useConfig } from '../../App'
import { useState } from 'react'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Stats } from '@react-three/drei'

function SettingsMenu () {
  const [show, setShow] = useState(false)
  const [stats, setStats] = useState(false)

  const {
    tags,
    tagsOn,
    tagsOff,
    controls,
    controlsOn,
    controlsOff,
    zoomWhenChange,
    zoomOn,
    zoomOff,
    au,
    auOn,
    auOff
  } = useConfig()

  return (
    <div className='fixed z-[51] top-0 right-0 p-5 overflow-clip  '>
      {stats && <Stats />}
      <Cog6ToothIcon
        className={
          'size-6 transition-all duration-500 z-[51] ease-in-out fixed top-8 right-8 ' +
          (show && ' -rotate-180 ')
        }
        onClick={() => {
          setShow(!show)
        }}
      />
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ translateX: '120%' }}
            animate={{ translateX: '0%' }}
            exit={{ translateX: '120%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className='flex flex-col w-[calc(100vw-40px)]
       md:w-80 h-[calc(100svh-40px)] overflow-y-scroll 
       hide-scroll up out-rounded p-2 pb-4'
          >
            <div className='m-2 font-semibold text-center'>Ajustes</div>
            <div className='inline-flex gap-2 items-center'>
              <p className='m-2 '>Etiquetas: </p>
              <input
                aria-label='Ver etiquetas'
                type='checkbox'
                checked={tags}
                onChange={() => {
                  if (tags) {
                    tagsOff()
                  } else {
                    tagsOn()
                  }
                }}
              />
            </div>
            <div className='inline-flex gap-2 items-center '>
              <p className='m-2'>Ajustar camara al cambiar: </p>
              <input
                aria-label='Ajustar la camara al cambiar '
                type='checkbox'
                checked={zoomWhenChange}
                onChange={() => {
                  if (zoomWhenChange) {
                    zoomOff()
                  } else {
                    zoomOn()
                  }
                }}
              />
            </div>
            <div className='inline-flex gap-2 items-center'>
              <p className='m-2'>Ver controles: </p>
              <input
                aria-label='Ver controles'
                type='checkbox'
                checked={controls}
                onChange={() => {
                  if (controls) {
                    controlsOff()
                  } else {
                    controlsOn()
                  }
                }}
              />
            </div>
            <div className='inline-flex gap-2 items-center'>
              <p className='m-2'>Distancia en {au ? 'AU' : 'KM'}: </p>
              <input
                aria-label='Cambiar unidad de distancia'
                type='checkbox'
                checked={au}
                onChange={() => {
                  if (au) {
                    auOff()
                  } else {
                    auOn()
                  }
                }}
              />
            </div>
            <div className='inline-flex gap-2 items-center'>
              <p className='m-2'>Animación en siguiente carga: </p>
            </div>
            <div className='inline-flex gap-2 items-center'>
              <p className='m-2'>Estadisticas de rendimiento: </p>
              <input
                aria-label='Estadisticas de rendimiento'
                type='checkbox'
                checked={stats}
                onChange={() => {
                  setStats(!stats)
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SettingsMenu
