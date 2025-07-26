import { useLoader } from '@react-three/fiber'
import {
  MERCURY_SIZE,
  SCALE
} from '../../helpers/functions/SolarSystemConstants'
import { TextureLoader, Vector3 } from 'three'
import SkyTag from './SkyTag'
import { memo, useLayoutEffect, useState } from 'react'
import { mercuryCoordinatesGivenDate } from '../../helpers/functions/astronomicalFunctions'

const MercurySS = memo(({ Mercury, JDday, updateCamera }) => {
  const [mercuryPos, setMercuryPos] = useState([0, 0, 0])
  const Mercury_Texture = new TextureLoader().load('textures/mercury.webp')

  function updateMercury () {
    const { L, B, R } = mercuryCoordinatesGivenDate(JDday)
    //console.log('MERCURY: ', L, -Math.PI / 2 + B, (R * 1.5 * 10 ** 8) / SCALE)
    const m = new Vector3().setFromSphericalCoords(
      (R * 1.5 * 10 ** 8) / SCALE,
      -Math.PI / 2 + B,
      L
    )

    setMercuryPos([...m])
  }

  useLayoutEffect(() => {
    updateMercury()
    return () => {
      Mercury_Texture.dispose()
    }
  }, [JDday])

  useLayoutEffect(() => {
    updateCamera(0)
  }, [mercuryPos])

  return (
    <mesh ref={Mercury} frustumCulled={false} position={mercuryPos}>
      <SkyTag name={'Mercurio'} />
      <icosahedronGeometry args={[MERCURY_SIZE / 2, 10]} />
      <meshStandardMaterial map={Mercury_Texture} />
    </mesh>
  )
})

export default MercurySS
