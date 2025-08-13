import { Texture, TextureLoader } from 'three'
import {
  EARTH_SIZE,
  MOON_SIZE
} from '../../helpers/functions/SolarSystemConstants'
import SkyTag from './SkyTag'
import { memo, useEffect, useState } from 'react'
import { usePlanets } from '../../App'

import {
  degreesToRadians,
  moonParseLBDToXYZ,
  parseLBRToXYZ
} from '../../helpers/functions/astronomicalFunctions'
import EclipseSim from './EclipseSim'

const EartMoon = memo(({ Earth, Moon }) => {
  const [earthPos, setEarthPos] = useState([0, 0, 0])
  const [moonPos, setMoonPos] = useState([0, 0, 0])
  const [Earth_Texture, setE] = useState(new Texture())
  const [Moon_Texture, setM] = useState(new Texture())

  const { planets } = usePlanets()

  function updateMoonRotation (lambda) {
    //Compensa rotacion de la luna + rotacion de la luna - offset para ajustar
    Moon.current.rotation.y = degreesToRadians(lambda) + Math.PI / 2
  }

  useEffect(() => {
    setE(new TextureLoader().load('textures/Earth_full.webp'))
    setM(new TextureLoader().load('textures/moon.webp'))
    return () => {
      Earth_Texture.dispose()
      Moon_Texture.dispose()
    }
  }, [])

  useEffect(() => {
    updateMoonRotation(planets.moon.L)
    setEarthPos(parseLBRToXYZ(planets.earth))
    //console.log('EARTH XYZ: ', parseLBRToXYZ(planets.earth))
    setMoonPos(moonParseLBDToXYZ(planets.moon))
  }, [planets])

  // Rotation: 1 correccion de giro respecto al sol
  // para cuadrar el angulo de inclinacion del eje

  return (
    <mesh ref={Earth} frustumCulled={false} position={earthPos}>
      <mesh
        ref={Moon}
        position={moonPos}
        //receiveShadow
        //castShadow
        //frustumCulled={false}
      >
        <SkyTag name={'Luna'} top />
        <icosahedronGeometry attach={'geometry'} args={[MOON_SIZE / 2, 12]} />
        <meshStandardMaterial map={Moon_Texture} />
      </mesh>

      <group rotation={[0, 0, 0]} receiveShadow>
        <axesHelper
          destino={moonParseLBDToXYZ({
            L: planets.moon.L,
            B: planets.moon.B,
            R: planets.moon.R + 1
          })}
        />
        <mesh
          //frustumCulled={false}
          //correccion de posicion a las 00:00 GMT
          // + giro por hora
          rotation={[0, 0, degreesToRadians(planets.earthObliquity)]}
          receiveShadow
        >
          <mesh
            rotation={[
              0,

              -Math.PI / 2 +
                degreesToRadians(planets.earthRotation) -
                degreesToRadians(planets.earthRotationCompensation) -
                0.017245,
              0
            ]}
            receiveShadow
          >
            <axesHelper args={[0]} />
            <SkyTag name={'Tierra'} color='bg-blue-400' />
            <icosahedronGeometry args={[EARTH_SIZE / 2, 30]} />
            <meshStandardMaterial map={Earth_Texture} />
          </mesh>
        </mesh>
      </group>
    </mesh>
  )
})

export default EartMoon
