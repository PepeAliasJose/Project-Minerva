import { Canvas } from '@react-three/fiber'
import { useState, useLayoutEffect, useEffect, useRef } from 'react'

import { Suspense } from 'react'
import Scene from '../components/organisms/Scene'
import IntroTitle from '../components/molecules/IntroTitle'
import Controls from '../components/organisms/Controls'
import { Fisheye, Html } from '@react-three/drei'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

//TODO: Sombra de eclipse, rotacion de la tierra, posicionamiento en superficie, ajustes

function SolarSystem () {
  const [load, setLoad] = useState(false)
  const canvas = useRef()

  useLayoutEffect(() => {
    console.log('Render SolarSystemPage')
  })

  useEffect(() => {
    window.addEventListener('keydown', e => {
      if (e.code == 'KeyR') {
        console.log('Captura')
        var data = canvas.current.toDataURL()
        console.log(data)
      }
    })
  }, [])

  const none = e => {
    e.preventDefault()
  }
  useEffect(() => {
    window.addEventListener('contextmenu', event => {
      event.preventDefault()
    })
    return () => {
      window.removeEventListener('contextmenu', none)
    }
  }, [])

  return (
    <>
      <div
        id='solarSystem'
        className='w-screen h-[100svh] transition-colors duration-1000 '
      >
        <Canvas
          ref={canvas}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
          style={{ width: 'full', height: '100svh' }}
          shadows={true}
        >
          <Suspense>
            <Html position={[0, 0, 0]} center></Html>
            <Scene load={setLoad} />
          </Suspense>
        </Canvas>
        {/*ELEMENTOS ANIMACION ENTRADA*/}
        {!load && (
          <div
            className='text-2xl text-white 
        fixed top-[50vh] left-[50vw]
        -translate-x-[50%] -translate-y-[50%]'
          >
            Cargando ...
          </div>
        )}
        {load && <IntroTitle />}
        {/*FIN ELEMENTOS ANIMACION ENTRADA*/}
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
