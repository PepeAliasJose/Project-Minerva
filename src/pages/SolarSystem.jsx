import { Canvas } from '@react-three/fiber'
import { useState, useLayoutEffect, useEffect, useRef } from 'react'

import { Suspense } from 'react'
import Scene from '../components/organisms/Scene'
import IntroTitle from '../components/molecules/IntroTitle'
import Controls from '../components/organisms/Controls'
import { Bars3Icon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

import SettingsMenu from '../components/molecules/SettingsMenu'
import ActionsMenu from '../components/molecules/ActionsMenu'

//TODO: Sombra de eclipse, rotacion de la tierra, posicionamiento en superficie, ajustes

function SolarSystem() {
  const [load, setLoad] = useState(false)
  const canvas = useRef()

  useLayoutEffect(() => {
    console.log('Render SolarSystemPage')
  })

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (e.code == 'KeyR') {
        console.log('Captura')
        var data = canvas.current.toDataURL()
        console.log(data)
      }
    })
  }, [])

  const none = (e) => {
    e.preventDefault()
  }
  useEffect(() => {
    window.addEventListener('contextmenu', (event) => {
      event.preventDefault()
    })
    return () => {
      window.removeEventListener('contextmenu', none)
    }
  }, [])

  return (
    <>
      <SettingsMenu key={'SetingsMenu'} />
      <ActionsMenu key={'ActionMenu'} />

      <div
        id='solarSystem'
        className='w-full h-screen transition-colors duration-1000 
          relative bg-black overflow-clip'
      >
        <Canvas
          ref={canvas}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
          style={{ width: '100%', height: '100svh' }}
          shadows={true}
        >
          <Suspense>
            <Scene load={setLoad} />
          </Suspense>
        </Canvas>

        {!load && (
          <div
            className='text-2xl text-white fixed top-[50vh] left-[50vw]
              -translate-x-[50%] -translate-y-[50%]'
          >
            Cargando ...
          </div>
        )}
        {load && <IntroTitle />}

        <Controls />
      </div>
      <div className='fixed top-7 left-7 hidden'>
        <Link to={'/info'}>
          <div className='hover:cursor-pointer  '>
            <InformationCircleIcon className='size-6 text-gray-400' />
          </div>
        </Link>
      </div>
    </>
  )
}

export default SolarSystem
