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

const EartMoon = memo(({ Earth, Moon }) => {
  const [earthPos, setEarthPos] = useState([0, 0, 0])
  const [moonPos, setMoonPos] = useState([0, 0, 0])

  const { earth, moon } = usePlanets()

  const Earth_Texture = new TextureLoader().load('textures/earth.webp')
  const Moon_Texture = new TextureLoader().load('textures/moon.webp')

  function updateMoonRotation (lambda) {
    //Compensa rotacion de la luna + rotacion de la luna - offset para ajustar
    Moon.current.rotation.y = degreesToRadians(lambda) + Math.PI / 1.8
  }

  useEffect(() => {
    updateMoonRotation(moon.L)
    setEarthPos(parseLBRToXYZ(earth))
    setMoonPos(moonParseLBDToXYZ(moon))
    return () => {
      Earth_Texture.dispose()
      Moon_Texture.dispose()
    }
  }, [earth, moon])

  return (
    <mesh ref={Earth} frustumCulled={false} position={earthPos}>
      <mesh
        ref={Moon}
        position={moonPos}
        castShadow
        receiveShadow
        frustumCulled={false}
      >
        <SkyTag name={'Luna'} top />
        <icosahedronGeometry attach={'geometry'} args={[MOON_SIZE / 2, 8]} />
        <meshStandardMaterial map={Moon_Texture} />
      </mesh>
      <mesh frustumCulled={false}>
        <SkyTag name={'Tierra'} color='bg-blue-400' />
        <icosahedronGeometry args={[EARTH_SIZE / 2, 15]} />
        <meshStandardMaterial map={Earth_Texture} />
      </mesh>
    </mesh>
  )
})

export default EartMoon
