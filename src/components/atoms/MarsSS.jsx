import { memo, useLayoutEffect, useState } from 'react'
import { marsCoordinatesGivenDate } from '../../helpers/functions/astronomicalFunctions'
import { MARS_SIZE, SCALE } from '../../helpers/functions/SolarSystemConstants'
import { TextureLoader, Vector3 } from 'three'
import SkyTag from './SkyTag'

const MarsSS = memo(({ Mars, JDday, updateCamera }) => {
  const Mars_Texture = new TextureLoader().load('textures/mars.webp')

  const [marsPos, setMarsPos] = useState([0, 0, 0])

  function updateMars () {
    const { L, B, R } = marsCoordinatesGivenDate(JDday)
    //console.log('MARS: ', L, -Math.PI / 2 + B, (R * 1.5 * 10 ** 8) / SCALE)
    const m = new Vector3().setFromSphericalCoords(
      (R * 1.5 * 10 ** 8) / SCALE,
      -Math.PI / 2 + B,
      L
    )
    setMarsPos([...m])
  }

  useLayoutEffect(() => {
    updateMars()
    return () => {
      Mars_Texture.dispose()
    }
  }, [JDday])

  useLayoutEffect(() => {
    updateCamera(0)
  }, [marsPos])
  return (
    <mesh ref={Mars} frustumCulled={false} position={marsPos}>
      <SkyTag name={'Marte'} color='bg-red-400' />
      <icosahedronGeometry args={[MARS_SIZE / 2, 15]} />
      <meshStandardMaterial map={Mars_Texture} />
    </mesh>
  )
})

export default MarsSS
