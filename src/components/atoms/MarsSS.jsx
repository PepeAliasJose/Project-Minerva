import { memo, useEffect, useState } from 'react'
import { parseLBRToXYZ } from '../../helpers/functions/astronomicalFunctions'
import { MARS_SIZE } from '../../helpers/functions/SolarSystemConstants'
import { Texture, TextureLoader } from 'three'
import SkyTag from './SkyTag'
import { usePlanets } from '../../App'

const MarsSS = memo(({ Mars }) => {
  const [Mars_Texture, setTexture] = useState(new Texture())

  const [marsPos, setMarsPos] = useState([0, 0, 0])

  const { planets } = usePlanets()

  function updateMars () {
    setMarsPos(parseLBRToXYZ(planets.mars))
  }

  useEffect(() => {
    setTexture(new TextureLoader().load('textures/mars.webp'))
    return () => {
      Mars_Texture.dispose()
    }
  }, [])

  useEffect(() => {
    updateMars()
  }, [planets])

  return (
    <mesh
      ref={Mars}
      //frustumCulled={false}
      position={marsPos}
    >
      <SkyTag name={'Marte'} color='bg-red-400' />
      <icosahedronGeometry args={[MARS_SIZE / 2, 15]} />
      <meshStandardMaterial map={Mars_Texture} />
    </mesh>
  )
})

export default MarsSS
