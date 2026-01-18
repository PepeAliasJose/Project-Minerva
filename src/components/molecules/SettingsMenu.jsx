import { useCustomCamera } from '../../App'
import { useRef, useState } from 'react'
import { Cog6ToothIcon } from '@heroicons/react/24/solid'
import { Stats } from '@react-three/drei'
import Checker from '../atoms/Checker'
import useConfig from '../../state/useConfig'

function SettingsMenu() {
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
    <>
      <Cog6ToothIcon
        className={`fixed right-2 top-2 size-7 z-60 hover:cursor-pointer 
          transition-all duration-300 ease-in-out 
          text-neutral-500 m-2.5 ${show && '-rotate-180 text-white'}`}
        onClick={() => {
          setShow(!show)
        }}
      />
      {stats && <Stats className='mt-[calc(100dvh-40px)]' />}
      <div
        className={` mx-2 md:w-80 fixed top-2 right-0 z-55
          transition-all duration-300 up out-rounded p-1
          ${!show && ' opacity-0 -translate-y-[150%]'}`}
      >
        <div
          ref={menu}
          className='flex flex-col select-none 
            md:h-fit overflow-y-clip hide-scroll '
        >
          <div className='m-2 text-xl font-semibold text-center '>Ajustes</div>
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
            <div
              className='inline-flex gap-2 items-center justify-between w-full
              bg-neutral-700 px-2 pr-1 m-1  rounded-full'
            >
              <p className='m-2'>FOV:</p>
              <input
                type='text'
                defaultValue={fov}
                onChange={(e) => {
                  const fov = e.target.value
                  if (fov < 180 && fov > 0) {
                    updateFov(fov)
                  }
                }}
                className='down p-1 px-0 w-14 text-center'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingsMenu
