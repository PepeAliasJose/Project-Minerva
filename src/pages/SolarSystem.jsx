import { Canvas } from '@react-three/fiber'
import { useState, useLayoutEffect } from 'react'

import { Suspense } from 'react'
import Scene from '../components/organisms/Scene'
import IntroTitle from '../components/molecules/IntroTitle'
import Controls from '../components/organisms/Controls'
import { Html } from '@react-three/drei'

function SolarSystem () {
  const [load, setLoad] = useState(false)

  useLayoutEffect(() => {
    console.log('Render SolarSystemPage')
  })

  return (
    <div
      id='solarSystem'
      className='w-screen h-[100svh] transition-colors duration-1000 '
    >
      <Canvas
        gl={{ antialias: true, alpha: true }}
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
          Loading...
        </div>
      )}
      {load && <IntroTitle />}
      {/*FIN ELEMENTOS ANIMACION ENTRADA*/}
      <Controls />
    </div>
  )
}

export default SolarSystem
