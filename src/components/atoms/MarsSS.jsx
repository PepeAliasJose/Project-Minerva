import { memo, useEffect, useState } from 'react'
import { parseLBRToXYZ } from '../../helpers/functions/astronomicalFunctions'
import { MARS_SIZE } from '../../helpers/functions/SolarSystemConstants'
import { TextureLoader } from 'three'
import SkyTag from './SkyTag'
import { usePlanets } from '../../App'

const MarsSS = memo(({ Mars }) => {
  const Mars_Texture = new TextureLoader().load('textures/mars.webp')

  const [marsPos, setMarsPos] = useState([0, 0, 0])

  const { mars } = usePlanets()

  function updateMars () {
    setMarsPos(parseLBRToXYZ(mars))
  }

  useEffect(() => {
    updateMars()
    return () => {
      Mars_Texture.dispose()
    }
  }, [mars])

  return (
    <mesh ref={Mars} frustumCulled={false} position={marsPos}>
      <SkyTag name={'Marte'} color='bg-red-400' />
      <icosahedronGeometry args={[MARS_SIZE / 2, 15]} />
      <meshStandardMaterial map={Mars_Texture} />
    </mesh>
  )
})

export default MarsSS
