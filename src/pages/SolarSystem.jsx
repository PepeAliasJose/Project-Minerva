import { Canvas } from '@react-three/fiber'
import { useState, useLayoutEffect } from 'react'

import { Suspense } from 'react'
import Scene from '../components/organisms/Scene'
import { Stats } from '@react-three/drei'
import IntroTitle from '../components/molecules/IntroTitle'
import Controls from '../components/organisms/Controls'

function SolarSystem () {
  const [loaded, setLoaded] = useState(false)

  useLayoutEffect(() => {
    console.log('Render SolarSystemPage')
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
      <Controls />
    </div>
  )
}

export default SolarSystem
