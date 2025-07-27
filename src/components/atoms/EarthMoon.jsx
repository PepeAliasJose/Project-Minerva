import { TextureLoader, Vector3 } from 'three'

import {
  changeDateFromInput,
  earthCoordinatesGivenDate,
  moonCoordinatesGivenT
} from '../../helpers/functions/astronomicalFunctions'
import {
  EARTH_SIZE,
  MOON_SIZE,
  SCALE
} from '../../helpers/functions/SolarSystemConstants'
import { degreesToRadians } from 'popmotion'
import SkyTag from './SkyTag'
import { memo, useEffect, useState } from 'react'
import { useDate } from '../../App'

const EartMoon = memo(({ Earth, Moon }) => {
  const [earthPos, setEarthPos] = useState([0, 0, 0])
  const [moonPos, setMoonPos] = useState([0, 0, 0])

  const { date } = useDate()
  const JDday = changeDateFromInput(date)

  const Earth_Texture = new TextureLoader().load('textures/earth.webp')
  const Moon_Texture = new TextureLoader().load('textures/moon.webp')

  function updateEarth () {
    const { L, B, R } = earthCoordinatesGivenDate(JDday)
    //console.log('EARTH: ', L, -Math.PI / 2 + B, (R * 1.5 * 10 ** 8) / SCALE)
    const e = new Vector3().setFromSphericalCoords(
      (R * 1.5 * 10 ** 8) / SCALE,
      -Math.PI / 2 + B,
      L
    )
    setEarthPos([...e])

    const { lambda, beta, del } = moonCoordinatesGivenT(JDday)
    //console.log('MOON: ', lambda, beta, del / SCALE)
    const m = new Vector3().setFromSphericalCoords(
      del / SCALE,
      -Math.PI / 2 + degreesToRadians(beta),
      degreesToRadians(lambda)
    )
    setMoonPos([...m])

    //Compensa rotacion de la luna + rotacion de la luna - offset para ajustar
    Moon.current.rotation.y = degreesToRadians(lambda) + Math.PI / 2
    //Actualizar la malla interna de la tierra para compensar el giro
  }

  useEffect(() => {
    updateEarth()
    return () => {
      Earth_Texture.dispose()
      Moon_Texture.dispose()
    }
  }, [JDday])

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
