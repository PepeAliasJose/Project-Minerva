import { TextureLoader } from 'three'
import {
  changeDateFromInput,
  saturnCoordinatesGivenDate
} from '../../helpers/functions/astronomicalFunctions'
import {
  SATURN_INNER_RING_SIZE,
  SATURN_OUTTER_RING_SIZE,
  SATURN_SIZE,
  SCALE
} from '../../helpers/functions/SolarSystemConstants'
import { memo, useEffect, useRef, useState } from 'react'
import SkyTag from './SkyTag'

import * as THREE from 'three'
import { useDate } from '../../App'

const SaturnSS = memo(({ Saturn }) => {
  const [saturnPos, setSaturnPos] = useState([0, 0, 0])
  const [saturnRot, setSaturnRot] = useState([0, 0, 0])

  const { date } = useDate()
  const JDday = changeDateFromInput(date)

  const SaturnLight = useRef()
  const SaturnRings = useRef()

  const shadowRes =
    navigator.userAgent.includes('iPhone') ||
    navigator.userAgent.includes('Android')
      ? 128
      : 1024
  const Saturn_Texture = new TextureLoader().load('textures/saturn.webp')
  const Saturn_Ring_Texture = new TextureLoader().load(
    'textures/saturn_ring.webp'
  )

  function updateSaturn () {
    const { L, B, R } = saturnCoordinatesGivenDate(JDday)
    //console.log('SATURN: ', L, -Math.PI / 2 + B, (R * 1.5 * 10 ** 8) / SCALE)
    const s = new THREE.Vector3().setFromSphericalCoords(
      (R * 1.5 * 10 ** 8) / SCALE,
      -Math.PI / 2 + B,
      L
    )
    setSaturnPos([...s])

    //Saturn.current.rotation.y = L
    setSaturnRot([0, L, 0])
    //   SaturnBody.current.rotation.x =
    SaturnLight.current.position.setFromSphericalCoords(10, Math.PI / 2 - B, 0)
  }

  useEffect(() => {
    updateSaturn()
  }, [JDday])

  useEffect(() => {
    //Arreglar las texturas del anillo
    let pos = SaturnRings.current.geometry.attributes.position
    let uvAttribute = SaturnRings.current.geometry.attributes.uv
    var v3 = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      //Calcular la posicion de este vector respecto al centro del planeta
      v3.fromBufferAttribute(pos, i)
      //Si la posicion X del vector esta por debajo de la mitad del anillo
      //  moverla al interior (0) si no, al exterior (1)
      uvAttribute.setXY(
        i,
        v3.length() < SATURN_OUTTER_RING_SIZE - SATURN_INNER_RING_SIZE ? 0 : 1,
        1
      )
    }
    return () => {
      Saturn_Texture.dispose()
      Saturn_Ring_Texture.dispose()
    }
  }, [])

  return (
    <mesh
      ref={Saturn}
      frustumCulled={false}
      position={saturnPos}
      rotation={saturnRot}
    >
      <SkyTag name={'Saturno'} color='bg-yellow-200' />
      <pointLight
        ref={SaturnLight}
        intensity={250}
        castShadow
        shadow-mapSize-width={shadowRes}
        shadow-mapSize-height={shadowRes}
      />

      <mesh frustumCulled={false} rotation={[Math.PI / 12, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} ref={SaturnRings} receiveShadow>
          <ringGeometry
            args={[
              SATURN_INNER_RING_SIZE / 2,
              SATURN_OUTTER_RING_SIZE / 2,
              128
            ]}
          />
          <meshStandardMaterial
            side={THREE.DoubleSide}
            map={Saturn_Ring_Texture}
            transparent={true}
          />
        </mesh>
        <mesh castShadow receiveShadow frustumCulled={false}>
          <icosahedronGeometry args={[SATURN_SIZE / 2, 20]} />
          <meshStandardMaterial map={Saturn_Texture} transparent={false} />
        </mesh>
      </mesh>
    </mesh>
  )
})

export default SaturnSS
