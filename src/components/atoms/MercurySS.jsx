import { MERCURY_SIZE } from '../../helpers/functions/SolarSystemConstants'
import { TextureLoader } from 'three'
import SkyTag from './SkyTag'
import { memo, useEffect, useState } from 'react'
import { parseLBRToXYZ } from '../../helpers/functions/astronomicalFunctions'
import { usePlanets } from '../../App'

const MercurySS = memo(({ Mercury }) => {
  const [mercuryPos, setMercuryPos] = useState([0, 0, 0])
  const Mercury_Texture = new TextureLoader().load('textures/mercury.webp')

  const { planets } = usePlanets()

  function updateMercury () {
    setMercuryPos(parseLBRToXYZ(planets.mercury))
  }

  useEffect(() => {
    updateMercury()
    return () => {
      Mercury_Texture.dispose()
    }
  }, [planets])

  return (
    <mesh
      ref={Mercury}
      //frustumCulled={false}
      position={mercuryPos}
    >
      <SkyTag name={'Mercurio'} />
      <icosahedronGeometry args={[MERCURY_SIZE / 2, 10]} />
      <meshStandardMaterial map={Mercury_Texture} />
    </mesh>
  )
})

export default MercurySS
