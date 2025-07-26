import { memo, useLayoutEffect, useRef, useState } from 'react'
import { TextureLoader, Vector3 } from 'three'
import { neptuneCoordinatesGivenDate } from '../../helpers/functions/astronomicalFunctions'
import {
  NEPTUNE_SIZE,
  SCALE
} from '../../helpers/functions/SolarSystemConstants'
import SkyTag from './SkyTag'

const NeptuneSS = memo(({ Neptune, JDday, updateCamera }) => {
  const [neptunePos, setNeptunePos] = useState([0, 0, 0])
  const NeptuneLight = useRef()
  const Neptune_Texture = new TextureLoader().load('textures/neptune.webp')

  //Resolucion de las sombras para dispositivos moviles
  const shadowRes =
    navigator.userAgent.includes('iPhone') ||
    navigator.userAgent.includes('Android')
      ? 128
      : 1024

  function updateNeptune () {
    const { L, B, R } = neptuneCoordinatesGivenDate(JDday)
    //console.log('NEPTUNE: ', L, -Math.PI / 2 + B, (R * 1.5 * 10 ** 8) / SCALE)
    const n = new Vector3().setFromSphericalCoords(
      (R * 1.5 * 10 ** 8) / SCALE,
      -Math.PI / 2 + B,
      L
    )
    setNeptunePos([...n])

    NeptuneLight.current.position.setFromSphericalCoords(10, Math.PI / 2 + B, L)
  }

  useLayoutEffect(() => {
    updateNeptune()
    return () => {
      Neptune_Texture.dispose()
    }
  }, [JDday])

  useLayoutEffect(() => {
    updateCamera(0)
  }, [neptunePos])

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
