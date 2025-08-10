import { memo, useEffect, useState } from 'react'
import { parseLBRToXYZ } from '../../helpers/functions/astronomicalFunctions'
import { TextureLoader } from 'three'

import { VENUS_SIZE } from '../../helpers/functions/SolarSystemConstants'
import SkyTag from './SkyTag'
import { usePlanets } from '../../App'

const VenusSS = memo(({ Venus }) => {
  const [venusPos, setVenusPos] = useState([0, 0, 0])
  const Venus_Texture = new TextureLoader().load('textures/venus.webp')

  const { planets } = usePlanets()

  function updateVenus () {
    setVenusPos(parseLBRToXYZ(planets.venus))
  }

  useEffect(() => {
    updateVenus()
    return () => {
      Venus_Texture.dispose()
    }
  }, [planets])

  return (
    <mesh ref={Venus} frustumCulled={true} position={venusPos}>
      <SkyTag name={'Venus'} color='bg-orange-400' />
      <icosahedronGeometry args={[VENUS_SIZE / 2, 10]} />
      <meshStandardMaterial map={Venus_Texture} />
    </mesh>
  )
})

export default VenusSS
