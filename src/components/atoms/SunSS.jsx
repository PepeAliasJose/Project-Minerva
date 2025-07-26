import { useLoader } from '@react-three/fiber'
import { SUN_SIZE } from '../../helpers/functions/SolarSystemConstants'
import { TextureLoader } from 'three'
import SkyTag from './SkyTag'
import { useEffect } from 'react'

function SunSS ({ Sun }) {
  const Sun_Texture = new TextureLoader().load('textures/sun.webp')

  useEffect(() => {
    return () => {
      Sun_Texture.dispose()
    }
  }, [])

  return (
    <mesh ref={Sun} frustumCulled={false}>
      <SkyTag name={'Sol'} color={'bg-yellow-800'} top big />
      <icosahedronGeometry args={[SUN_SIZE / 2, 20]} />
      <meshPhysicalMaterial
        emissiveMap={Sun_Texture}
        emissive={'white'}
        emissiveIntensity={1}
        transparent={false}
      />
    </mesh>
  )
}

export default SunSS
