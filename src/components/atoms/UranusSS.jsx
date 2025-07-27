import { memo, useEffect, useRef, useState } from 'react'
import { TextureLoader, Vector3 } from 'three'
import {
  changeDateFromInput,
  uranusCoordinatesGivenDate
} from '../../helpers/functions/astronomicalFunctions'
import {
  SCALE,
  URANUS_SIZE
} from '../../helpers/functions/SolarSystemConstants'
import SkyTag from './SkyTag'
import { useDate } from '../../App'

const UranusSS = memo(({ Uranus }) => {
  const [uranusPos, setUranusPos] = useState([0, 0, 0])

  const UranusLight = useRef()

  const { date } = useDate()
  const JDday = changeDateFromInput(date)

  const shadowRes =
    navigator.userAgent.includes('iPhone') ||
    navigator.userAgent.includes('Android')
      ? 128
      : 1024

  const Uranus_Texture = new TextureLoader().load('textures/uranus.webp')

  function updateUranus () {
    const { L, B, R } = uranusCoordinatesGivenDate(JDday)
    //console.log('URANUS: ', L, -Math.PI / 2 + B, (R * 1.5 * 10 ** 8) / SCALE)
    const u = new Vector3().setFromSphericalCoords(
      (R * 1.5 * 10 ** 8) / SCALE,
      -Math.PI / 2 + B,
      L
    )
    setUranusPos([...u])
    UranusLight.current.position.setFromSphericalCoords(10, Math.PI / 2 + B, L)
  }

  useEffect(() => {
    updateUranus()
    return () => {
      Uranus_Texture.dispose()
    }
  }, [JDday])

  return (
    <mesh ref={Uranus} frustumCulled={false} position={uranusPos}>
      <SkyTag name={'Urano'} color='bg-cyan-100' />
      <pointLight
        ref={UranusLight}
        intensity={300}
        castShadow
        shadow-mapSize-width={shadowRes}
        shadow-mapSize-height={shadowRes}
      />
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[URANUS_SIZE / 2, 20]} />
        <meshStandardMaterial map={Uranus_Texture} />
      </mesh>
    </mesh>
  )
})

export default UranusSS
