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

const fragmentos = Math.PI / 8

function EclipseSim () {
  const { eclip, penum } = useEclipse()
  return <>{(eclip || penum) && <Eclipse umbra={eclip} penumbra={penum} />}</>
}

class MoonCross {
  constructor (center) {
    this.spherical = setSphericalCoordFromCartesian(
      center[0],
      center[1],
      center[2]
    )
    this.center = center
    this.points = this.calcPoins()
    //console.log('MOON:', this.center, this.top, this.left, this.right)
  }

  calcPoins () {
    let points = []
    //Calcular puntos girando según phi
    for (let x = 0; x < Math.PI * 2; x += fragmentos) {
      const p = setFromSphericalCoordsCustom(
        MOON_SIZE / 2,
        x,
        this.spherical.Ll - Math.PI / 2,
        this.center
      )

      points.push([p.x, p.y, p.z])
    }
    return points
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
    this.points = this.calcPoins(theta)
    //console.log('SUN:', this.center, this.top, this.left, this.right, theta)
  }

  calcPoins (theta) {
    let points = []
    //Calcular puntos girando según phi
    for (let x = 0; x < Math.PI * 2; x += fragmentos) {
      const p = setFromSphericalCoordsCustom(
        SUN_SIZE / 2,
        x,
        theta - Math.PI / 2,
        this.center
      )

      points.push([p.x, p.y, p.z])
    }
    return points
  }
}

function Eclipse ({ umbra, penumbra }) {
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

  const lineasUmbra = moonCoords.points.map((p, i) => {
    return (
      <Line
        lineWidth={1}
        key={'umbra' + i}
        color={0x00ffff}
        points={[
          sunCoordsToMoon.points[i],
          p,
          moonCoords.extendCoord(4, p, sunCoordsToMoon.points[i])
        ]}
      />
    )
  })
  const lineasPenumbra = moonCoords.points.map((p, i) => {
    const index =
      (Math.ceil((moonCoords.points.length - 1) / 2) + i) %
      moonCoords.points.length

    return (
      <Line
        lineWidth={4}
        key={'penumbra' + i}
        color={0xffff90}
        points={[
          sunCoordsToMoon.points[index],
          p,
          moonCoords.extendCoord(4, p, sunCoordsToMoon.points[index])
        ]}
      />
    )
  })

  return (
    <>
      {umbra && lineasUmbra}
      {penumbra && lineasPenumbra}
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
