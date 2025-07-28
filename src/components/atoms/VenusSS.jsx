import { memo, useEffect, useState } from 'react'
import {
  changeDateFromInput,
  parseLBRToXYZ,
  venusCoordinatesGivenDate
} from '../../helpers/functions/astronomicalFunctions'
import { TextureLoader, Vector3 } from 'three'

import { SCALE, VENUS_SIZE } from '../../helpers/functions/SolarSystemConstants'
import SkyTag from './SkyTag'
import { usePlanets } from '../../App'

const VenusSS = memo(({ Venus }) => {
  const [venusPos, setVenusPos] = useState([0, 0, 0])
  const Venus_Texture = new TextureLoader().load('textures/venus.webp')

  const { venus } = usePlanets()

  function updateVenus () {
    setVenusPos(parseLBRToXYZ(venus))
  }

  useEffect(() => {
    updateVenus()
    return () => {
      Venus_Texture.dispose()
    }
  }, [venus])

  return (
    <mesh ref={Venus} frustumCulled={false} position={venusPos}>
      <SkyTag name={'Venus'} color='bg-orange-400' />
      <icosahedronGeometry args={[VENUS_SIZE / 2, 10]} />
      <meshStandardMaterial map={Venus_Texture} />
    </mesh>
  )
})

export default VenusSS
