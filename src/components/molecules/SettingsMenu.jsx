import { AnimatePresence, motion } from 'framer-motion'
import { useConfig, useCustomCamera } from '../../App'
import { useState } from 'react'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Stats } from '@react-three/drei'
import Checker from '../atoms/Checker'

function SettingsMenu () {
  const [show, setShow] = useState(false)
  const [stats, setStats] = useState(false)
  const [anim, setAnim] = useState(false)

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
    auOff,
    localTime,
    setLocalTime
  } = useConfig()

  const { fov, updateFov } = useCustomCamera()

  return (
    <div className='fixed z-[51] top-0 right-0 p-5 overflow-clip  '>
      {stats && <Stats />}
      <Cog6ToothIcon
        className={
          'size-6 transition-all duration-500 z-[51] ease-in-out fixed top-8 right-8 ' +
          (show ? ' -rotate-180 text-white ' : ' text-gray-400 ')
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
              <Checker
                tag={'Usar hora local: '}
                value={localTime}
                setValue={() => {
                  setLocalTime(!localTime)
                }}
              />
            </div>
            <div className='inline-flex gap-2 items-center'>
              <Checker
                tag={'Etiquetas: '}
                value={tags}
                setValue={() => {
                  if (tags) {
                    tagsOff()
                  } else {
                    tagsOn()
                  }
                }}
              />
            </div>
            <div className='inline-flex gap-2 items-center '>
              <Checker
                tag={'Ajustar cámara al cambiar: '}
                value={zoomWhenChange}
                setValue={() => {
                  if (zoomWhenChange) {
                    zoomOff()
                  } else {
                    zoomOn()
                  }
                }}
              />
            </div>
            <div className='inline-flex gap-2 items-center'>
              <Checker
                tag={'Ver controles: '}
                value={controls}
                setValue={() => {
                  if (controls) {
                    controlsOff()
                  } else {
                    controlsOn()
                  }
                }}
              />
            </div>
            <div className='inline-flex gap-2 items-center'>
              <Checker
                tag={'Distancia en ' + (au ? 'ua' : 'km') + ':'}
                value={au}
                setValue={() => {
                  if (au) {
                    auOff()
                  } else {
                    auOn()
                  }
                }}
              />
            </div>
            <div className='inline-flex gap-2 items-center'>
              <Checker
                tag={'Repetir animación inicial: '}
                value={anim}
                setValue={() => {
                  setAnim(!anim)

                  localStorage.setItem(
                    'firstEnter',
                    new Boolean(!anim).toString()
                  )
                }}
              />
            </div>
            <div className='inline-flex gap-2 items-center'>
              <Checker
                tag={'Ver FPS: '}
                value={stats}
                setValue={() => {
                  setStats(!stats)
                }}
              />
            </div>
            <div className='inline-flex gap-2 items-center'>
              <p className='m-2'>FOV:</p>
              <input
                type='text'
                defaultValue={fov}
                onChange={e => {
                  const fov = e.target.value
                  if (fov < 180 && fov > 0) {
                    updateFov(fov)
                  }
                }}
                className='down p-1 px-3 w-14 text-center'
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SettingsMenu
