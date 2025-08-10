import { TextureLoader } from 'three'

import {
  EARTH_SIZE,
  MOON_SIZE
} from '../../helpers/functions/SolarSystemConstants'
import SkyTag from './SkyTag'
import { memo, useEffect, useState } from 'react'
import { usePlanets } from '../../App'

import * as THREE from 'three'

import {
  moonParseLBDToXYZ,
  parseLBRToXYZ
} from '../../helpers/functions/astronomicalFunctions'
import { degreesToRadians } from 'popmotion'
import { Line } from '@react-three/drei'

const EartMoon = memo(({ Earth, Moon }) => {
  const [earthPos, setEarthPos] = useState([0, 0, 0])
  const [moonPos, setMoonPos] = useState([0, 0, 0])

  const { planets } = usePlanets()

  const Earth_Texture = new TextureLoader().load('textures/earth.webp')
  const Earth_Night_Texture = new TextureLoader().load(
    'textures/earth_night.webp'
  )
  const Moon_Texture = new TextureLoader().load('textures/moon.webp')

  function updateMoonRotation (lambda) {
    //Compensa rotacion de la luna + rotacion de la luna - offset para ajustar
    Moon.current.rotation.y = degreesToRadians(lambda) + Math.PI / 2
  }

  useEffect(() => {
    updateMoonRotation(planets.moon.L)
    setEarthPos(parseLBRToXYZ(planets.earth))
    //console.log('EARTH XYZ: ', parseLBRToXYZ(planets.earth))
    setMoonPos(moonParseLBDToXYZ(planets.moon))
    return () => {
      Earth_Texture.dispose()
      Moon_Texture.dispose()
    }
  }, [planets])

  // Rotation: 1 correccion de giro respecto al sol
  // para cuadrar el angulo de inclinacion del eje
  return (
    <mesh ref={Earth} frustumCulled={false} position={earthPos}>
      <mesh
        ref={Moon}
        position={moonPos}
        castShadow
        receiveShadow
        //frustumCulled={false}
      >
        <SkyTag name={'Luna'} top />
        <icosahedronGeometry attach={'geometry'} args={[MOON_SIZE / 2, 12]} />
        <meshStandardMaterial map={Moon_Texture} />
      </mesh>
      <group rotation={[0, -Math.PI / 35, 0]}>
        <mesh
          //frustumCulled={false}
          //correccion de posicion a las 00:00 GMT
          // + giro por hora
          rotation={[0, 0, degreesToRadians(planets.earthObliquity)]}
        >
          <mesh rotation={[0, 0, 0]}>
            <axesHelper args={[0]} />
            <Line
              points={[
                [0, EARTH_SIZE / 1.6, 0],
                [0, -EARTH_SIZE / 1.6, 0]
              ]}
            />
            <SkyTag name={'Tierra'} color='bg-blue-400' />
            <icosahedronGeometry args={[EARTH_SIZE / 2, 15]} />
            <meshStandardMaterial map={Earth_Texture} />
          </mesh>
        </mesh>
      </group>
    </mesh>
  )
})

export default EartMoon

/*
<mesh
  frustumCulled={false}
  receiveShadow
  rotation={[0, planets.earth.L, 0]}
>
  <SkyTag name={'Tierra'} color='bg-blue-400' />
  <icosahedronGeometry args={[EARTH_SIZE / 2, 15]} />
  <meshStandardMaterial
    map={Earth_Texture}
    blending={THREE.AdditiveBlending}
  />
</mesh>
*/
