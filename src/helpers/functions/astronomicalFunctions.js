/*
In the lists of Appendix III, the quantities B and C are expressed in radians.
The coefficients A are in units of 10**-8 radian in the case of the longitude and
the latitude, in units of 10**-8 astronomical unit for the radius vector.
*/

import { degreesToRadians } from 'popmotion'
import {
  moonDistanceArgsTable,
  moonLatitudeArgsTable,
  moonLongitudeArgsTable
} from './SS/moonTables'
import {
  SaturnB0,
  SaturnB1,
  SaturnB2,
  SaturnB3,
  SaturnB4,
  SaturnB5,
  SaturnL0,
  SaturnL1,
  SaturnL2,
  SaturnL3,
  SaturnL4,
  SaturnL5,
  SaturnR0,
  SaturnR1,
  SaturnR2,
  SaturnR3,
  SaturnR4,
  SaturnR5
} from './SS/saturnTables'
import {
  EARTH_VSOP87_B,
  EARTH_VSOP87_L,
  EARTH_VSOP87_R
} from './SS/earthTables_complete'
import {
  EarthB0,
  EarthB1,
  EarthB2,
  EarthB3,
  EarthB4,
  EarthL0,
  EarthL1,
  EarthL2,
  EarthL3,
  EarthL4,
  EarthL5,
  EarthR0,
  EarthR1,
  EarthR2,
  EarthR3,
  EarthR4,
  EarthR5
} from './SS/earthTables'
import {
  JupiterB0,
  JupiterB1,
  JupiterB2,
  JupiterB3,
  JupiterB4,
  JupiterB5,
  JupiterL0,
  JupiterL1,
  JupiterL2,
  JupiterL3,
  JupiterL4,
  JupiterL5,
  JupiterR0,
  JupiterR1,
  JupiterR2,
  JupiterR3,
  JupiterR4,
  JupiterR5
} from './SS/jupiterTables'
import { Mars_B, Mars_L, Mars_R } from './SS/marsTables'
import { Venus_B, Venus_L, Venus_R } from './SS/venusTables'
import { Mercury_B, Mercury_L, Mercury_R } from './SS/mercuryTables'
import { Uranus_B, Uranus_L, Uranus_R } from './SS/uranusTables'
import { Neptune_B, Neptune_L, Neptune_R } from './SS/neptuneTables'
import { SCALE } from './SolarSystemConstants'

import * as THREE from 'three'

export function moonCoordinatesGivenDate (date) {
  const T = TFromJD(date)
  //Estos datos hay que convertirlos a grados normales entre 0 360
  //Mean longitude
  let Lp =
    218.3164477 +
    481267.88123421 * T -
    0.0015786 * T ** 2 +
    T ** 3 / 538841 -
    T ** 4 / 65194000

  Lp = angleToPos(Lp - 360 * Math.round(Lp / 360))

  //Mean elongation
  let D =
    297.8501921 +
    445267.1114034 * T -
    0.0018819 * T ** 2 +
    T ** 3 / 545868 -
    T ** 4 / 113065000

  D = angleToPos(D - 360 * Math.round(D / 360))

  //Sun mean anomaly
  let M =
    357.5291092 +
    35999.0502909 * T -
    0.0001536 * T ** 2 +
    T ** 3 / 24490000 -
    T ** 4 / 113065000

  M = angleToPos(M - 360 * Math.round(M / 360))

  //Moon mean anomaly
  let Mp =
    134.9633964 +
    477198.8675055 * T +
    0.0087414 * T ** 2 +
    T ** 3 / 69699 -
    T ** 4 / 14712000

  Mp = angleToPos(Mp - 360 * Math.round(Mp / 360))

  //Moon argument of latitude
  let F =
    93.272095 +
    483202.0175233 * T -
    0.0036539 * T ** 2 -
    T ** 3 / 3526000 +
    T ** 4 / 863310000

  F = angleToPos(F - 360 * Math.round(F / 360))

  let A1 = 119.75 + 131.849 * T
  A1 = angleToPos(A1 - 360 * Math.round(A1 / 360))

  let A2 = 53.09 + 479264.29 * T
  A2 = angleToPos(A2 - 360 * Math.round(A2 / 360))

  let A3 = 313.45 + 481266.484 * T
  A3 = angleToPos(A3 - 360 * Math.round(A3 / 360))

  //Ecentrity of earth orbit around the sun
  const E = 1 - 0.002516 * T - 0.0000074 * T ** 2

  //Latitude
  let sumb = linearCombinationSin(moonLatitudeArgsTable, D, M, Mp, F, E)
  //Longitude
  let suml = linearCombinationSin(moonLongitudeArgsTable, D, M, Mp, F, E)
  //Distance
  let sumr = linearCombinationCos(moonDistanceArgsTable, D, M, Mp, F, E)

  suml += 3958 * Math.sin(A1) + 1962 * Math.sin(Lp - F) + 318 * Math.sin(A2)
  sumb +=
    -2235 * Math.sin(Lp) +
    382 * Math.sin(A3) +
    175 * Math.sin(A1 - F) +
    175 * Math.sin(A1 + F) +
    127 * Math.sin(Lp - Mp) -
    115 * Math.sin(Lp + Mp)

  //console.log('Params : ', T, Lp, D, M, Mp, F, E)
  //console.log('Extra : ', A1, A2, A3)
  //console.log('Sumatorios: ', suml, sumb, sumr)
  //Resultados
  let L = Lp + suml / 1000000
  let B = sumb / 1000000
  let R = 385000.56 + sumr / 1000
  //console.log('LUNA: ', L, B, R)
  return { L, B, R }
}

function linearCombinationSin (tabla, D, M, Mp, F, E) {
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
function linearCombinationCos (tabla, D, M, Mp, F, E) {
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

function angleToPos (angle) {
  if (angle < 0) {
    return 360 + angle
  }
  return angle
}

export function TFromJD (time) {
  const T = (time - 2451545) / 36525
  return T
}

export function MillenniaTFromJD (time) {
  const T = (time - 2451545) / 365250
  return T
}

export function saturnCoordinatesGivenDate (date) {
  const T = MillenniaTFromJD(date)
  let tablesL = [SaturnL0, SaturnL1, SaturnL2, SaturnL3, SaturnL4, SaturnL5]
  let tablesB = [SaturnB0, SaturnB1, SaturnB2, SaturnB3, SaturnB4, SaturnB5]
  let tablesR = [SaturnR0, SaturnR1, SaturnR2, SaturnR3, SaturnR4, SaturnR5]
  let L = calculateTerm(tablesL, T) / 10 ** 8
  let B = calculateTerm(tablesB, T) / 10 ** 8
  let R = calculateTerm(tablesR, T) / 10 ** 8

  const Lp = L * 1.397 * (10 * T) - 0.00031 * (10 * T * T)
  L += -0.09033 + 0.03916 * (Math.cos(Lp) - Math.sin(Lp)) * Math.tan(B)
  B += 0.03916 * (Math.cos(Lp) - Math.sin(Lp))

  return { L, B, R }
}

export function jupiterCoordinatesGivenDate (date) {
  const T = MillenniaTFromJD(date)
  let tablesL = [
    JupiterL0,
    JupiterL1,
    JupiterL2,
    JupiterL3,
    JupiterL4,
    JupiterL5
  ]
  let tablesB = [
    JupiterB0,
    JupiterB1,
    JupiterB2,
    JupiterB3,
    JupiterB4,
    JupiterB5
  ]
  let tablesR = [
    JupiterR0,
    JupiterR1,
    JupiterR2,
    JupiterR3,
    JupiterR4,
    JupiterR5
  ]
  let L = calculateTerm(tablesL, T) / 10 ** 8
  let B = calculateTerm(tablesB, T) / 10 ** 8
  let R = calculateTerm(tablesR, T) / 10 ** 8

  const Lp = L * 1.397 * (10 * T) - 0.00031 * (10 * T * T)
  L += -0.09033 + 0.03916 * (Math.cos(Lp) - Math.sin(Lp)) * Math.tan(B)
  B += 0.03916 * (Math.cos(Lp) - Math.sin(Lp))

  return { L, B, R }
}

export function earthCoordinatesGivenDate (date) {
  const T = MillenniaTFromJD(date)
  let tablesL = [EarthL0, EarthL1, EarthL2, EarthL3, EarthL4, EarthL5]
  let tablesB = [EarthB0, EarthB1, EarthB2, EarthB3, EarthB4]
  let tablesR = [EarthR0, EarthR1, EarthR2, EarthR3, EarthR4, EarthR5]
  let L = calculateTerm(tablesL, T) / 10 ** 8
  let B = calculateTerm(tablesB, T) / 10 ** 8
  let R = calculateTerm(tablesR, T) / 10 ** 8

  const Lp = L * 1.397 * (10 * T) - 0.00031 * (10 * T * T)
  L += -0.09033 + 0.03916 * (Math.cos(Lp) - Math.sin(Lp)) * Math.tan(B)
  B += 0.03916 * (Math.cos(Lp) - Math.sin(Lp))

  return { L, B, R }
}

export function marsCoordinatesGivenDate (date) {
  const T = MillenniaTFromJD(date)
  let tablesL = Mars_L
  let tablesB = Mars_B
  let tablesR = Mars_R
  let L = calculateTerm(tablesL, T) / 10 ** 8
  let B = calculateTerm(tablesB, T) / 10 ** 8
  let R = calculateTerm(tablesR, T) / 10 ** 8

  const Lp = L * 1.397 * (10 * T) - 0.00031 * (10 * T * T)
  L += -0.09033 + 0.03916 * (Math.cos(Lp) - Math.sin(Lp)) * Math.tan(B)
  B += 0.03916 * (Math.cos(Lp) - Math.sin(Lp))

  return { L, B, R }
}

export function venusCoordinatesGivenDate (date) {
  const T = MillenniaTFromJD(date)
  let tablesL = Venus_L
  let tablesB = Venus_B
  let tablesR = Venus_R
  let L = calculateTerm(tablesL, T) / 10 ** 8
  let B = calculateTerm(tablesB, T) / 10 ** 8
  let R = calculateTerm(tablesR, T) / 10 ** 8

  const Lp = L * 1.397 * (10 * T) - 0.00031 * (10 * T * T)
  L += -0.09033 + 0.03916 * (Math.cos(Lp) - Math.sin(Lp)) * Math.tan(B)
  B += 0.03916 * (Math.cos(Lp) - Math.sin(Lp))

  return { L, B, R }
}

export function mercuryCoordinatesGivenDate (date) {
  const T = MillenniaTFromJD(date)
  let tablesL = Mercury_L
  let tablesB = Mercury_B
  let tablesR = Mercury_R
  let L = calculateTerm(tablesL, T) / 10 ** 8
  let B = calculateTerm(tablesB, T) / 10 ** 8
  let R = calculateTerm(tablesR, T) / 10 ** 8

  const Lp = L * 1.397 * (10 * T) - 0.00031 * (10 * T * T)
  L += -0.09033 + 0.03916 * (Math.cos(Lp) - Math.sin(Lp)) * Math.tan(B)
  B += 0.03916 * (Math.cos(Lp) - Math.sin(Lp))

  return { L, B, R }
}
export function uranusCoordinatesGivenDate (date) {
  const T = MillenniaTFromJD(date)
  let tablesL = Uranus_L
  let tablesB = Uranus_B
  let tablesR = Uranus_R
  let L = calculateTerm(tablesL, T) / 10 ** 8
  let B = calculateTerm(tablesB, T) / 10 ** 8
  let R = calculateTerm(tablesR, T) / 10 ** 8

  const Lp = L * 1.397 * (10 * T) - 0.00031 * (10 * T * T)
  L += -0.09033 + 0.03916 * (Math.cos(Lp) - Math.sin(Lp)) * Math.tan(B)
  B += 0.03916 * (Math.cos(Lp) - Math.sin(Lp))

  return { L, B, R }
}
export function neptuneCoordinatesGivenDate (date) {
  const T = MillenniaTFromJD(date)
  let tablesL = Neptune_L
  let tablesB = Neptune_B
  let tablesR = Neptune_R
  let L = calculateTerm(tablesL, T) / 10 ** 8
  let B = calculateTerm(tablesB, T) / 10 ** 8
  let R = calculateTerm(tablesR, T) / 10 ** 8

  const Lp = L * 1.397 * (10 * T) - 0.00031 * (10 * T * T)
  L += -0.09033 + 0.03916 * (Math.cos(Lp) - Math.sin(Lp)) * Math.tan(B)
  B += 0.03916 * (Math.cos(Lp) - Math.sin(Lp))

  return { L, B, R }
}

export function calculateTerm (tables, T) {
  let X = 0
  for (let x = 0; x < tables.length; x++) {
    X += calculateSubTerm(tables[x], T) * T ** x
  }
  return X
}

export function calculateSubTerm (table, T) {
  let X = 0
  for (let x = 0; x < table.length; x++) {
    X += table[x][0] * Math.cos(table[x][1] + table[x][2] * T) // A cos(B+C*T)
  }
  return X
}

export function setFromSphericalCoordsCustom (radius, phi, theta, [dx, dy, dz]) {
  const sinPhiRadius = Math.sin(phi) * radius

  let x = sinPhiRadius * Math.sin(theta) + dx
  let y = Math.cos(phi) * radius + dy
  let z = sinPhiRadius * Math.cos(theta) + dz

  return { x, y, z }
}

//TODO: INVERSE OPERATION
export function setFromSphericalCoords (radius, phi, theta) {
  const sinPhiRadius = Math.sin(phi) * radius

  let x = sinPhiRadius * Math.sin(theta)
  let y = Math.cos(phi) * radius
  let z = sinPhiRadius * Math.cos(theta)

  return { x, y, z }
}

export function setSphericalCoordFromCartesian (x, y, z) {
  const Rr = Math.sqrt(x ** 2 + y ** 2 + z ** 2)
  const Ll = Math.atan2(x, z)
  const Bb = Math.acos(y / Rr)

  return { Ll, Bb, Rr }
}

export function calculateElementOrbit (func, JDay, limit = 360, precision = 2) {
  let points = []
  for (let d = JDay; d < JDay + limit; d += precision) {
    const { L, B, R } = func(d)
    //console.log('EARTH: ', L, -Math.PI / 2 + B, (R * 1.5 * 10 ** 8) / SCALE)
    const point = setFromSphericalCoords(
      (R * 1.5 * 10 ** 8) / SCALE,
      -Math.PI / 2 + B,
      L
    )
    points.push(new THREE.Vector3(point.x, point.y, point.z))
  }

  return points
}

export function calculateMoonOrbit (func, JDay) {
  let points = []
  for (let d = JDay; d < JDay + 360; d += 2) {
    const { lambda, beta, del } = func(TFromJD(JDay))

    points.push(new Vector3(lambda, beta, del))
  }
  console.log(points)
  return points
}

/**
 * Calculates JD from date parsed to the UTC
 */
export function changeDateFromInput (value) {
  let time = Date.parse(value)
  let gmt = new Date(time).getTimezoneOffset() * 60 * 1000

  time = isNaN(time) ? Date.parse(new Date('1992-04-12')) : time
  gmt = isNaN(time) ? gmt : 0

  //console.log((time + gmt) / 86400000 + 2440587.5)
  return (time + gmt) / 86400000 + 2440587.5
}

export function parseLBRToXYZ (pos) {
  const { L, B, R } = pos
  const v = new THREE.Vector3().setFromSphericalCoords(
    (R * 149597870.7) / SCALE, //Parse from AU to KM then reduce to scale
    -Math.PI / 2 + B,
    L
  )
  return [...v]
}

export function moonParseLBDToXYZ (pos) {
  const { L, B, R } = pos
  const v = new THREE.Vector3().setFromSphericalCoords(
    R / SCALE,
    -Math.PI / 2 + degreesToRadians(B),
    degreesToRadians(L)
  )
  return [...v]
}

export const planetsNoSun = [
  'mercury',
  'venus',
  'earth',
  'moon',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune'
]

/**
 *
 * @param object string to select the desired function
 * @param period period of time in days
 * @param quantity quantity of periods
 * @param precision subdivision of the period
 * @param startDate date in JD to start counting
 * @param moveWithPlanet boolean. true: make the orbit of the moon move with the planet. false: the orbit makes a circle around its host
 *
 *
 */
export function calculateObjectOrbit (
  object,
  period,
  quantity,
  precision,
  startDate,
  moveWithPlanet = true
) {
  const func = [
    mercuryCoordinatesGivenDate,
    venusCoordinatesGivenDate,
    earthCoordinatesGivenDate,
    moonCoordinatesGivenDate,
    marsCoordinatesGivenDate,
    jupiterCoordinatesGivenDate,
    saturnCoordinatesGivenDate,
    uranusCoordinatesGivenDate,
    neptuneCoordinatesGivenDate
  ]
  const id = planetsNoSun.indexOf(object)

  if (id > -1) {
    if (object == 'moon') {
      const moon = calculatePlanetOrbit(
        func[3],
        period,
        quantity,
        precision,
        startDate,
        moonParseLBDToXYZ
      )
      if (moveWithPlanet) {
        //Si se mueve con el planeta
        const earth = calculatePlanetOrbit(
          func[2],
          period,
          quantity,
          precision,
          startDate,
          parseLBRToXYZ
        )
        return earth.map((p, i) => {
          return [p[0] + moon[i][0], p[1] + moon[i][1], p[2] + moon[i][2]]
        })
      }

      return moon
    }

    return calculatePlanetOrbit(
      func[id],
      period,
      quantity,
      precision,
      startDate,
      parseLBRToXYZ
    )
  }

  return [0, 0, 0]
}

/**
 *
 * @param fn function to calculate position
 * @param period period of time in days
 * @param quantity quantity of periods
 * @param precision subdivision of the period
 * @param startDate date in JD to start counting
 * @param parseFunc
 *
 *  Calculate all the points of an object between 2 given JD
 */
export function calculatePlanetOrbit (
  fn,
  period,
  quantity,
  precision,
  startDate,
  parseFunc
) {
  let posiciones = []
  const endDate = startDate + period * quantity
  for (
    let i = Math.min(startDate, endDate);
    i <= Math.max(startDate, endDate);
    i += Math.abs(period / precision)
  ) {
    posiciones = [...posiciones, parseFunc(fn(i))]
  }

  return posiciones
}

/**
 *
 *
 *
 */
export function calculateEarthRotationGivenDate (date) {
  //const time = (date - 2440587.5) * 86400000
  //console.log(Math.ceil(time))
  const T = TFromJD(date)
  const U = T / 100
  const e0 =
    23.43929111111 -
    1.30025833333 * U -
    1.55 * U ** 2 +
    1999.25 * U ** 3 -
    51.38 * U ** 4 -
    249.67 * U ** 5 -
    39.05 * U ** 6 +
    7.12 * U ** 7 +
    27.87 * U ** 8 +
    5.79 * U ** 9 +
    2.45 * U ** 10

  //console.log(e0)
  return e0
}

/*

  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T ** 2
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T ** 2
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T ** 2) * Math.sin(M) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
    0.000289 * Math.sin(3 * M)

  const U = T / 100
  const e0 =
    (82800 +
      1560 +
      21.448 -
      4680.93 * U -
      1.55 * U ** 2 +
      1999.25 * U ** 3 -
      51.38 * U ** 4 -
      249.67 * U ** 5 -
      39.05 * U ** 6 +
      7.12 * U ** 7 +
      27.87 * U ** 8 +
      5.79 * U ** 9 +
      2.45 * U ** 10) /
    60 /
    360

  //82800 +1560 +21.448 -
  //- 46.815 * T - 0.00059 * T ** 2 + 0.001813 * T ** 3

  const omega = 125.04 - 1934.136 * T
  const lambda = L0 + C - 0.00569 - 0.00478 * Math.sin(omega)

  const r = Math.atan2(
    Math.cos((e0 + 0.00256 * Math.cos(omega)) * Math.sin(lambda)),
    Math.cos(lambda)
  )
  //Formula 25.6
  console.log(T, C, angleToPos((L0 + C) % 360))
  return Math.atan2(
    Math.cos((e0 + 0.00256 * Math.cos(omega)) * Math.sin(lambda)),
    Math.cos(lambda)
  )
*/

/**
 *
 * DONE
 *
 */
export function calculateEarthObliquityOfTheEcliptic (date) {
  //const time = (date - 2440587.5) * 86400000
  //console.log(Math.ceil(time))
  const T = TFromJD(date)

  const U = T / 100
  const e0 =
    23.43929111111 -
    1.30025833333 * U -
    1.55 * U ** 2 +
    1999.25 * U ** 3 -
    51.38 * U ** 4 -
    249.67 * U ** 5 -
    39.05 * U ** 6 +
    7.12 * U ** 7 +
    27.87 * U ** 8 +
    5.79 * U ** 9 +
    2.45 * U ** 10

  //console.log(e0)
  return e0
}

/**
 *
 *
 *
 */
export function calculateEarthSunLatitude (date) {
  //const time = (date - 2440587.5) * 86400000
  //console.log(Math.ceil(time))
  const T = TFromJD(date)

  const U = T / 100
  const e0 =
    23.43929111111 -
    1.30025833333 * U -
    1.55 * U ** 2 +
    1999.25 * U ** 3 -
    51.38 * U ** 4 -
    249.67 * U ** 5 -
    39.05 * U ** 6 +
    7.12 * U ** 7 +
    27.87 * U ** 8 +
    5.79 * U ** 9 +
    2.45 * U ** 10

  //console.log(e0)
  return e0
}
