import { useEclipse, usePlanets } from '../../App'
import {
  moonParseLBDToXYZ,
  parseLBRToXYZ,
  setFromSphericalCoords,
  setFromSphericalCoordsCustom,
  setSphericalCoordFromCartesian,
  setSphericalCoordFromCartesianCustom
} from '../../helpers/functions/astronomicalFunctions'
import { Line } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
  MOON_SIZE,
  SUN_SIZE
} from '../../helpers/functions/SolarSystemConstants'

function EclipseSim () {
  const { eclip } = useEclipse()
  return <>{eclip && <Eclipse />}</>
}

class MoonCross {
  constructor (center) {
    this.spherical = setSphericalCoordFromCartesian(
      center[0],
      center[1],
      center[2]
    )
    this.center = center
    this.top = [center[0], center[1] + MOON_SIZE / 2, center[2]]
    this.bottom = [center[0], center[1] - MOON_SIZE / 2, center[2]]
    const right = setFromSphericalCoordsCustom(
      MOON_SIZE / 2,
      Math.PI / 2,
      this.spherical.Ll - Math.PI / 2,
      center
    )

    const left = setFromSphericalCoordsCustom(
      MOON_SIZE / 2,
      Math.PI / 2,
      this.spherical.Ll + Math.PI / 2,
      center
    )

    this.right = [right.x, right.y, right.z]
    this.left = [left.x, left.y, left.z]

    const right1 = setFromSphericalCoordsCustom(
      MOON_SIZE / 2,
      Math.PI / 4,
      this.spherical.Ll - Math.PI / 2,
      center
    )
    const left1 = setFromSphericalCoordsCustom(
      MOON_SIZE / 2,
      Math.PI / 4,
      this.spherical.Ll + Math.PI / 2,
      center
    )

    this.right1 = [right1.x, right1.y, right1.z]
    this.left1 = [left1.x, left1.y, left1.z]

    const left2 = setFromSphericalCoordsCustom(
      MOON_SIZE / 2,
      Math.PI / 1.5,
      this.spherical.Ll + Math.PI / 2,
      center
    )
    const right2 = setFromSphericalCoordsCustom(
      MOON_SIZE / 2,
      Math.PI / 1.5,
      this.spherical.Ll - Math.PI / 2,
      center
    )
    this.right2 = [right2.x, right2.y, right2.z]
    this.left2 = [left2.x, left2.y, left2.z]
    //console.log('MOON:', this.center, this.top, this.left, this.right)
  }

  extendCoord (factor, coord, reference) {
    const dx = coord[0] - reference[0],
      dy = coord[1] - reference[1],
      dz = coord[2] - reference[2]

    const k = Math.sqrt(factor / (dx ** 2 + dy ** 2 + dz ** 2))

    const x3 = coord[0] + dx * k,
      y3 = coord[1] + dy * k,
      z3 = coord[2] + dz * k

    return [x3, y3, z3]
  }
}

class SunCross {
  constructor (theta) {
    this.center = [0, 0, 0]
    this.top = [0, 0 + SUN_SIZE / 2, 0]
    this.bottom = [0, 0 - SUN_SIZE / 2, 0]
    const right = setFromSphericalCoordsCustom(
      SUN_SIZE / 2,
      Math.PI / 2,
      theta - Math.PI / 2,
      this.center
    )
    const left = setFromSphericalCoordsCustom(
      SUN_SIZE / 2,
      Math.PI / 2,
      theta + Math.PI / 2,
      this.center
    )
    this.right = [right.x, right.y, right.z]
    this.left = [left.x, left.y, left.z]

    const right1 = setFromSphericalCoordsCustom(
      SUN_SIZE / 2,
      Math.PI / 4,
      theta - Math.PI / 2,
      this.center
    )
    const left1 = setFromSphericalCoordsCustom(
      SUN_SIZE / 2,
      Math.PI / 4,
      theta + Math.PI / 2,
      this.center
    )
    this.right1 = [right1.x, right1.y, right1.z]
    this.left1 = [left1.x, left1.y, left1.z]

    const right2 = setFromSphericalCoordsCustom(
      SUN_SIZE / 2,
      Math.PI / 1.5,
      theta - Math.PI / 2,
      this.center
    )
    const left2 = setFromSphericalCoordsCustom(
      SUN_SIZE / 2,
      Math.PI / 1.5,
      theta + Math.PI / 2,
      this.center
    )
    this.right2 = [right2.x, right2.y, right2.z]
    this.left2 = [left2.x, left2.y, left2.z]
    //console.log('SUN:', this.center, this.top, this.left, this.right, theta)
  }
}

function Eclipse () {
  const { planets } = usePlanets()

  const earth = parseLBRToXYZ(planets.earth)
  const moon = moonParseLBDToXYZ(planets.moon)

  //Moon position [x,y,z] in scene
  const moonPos = [earth[0] + moon[0], earth[1] + moon[1], earth[2] + moon[2]]

  const destino = new THREE.Spherical().setFromCartesianCoords(...moonPos)

  const moonCoords = new MoonCross(moonPos)
  const sunCoordsToMoon = new SunCross(moonCoords.spherical.Ll)

  const target = useRef()
  const light = useRef()
  //useHelper(light, THREE.SpotLightHelper, 'cyan')

  useEffect(() => {
    light.current.target = target.current
  }, [])

  return (
    <>
      <Line
        color={'cyan'}
        points={[
          sunCoordsToMoon.top,
          moonCoords.top,
          moonCoords.extendCoord(4, moonCoords.top, sunCoordsToMoon.top)
        ]}
      />
      <Line
        color={'cyan'}
        points={[
          sunCoordsToMoon.bottom,
          moonCoords.bottom,
          moonCoords.extendCoord(4, moonCoords.bottom, sunCoordsToMoon.bottom)
        ]}
      />
      <Line
        color={'cyan'}
        points={[
          sunCoordsToMoon.right,
          moonCoords.right,
          moonCoords.extendCoord(4, moonCoords.right, sunCoordsToMoon.right)
        ]}
      />
      <Line
        color={'cyan'}
        points={[
          sunCoordsToMoon.left,
          moonCoords.left,
          moonCoords.extendCoord(4, moonCoords.left, sunCoordsToMoon.left)
        ]}
      />
      {/*Angulos*/}
      <Line
        color={'cyan'}
        points={[
          sunCoordsToMoon.right1,
          moonCoords.right1,
          moonCoords.extendCoord(4, moonCoords.right1, sunCoordsToMoon.right1)
        ]}
      />
      <Line
        color={'cyan'}
        points={[
          sunCoordsToMoon.left2,
          moonCoords.left2,
          moonCoords.extendCoord(4, moonCoords.left2, sunCoordsToMoon.left2)
        ]}
      />
      <Line
        color={'cyan'}
        points={[
          sunCoordsToMoon.right2,
          moonCoords.right2,
          moonCoords.extendCoord(4, moonCoords.right2, sunCoordsToMoon.right2)
        ]}
      />
      <Line
        color={'cyan'}
        points={[
          sunCoordsToMoon.left1,
          moonCoords.left1,
          moonCoords.extendCoord(4, moonCoords.left1, sunCoordsToMoon.left1)
        ]}
      />
      {/*Penumbra recta*/}
      <Line
        color={'red'}
        points={[
          sunCoordsToMoon.top,
          moonCoords.bottom,
          moonCoords.extendCoord(4, moonCoords.bottom, sunCoordsToMoon.top)
        ]}
      />
      <Line
        color={'red'}
        points={[
          sunCoordsToMoon.bottom,
          moonCoords.top,
          moonCoords.extendCoord(4, moonCoords.top, sunCoordsToMoon.bottom)
        ]}
      />
      <Line
        color={'red'}
        points={[
          sunCoordsToMoon.right,
          moonCoords.left,
          moonCoords.extendCoord(4, moonCoords.left, sunCoordsToMoon.right)
        ]}
      />
      <Line
        color={'red'}
        points={[
          sunCoordsToMoon.left,
          moonCoords.right,
          moonCoords.extendCoord(4, moonCoords.right, sunCoordsToMoon.left)
        ]}
      />
      <Line
        color={'red'}
        points={[
          sunCoordsToMoon.right1,
          moonCoords.left2,
          moonCoords.extendCoord(4, moonCoords.left2, sunCoordsToMoon.right1)
        ]}
      />
      <Line
        color={'red'}
        points={[
          sunCoordsToMoon.left1,
          moonCoords.right2,
          moonCoords.extendCoord(4, moonCoords.right2, sunCoordsToMoon.left1)
        ]}
      />
      <Line
        color={'red'}
        points={[
          sunCoordsToMoon.right2,
          moonCoords.left1,
          moonCoords.extendCoord(4, moonCoords.left1, sunCoordsToMoon.right2)
        ]}
      />
      <Line
        color={'red'}
        points={[
          sunCoordsToMoon.left2,
          moonCoords.right1,
          moonCoords.extendCoord(4, moonCoords.right1, sunCoordsToMoon.left2)
        ]}
      />
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
