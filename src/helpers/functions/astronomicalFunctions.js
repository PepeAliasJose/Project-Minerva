import { SCALE } from './SolarSystemConstants'
import * as THREE from 'three'

export function degreesToRadians (ang) {
  return (ang * Math.PI) / 180
}

/**
 *
 *  Linear combination to calculate moon L,B
 *
 */
export function linearCombinationSin (tabla, D, M, Mp, F, E) {
  let res = 0
  for (let x = 0; x < tabla.length; x++) {
    if (tabla[x][0][1] == 1 || tabla[x][0][1] == -1) {
      res +=
        tabla[x][1] *
        E *
        Math.sin(
          degreesToRadians(
            tabla[x][0][0] * D +
              tabla[x][0][1] * M +
              tabla[x][0][2] * Mp +
              tabla[x][0][3] * F
          )
        )
    } else if (tabla[x][0][1] == 2 || tabla[x][0][1] == -2) {
      res +=
        tabla[x][1] *
        E ** 2 *
        Math.sin(
          degreesToRadians(
            tabla[x][0][0] * D +
              tabla[x][0][1] * M +
              tabla[x][0][2] * Mp +
              tabla[x][0][3] * F
          )
        )
    } else {
      res +=
        tabla[x][1] *
        Math.sin(
          degreesToRadians(
            tabla[x][0][0] * D +
              tabla[x][0][1] * M +
              tabla[x][0][2] * Mp +
              tabla[x][0][3] * F
          )
        )
    }
  }

  return res
}

/**
 *
 * Linear combination to calculate moon R
 *
 */
export function linearCombinationCos (tabla, D, M, Mp, F, E) {
  let res = 0
  for (let x = 0; x < tabla.length; x++) {
    if (tabla[x][0][1] == 1 || tabla[x][0][1] == -1) {
      res +=
        tabla[x][1] *
        E *
        Math.cos(
          degreesToRadians(
            tabla[x][0][0] * D +
              tabla[x][0][1] * M +
              tabla[x][0][2] * Mp +
              tabla[x][0][3] * F
          )
        )
    } else if (tabla[x][0][1] == 2 || tabla[x][0][1] == -2) {
      res +=
        tabla[x][1] *
        E ** 2 *
        Math.cos(
          degreesToRadians(
            tabla[x][0][0] * D +
              tabla[x][0][1] * M +
              tabla[x][0][2] * Mp +
              tabla[x][0][3] * F
          )
        )
    } else {
      res +=
        tabla[x][1] *
        Math.cos(
          degreesToRadians(
            tabla[x][0][0] * D +
              tabla[x][0][1] * M +
              tabla[x][0][2] * Mp +
              tabla[x][0][3] * F
          )
        )
    }
  }

  return Math.round(res)
}

/**
 *
 *  Parse any angle to a positive angle
 *
 */
export function angleToPos (angle) {
  if (angle < 0) {
    return 360 + angle
  }
  return angle
}

/**
 *
 *  Gives Time (T) in Julian centuries from Epoch J2000
 *
 */
export function TFromJD (time) {
  const T = (time - 2451545) / 36525
  return T
}

/**
 *
 *  Gives Time (T) in Julian millennia from Epoch J2000
 *
 */
export function MillenniaTFromJD (time) {
  const T = (time - 2451545) / 365250
  return T
}

/**
 *
 *  Calculate any term (L,B,R) using the tables provided
 *
 */
export function calculateTerm (tables, T) {
  let X = 0
  for (let x = 0; x < tables.length; x++) {
    X += calculateSubTerm(tables[x], T) * T ** x
  }
  return X
}

/**
 *
 *  Calculate any subterm (L,B,R) using the table provided
 *
 */
export function calculateSubTerm (table, T) {
  let X = 0
  for (let x = 0; x < table.length; x++) {
    X += table[x][0] * Math.cos(table[x][1] + table[x][2] * T) // A cos(B+C*T)
  }
  return X
}

/**
 *
 *  Calculate Cartesian coordinates from a spherical position + offset
 *
 */
export function setFromSphericalCoordsCustom (radius, phi, theta, [dx, dy, dz]) {
  const sinPhiRadius = Math.sin(phi) * radius

  let x = sinPhiRadius * Math.sin(theta) + dx
  let y = Math.cos(phi) * radius + dy
  let z = sinPhiRadius * Math.cos(theta) + dz

  return { x, y, z }
}

/**
 *
 *  Calculate Cartesian coordinates from a spherical position
 *
 */
export function setFromSphericalCoords (radius, phi, theta) {
  const sinPhiRadius = Math.sin(phi) * radius

  let x = sinPhiRadius * Math.sin(theta)
  let y = Math.cos(phi) * radius
  let z = sinPhiRadius * Math.cos(theta)

  return { x, y, z }
}

/**
 *
 *  Calculate spherical coordinates from a Cartesian position
 *
 */
export function setSphericalCoordFromCartesian (x, y, z) {
  const Rr = Math.sqrt(x ** 2 + y ** 2 + z ** 2)
  const Ll = Math.atan2(x, z)
  const Bb = Math.acos(y / Rr)

  return { Ll, Bb, Rr }
}

/**
 * Calculates JD from date
 */
export function changeDateFromInput (value, isLocal = false) {
  let time = Date.parse(value) + 120000
  let gmt = new Date(time).getTimezoneOffset() * 60 * 1000

  const l = !isLocal ? time - gmt : time

  if (isNaN(l)) {
    return Date.parse(new Date('1992-04-12T00:00:00'))
  }
  return l / 86400000 + 2440587.5
}

/**
 *
 *  Calculate Cartesian coordinates from a spherical position (L,B,R)
 *  scaled down to Three 3D coords
 *  @param pos { L(theta) , B(phi) , R(radius) }
 *
 */
export function parseLBRToXYZ (pos) {
  const { L, B, R } = pos
  const v = new THREE.Vector3().setFromSphericalCoords(
    (R * 149597870.7) / SCALE, //Parse from AU to KM then reduce to scale
    -Math.PI / 2 + B,
    L
  )
  return [...v]
}

/**
 *
 *  FUNCTION ONLY FOT THE MOON
 *  Calculate Cartesian coordinates from a spherical position (L,B,R)
 *  scaled down to Three 3D coords
 *  @param pos { L(theta) , B(phi) , R(radius) }
 *
 */
export function moonParseLBDToXYZ (pos) {
  const { L, B, R } = pos
  const v = new THREE.Vector3().setFromSphericalCoords(
    R / SCALE,
    -Math.PI / 2 + degreesToRadians(B),
    degreesToRadians(L)
  )
  return [...v]
}
