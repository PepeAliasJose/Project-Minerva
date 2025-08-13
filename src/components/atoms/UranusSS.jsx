import { memo, useEffect, useRef, useState } from 'react'
import { Texture, TextureLoader } from 'three'
import { parseLBRToXYZ } from '../../helpers/functions/astronomicalFunctions'
import { URANUS_SIZE } from '../../helpers/functions/SolarSystemConstants'
import SkyTag from './SkyTag'
import { usePlanets } from '../../App'

const UranusSS = memo(({ Uranus }) => {
  const [uranusPos, setUranusPos] = useState([0, 0, 0])

  const UranusLight = useRef()

  const { planets } = usePlanets()

  const shadowRes =
    navigator.userAgent.includes('iPhone') ||
    navigator.userAgent.includes('Android')
      ? 128
      : 1024

  const [Uranus_Texture, setTexture] = useState(new Texture())

  function updateUranus () {
    setUranusPos(parseLBRToXYZ(planets.uranus))
    UranusLight.current.position.setFromSphericalCoords(
      10,
      Math.PI / 2 + planets.uranus.B,
      planets.uranus.L
    )
  }
  useEffect(() => {
    setTexture(new TextureLoader().load('textures/uranus.webp'))
    return () => {
      Uranus_Texture.dispose()
    }
  }, [])

  useEffect(() => {
    updateUranus()
  }, [planets])

  return (
    <mesh ref={Uranus} frustumCulled={true} position={uranusPos}>
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
