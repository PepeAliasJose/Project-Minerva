import { Object3D } from 'three'
import { useEclipse, usePlanets } from '../../App'
import {
  moonParseLBDToXYZ,
  parseLBRToXYZ
} from '../../helpers/functions/astronomicalFunctions'
import { Line, useHelper } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import { SCALE } from '../../helpers/functions/SolarSystemConstants'

function EclipseSim () {
  const { eclip } = useEclipse()

  return <>{eclip && <Eclipse />}</>
}

function Eclipse () {
  const { planets } = usePlanets()

  const target = new Object3D()

  const earth = parseLBRToXYZ(planets.earth)
  const moon = moonParseLBDToXYZ(planets.moon)

  const moonPos = [earth[0] + moon[0], earth[1] + moon[1], earth[2] + moon[2]]

  const destino = new THREE.Spherical().setFromCartesianCoords(...moonPos)

  target.position.set(
    ...new THREE.Vector3().setFromSphericalCoords(
      destino.radius + 2,
      destino.phi,
      destino.theta
    )
  )

  const light = useRef()
  useHelper(light, THREE.SpotLightHelper, 'cyan')
  return (
    <>
      <Line
        color={'cyan'}
        points={[
          moonPos,
          [
            ...new THREE.Vector3().setFromSphericalCoords(
              destino.radius + 1,
              destino.phi,
              destino.theta
            )
          ]
        ]}
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
        distance={planets.moon.R / SCALE}
        target={target}
        angle={0.00075}
      />
    </>
  )
}

export default EclipseSim
