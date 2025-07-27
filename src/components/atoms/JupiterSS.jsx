import { TextureLoader, Vector3 } from 'three'
import {
  changeDateFromInput,
  jupiterCoordinatesGivenDate
} from '../../helpers/functions/astronomicalFunctions'
import SkyTag from './SkyTag'
import {
  JUPITER_SIZE,
  SCALE
} from '../../helpers/functions/SolarSystemConstants'
import { memo, useEffect, useRef, useState } from 'react'
import { useDate } from '../../App'

const JupiterSS = memo(({ Jupiter }) => {
  const [jupiterPos, setJupiterPos] = useState([0, 0, 0])

  const { date } = useDate()
  const JDday = changeDateFromInput(date)

  const JupiterLight = useRef()
  const Jupiter_Texture = new TextureLoader().load('textures/jupiter.webp')

  //Resolucion de las sombras para dispositivos moviles
  const shadowRes =
    navigator.userAgent.includes('iPhone') ||
    navigator.userAgent.includes('Android')
      ? 128
      : 1024

  function updateJupiter () {
    const { L, B, R } = jupiterCoordinatesGivenDate(JDday)
    //console.log('JUPITER: ', L, -Math.PI / 2 + B, (R * 1.5 * 10 ** 8) / SCALE)
    const j = new Vector3().setFromSphericalCoords(
      (R * 1.5 * 10 ** 8) / SCALE,
      -Math.PI / 2 + B,
      L
    )

    setJupiterPos([...j])
    JupiterLight.current.position.setFromSphericalCoords(10, Math.PI / 2 + B, L)
  }

  useEffect(() => {
    updateJupiter()
    return () => {
      Jupiter_Texture.dispose()
    }
  }, [JDday])

  return (
    <mesh ref={Jupiter} frustumCulled={false} position={jupiterPos}>
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
