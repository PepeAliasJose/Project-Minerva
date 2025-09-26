import { AnimatePresence, easeIn, motion } from 'framer-motion'
import { useConfig, useCustomCamera } from '../../App'
import { useRef, useState } from 'react'
import { Cog6ToothIcon } from '@heroicons/react/24/solid'
import { Stats } from '@react-three/drei'
import Checker from '../atoms/Checker'
import { XMarkIcon } from '@heroicons/react/24/outline'

function SettingsMenu () {
  const [show, setShow] = useState(false)
  const [stats, setStats] = useState(false)
  const [anim, setAnim] = useState(false)

  const menu = useRef()

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
    <motion.div
      initial={{ opacity: 0, width: '3rem', height: '3rem' }}
      animate={{
        opacity: 1,
        width: show ? menu.current.offsetWidth : '3rem',
        height: show ? menu.current.offsetHeight : '3rem',
        translateY: show ? ['0px', '50px', '0px'] : ['0px', '40px', '0px'],
        //translateY: !show ? ['0px', '26px', '0px'] : '0px',
        borderRadius: show ? '40px' : '25px'
      }}
      transition={{
        duration: 0.25,
        ease: 'easeInOut',
        translateY: { duration: 0.3, ease: 'easeOut' },
        opacity: { duration: 0.1, delay: 0.4, ease: 'easeIn' }
      }}
      className='fixed z-[51] top-4 md:top-6 right-4 overflow-clip 
       w-[calc(100vw-40px)] md:w-80  up out-rounded'
    >
      {stats && <Stats className='mt-[calc(100dvh-40px)]' />}

      {!show && (
        <motion.div
          initial={{ opacity: 0, transition: { duration: 0 } }}
          animate={{
            opacity: 1,
            transition: { duration: 0.2, ease: 'easeIn' }
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.1, ease: 'easeIn' }
          }}
          className='absolute right-0 z-10'
        >
          <Cog6ToothIcon
            className=' size-7 
        hover:cursor-pointer transition-all duration-500 
        z-[49] ease-in-out text-white m-2.5'
            onClick={() => {
              setShow(true)
            }}
          />
        </motion.div>
      )}
      {show && (
        <motion.div
          initial={{ opacity: 0, transition: { duration: 0 } }}
          animate={{
            opacity: 1,
            transition: { duration: 0.2, ease: 'easeIn', delay: 0.3 }
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.1, ease: 'easeIn' }
          }}
          className='absolute right-0 z-10'
        >
          <XMarkIcon
            className=' size-7 
        hover:cursor-pointer transition-all duration-500 
        z-[49] ease-in-out text-white m-3.5'
            onClick={() => {
              setShow(false)
            }}
          />
        </motion.div>
      )}

      <motion.div
        ref={menu}
        initial={{ opacity: 0 }}
        animate={{
          opacity: show ? 1 : 0,
          filter: show ? 'blur(0px)' : 'blur(10px)'
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className='flex flex-col w-[calc(100vw-32px)]
       md:w-80 max-h-[calc(100svh-40px)] md:h-fit overflow-y-clip 
       hide-scroll p-2 pb-4'
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

              localStorage.setItem('firstEnter', new Boolean(!anim).toString())
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
          <div
            className='inline-flex gap-2 items-center justify-between w-full
              bg-neutral-700 px-2 pr-1 m-1  rounded-full'
          >
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
              className='down p-1 px-0 w-14 text-center'
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SettingsMenu
