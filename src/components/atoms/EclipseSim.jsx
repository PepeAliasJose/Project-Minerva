import { useEclipse, usePlanets } from '../../App'
import {
  moonParseLBDToXYZ,
  parseLBRToXYZ
} from '../../helpers/functions/astronomicalFunctions'
import { Line } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { MOON_SIZE } from '../../helpers/functions/SolarSystemConstants'

function EclipseSim () {
  const { eclip } = useEclipse()
  return <>{eclip && <Eclipse />}</>
}

function Eclipse () {
  const { planets } = usePlanets()

  const earth = parseLBRToXYZ(planets.earth)
  const moon = moonParseLBDToXYZ(planets.moon)

  //Moon position [x,y,z] in scene
  const moonPos = [earth[0] + moon[0], earth[1] + moon[1], earth[2] + moon[2]]

  const destino = new THREE.Spherical().setFromCartesianCoords(...moonPos)

  const t = new THREE.Vector3().setFromSphericalCoords(
    destino.radius + 1.35,
    destino.phi,
    destino.theta
  )

  const target = useRef()
  const light = useRef()
  //useHelper(light, THREE.SpotLightHelper, 'cyan')

  useEffect(() => {
    light.current.target = target.current
  }, [])

  return (
    <>
      <object3D
        ref={target}
        position={[
          ...new THREE.Vector3().setFromSphericalCoords(
            destino.radius + 2,
            destino.phi,
            destino.theta
          )
        ]}
      />
      <Line
        color={'cyan'}
        points={[[moonPos[0], moonPos[1] + MOON_SIZE / 2, moonPos[2]], [...t]]}
      />
      <Line
        color={'cyan'}
        points={[[moonPos[0], moonPos[1] - MOON_SIZE / 2, moonPos[2]], [...t]]}
      />
      <Line
        color={'cyan'}
        points={[[moonPos[0], moonPos[1], moonPos[2]], [...t]]}
      />
      <spotLight
        ref={light}
        position={[
          ...new THREE.Vector3().setFromSphericalCoords(
            destino.radius + 1,
            destino.phi,
            destino.theta
          )
        ]}
        intensity={100}
        decay={0}
        color={0xff00ff}
        distance={1}
        angle={0.00075}
      />
    </>
  )
}

export default EclipseSim
