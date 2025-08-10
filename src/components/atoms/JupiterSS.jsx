import { TextureLoader } from 'three'
import { parseLBRToXYZ } from '../../helpers/functions/astronomicalFunctions'
import SkyTag from './SkyTag'
import { JUPITER_SIZE } from '../../helpers/functions/SolarSystemConstants'
import { memo, useEffect, useRef, useState } from 'react'
import { usePlanets } from '../../App'

const JupiterSS = memo(({ Jupiter }) => {
  const [jupiterPos, setJupiterPos] = useState([0, 0, 0])

  const { planets } = usePlanets()

  const JupiterLight = useRef()
  const Jupiter_Texture = new TextureLoader().load('textures/jupiter.webp')

  //Resolucion de las sombras para dispositivos moviles
  const shadowRes =
    navigator.userAgent.includes('iPhone') ||
    navigator.userAgent.includes('Android')
      ? 128
      : 1024

  function updateJupiter () {
    setJupiterPos(parseLBRToXYZ(planets.jupiter))
    JupiterLight.current.position.setFromSphericalCoords(
      10,
      Math.PI / 2 + planets.jupiter.B,
      planets.jupiter.L
    )
  }

  useEffect(() => {
    updateJupiter()
    return () => {
      Jupiter_Texture.dispose()
    }
  }, [planets])

  return (
    <mesh
      ref={Jupiter}
      //frustumCulled={false}
      position={jupiterPos}
    >
      <SkyTag name={'Jupiter'} color='bg-orange-400' />
      <pointLight
        ref={JupiterLight}
        intensity={300}
        castShadow
        shadow-mapSize-width={shadowRes}
        shadow-mapSize-height={shadowRes}
      />
      <mesh castShadow receiveShadow frustumCulled={false}>
        <icosahedronGeometry args={[JUPITER_SIZE / 2, 20]} />
        <meshStandardMaterial map={Jupiter_Texture} />
      </mesh>
    </mesh>
  )
})

export default JupiterSS
