import { memo, useEffect, useRef, useState } from 'react'
import { TextureLoader } from 'three'
import { parseLBRToXYZ } from '../../helpers/functions/astronomicalFunctions'
import { NEPTUNE_SIZE } from '../../helpers/functions/SolarSystemConstants'
import SkyTag from './SkyTag'
import { usePlanets } from '../../App'

const NeptuneSS = memo(({ Neptune }) => {
  const [neptunePos, setNeptunePos] = useState([0, 0, 0])
  const NeptuneLight = useRef()
  const Neptune_Texture = new TextureLoader().load('textures/neptune.webp')

  const { neptune } = usePlanets()

  //Resolucion de las sombras para dispositivos moviles
  const shadowRes =
    navigator.userAgent.includes('iPhone') ||
    navigator.userAgent.includes('Android')
      ? 128
      : 1024

  function updateNeptune () {
    setNeptunePos(parseLBRToXYZ(neptune))
    NeptuneLight.current.position.setFromSphericalCoords(
      10,
      Math.PI / 2 + neptune.B,
      neptune.L
    )
  }

  useEffect(() => {
    updateNeptune()
    return () => {
      Neptune_Texture.dispose()
    }
  }, [neptune])

  return (
    <mesh ref={Neptune} frustumCulled={false} position={neptunePos}>
      <SkyTag name={'Neptuno'} color='bg-blue-500' />
      <pointLight
        ref={NeptuneLight}
        intensity={300}
        castShadow
        shadow-mapSize-width={shadowRes}
        shadow-mapSize-height={shadowRes}
      />
      <mesh castShadow receiveShadow frustumCulled={false}>
        <icosahedronGeometry args={[NEPTUNE_SIZE / 2, 20]} />
        <meshStandardMaterial map={Neptune_Texture} />
      </mesh>
    </mesh>
  )
})

export default NeptuneSS
