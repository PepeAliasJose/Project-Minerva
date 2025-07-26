import { memo, useLayoutEffect, useState } from 'react'
import { venusCoordinatesGivenDate } from '../../helpers/functions/astronomicalFunctions'
import { TextureLoader, Vector3 } from 'three'

import { SCALE, VENUS_SIZE } from '../../helpers/functions/SolarSystemConstants'
import SkyTag from './SkyTag'

const VenusSS = memo(({ Venus, JDday, updateCamera }) => {
  const [venusPos, setVenusPos] = useState([0, 0, 0])
  const Venus_Texture = new TextureLoader().load('textures/venus.webp')
  function updateVenus () {
    const { L, B, R } = venusCoordinatesGivenDate(JDday)
    //console.log('VENUS: ', L, -Math.PI / 2 + B, (R * 1.5 * 10 ** 8) / SCALE)
    const v = new Vector3().setFromSphericalCoords(
      (R * 1.5 * 10 ** 8) / SCALE,
      -Math.PI / 2 + B,
      L
    )

    setVenusPos([...v])
  }

  useLayoutEffect(() => {
    updateVenus()
    return () => {
      Venus_Texture.dispose()
    }
  }, [JDday])

  useLayoutEffect(() => {
    updateCamera(0)
  }, [venusPos])

  return (
    <mesh ref={Venus} frustumCulled={false} position={venusPos}>
      <SkyTag name={'Venus'} color='bg-orange-400' />
      <icosahedronGeometry args={[VENUS_SIZE / 2, 10]} />
      <meshStandardMaterial map={Venus_Texture} />
    </mesh>
  )
})

export default VenusSS
