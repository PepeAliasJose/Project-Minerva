import { useLoader } from '@react-three/fiber'
import {
  MERCURY_SIZE,
  SCALE
} from '../../helpers/functions/SolarSystemConstants'
import { TextureLoader, Vector3 } from 'three'
import SkyTag from './SkyTag'
import { memo, useEffect, useState } from 'react'
import {
  changeDateFromInput,
  mercuryCoordinatesGivenDate
} from '../../helpers/functions/astronomicalFunctions'
import { useDate } from '../../App'

const MercurySS = memo(({ Mercury }) => {
  const [mercuryPos, setMercuryPos] = useState([0, 0, 0])
  const Mercury_Texture = new TextureLoader().load('textures/mercury.webp')

  const { date } = useDate()
  const JDday = changeDateFromInput(date)

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

  useEffect(() => {
    updateMercury()
    return () => {
      Mercury_Texture.dispose()
    }
  }, [JDday])

  return (
    <mesh ref={Mercury} frustumCulled={false} position={mercuryPos}>
      <SkyTag name={'Mercurio'} />
      <icosahedronGeometry args={[MERCURY_SIZE / 2, 10]} />
      <meshStandardMaterial map={Mercury_Texture} />
    </mesh>
  )
})

export default MercurySS
