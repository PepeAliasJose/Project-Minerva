import {
  angleToPos,
  linearCombinationCos,
  linearCombinationSin,
  MillenniaTFromJD,
  TFromJD
} from '../helpers/functions/astronomicalFunctions'

import { VSOP_EARTH } from './VSOP87D/vsop_ear'
import { VSOP_VENUS } from './VSOP87D/vsop_ven'
import { VSOP_MERCURY } from './VSOP87D/vsop_mer'
import { VSOP_MARS } from './VSOP87D/vsop_mar'
import { VSOP_JUPITER } from './VSOP87D/vsop_jup'
import { VSOP_SATURN } from './VSOP87D/vsop_sat'
import { VSOP_URANUS } from './VSOP87D/vsop_ura'
import { VSOP_NEPTUNE } from './VSOP87D/vsop_nep'

import {
  moonDistanceArgsTable,
  moonLatitudeArgsTable,
  moonLongitudeArgsTable
} from './VSOP87D/vsop_mon'
import { earth_nutation } from './VSOP87D/1980IAU_nutation'

function getMeanLongitude (i, T) {
  const longitudes = [
    4.4026088424 + 26087.9031415742 * T, // Mercury
    3.17614669689 + 10213.285546211 * T, //  Venus
    1.75347045953 + 6283.0758499914 * T, //  Earth
    6.20347611291 + 3340.6124266998 * T, //  Mars
    0.59954649739 + 529.6909650946 * T, //  Jupiter
    0.8740167565 + 213.299095438 * T, //  Saturn
    5.48129387159 + 74.7815985673 * T, //  Uranus
    5.31188628676 + 38.1330356378 * T, //  Neptune
    5.19846674103 + 77713.7714681205 * T, //  Moon D
    1.62790523337 + 84334.6615813083 * T, // Moon F
    2.35555589827 + 83286.9142695536 * T, // Moon l
    3.81034454697 + 83997.0911355954 * T // Moon Lm
  ]

  return longitudes[i]
}

export function calculateTerm (tables, T, term) {
  let X = 0
  const keys = Object.keys(tables)
  for (let x = 0; x < keys.length; x++) {
    X += calculateSubTerm(tables[keys[x]], T) * T ** x
  }
  return X
}

export function calculateSubTerm (list, T) {
  let X = 0
  for (let x = 0; x < list.length; x++) {
    const phi = calculateIndex(list[x], T)
    X += list[x][12] * Math.sin(phi) + list[x][13] * Math.cos(phi)
  }
  return X
}

export function calculateIndex (terms, T) {
  let phi = 0
  for (let x = 0; x < 12; x++) {
    phi += terms[x] * getMeanLongitude(x, T)
  }

  return phi
}

export function earthCoordinatesGivenDate (date) {
  const T = MillenniaTFromJD(date)
  //console.log(T)
  let tablesL = VSOP_EARTH.L
  let tablesB = VSOP_EARTH.B
  let tablesR = VSOP_EARTH.R
  let L = calculateTerm(tablesL, T, 'L') // 10 ** 8
  let B = calculateTerm(tablesB, T, 'B') // 10 ** 8
  let R = calculateTerm(tablesR, T, 'R') // 10 ** 8

  return { L, B, R }
}

export function saturnCoordinatesGivenDate (date) {
  const T = MillenniaTFromJD(date)
  let tablesL = VSOP_SATURN.L
  let tablesB = VSOP_SATURN.B
  let tablesR = VSOP_SATURN.R
  let L = calculateTerm(tablesL, T, 'L') // 10 ** 8
  let B = calculateTerm(tablesB, T, 'B') // 10 ** 8
  let R = calculateTerm(tablesR, T, 'R') // 10 ** 8

  return { L, B, R }
}

export function jupiterCoordinatesGivenDate (date) {
  const T = MillenniaTFromJD(date)
  let tablesL = VSOP_JUPITER.L
  let tablesB = VSOP_JUPITER.B
  let tablesR = VSOP_JUPITER.R
  let L = calculateTerm(tablesL, T, 'L') // 10 ** 8
  let B = calculateTerm(tablesB, T, 'B') // 10 ** 8
  let R = calculateTerm(tablesR, T, 'R') // 10 ** 8

  return { L, B, R }
}

export function marsCoordinatesGivenDate (date) {
  const T = MillenniaTFromJD(date)
  let tablesL = VSOP_MARS.L
  let tablesB = VSOP_MARS.B
  let tablesR = VSOP_MARS.R
  let L = calculateTerm(tablesL, T, 'L') // 10 ** 8
  let B = calculateTerm(tablesB, T, 'B') // 10 ** 8
  let R = calculateTerm(tablesR, T, 'R') // 10 ** 8

  return { L, B, R }
}

export function venusCoordinatesGivenDate (date) {
  const T = MillenniaTFromJD(date)
  let tablesL = VSOP_VENUS.L
  let tablesB = VSOP_VENUS.B
  let tablesR = VSOP_VENUS.R
  let L = calculateTerm(tablesL, T, 'L') // 10 ** 8
  let B = calculateTerm(tablesB, T, 'B') // 10 ** 8
  let R = calculateTerm(tablesR, T, 'R') // 10 ** 8

  return { L, B, R }
}

export function mercuryCoordinatesGivenDate (date) {
  const T = MillenniaTFromJD(date)
  let tablesL = VSOP_MERCURY.L
  let tablesB = VSOP_MERCURY.B
  let tablesR = VSOP_MERCURY.R
  let L = calculateTerm(tablesL, T, 'L') // 10 ** 8
  let B = calculateTerm(tablesB, T, 'B') // 10 ** 8
  let R = calculateTerm(tablesR, T, 'R') // 10 ** 8

  return { L, B, R }
}
export function uranusCoordinatesGivenDate (date) {
  const T = MillenniaTFromJD(date)
  let tablesL = VSOP_URANUS.L
  let tablesB = VSOP_URANUS.B
  let tablesR = VSOP_URANUS.R
  let L = calculateTerm(tablesL, T, 'L') // 10 ** 8
  let B = calculateTerm(tablesB, T, 'B') // 10 ** 8
  let R = calculateTerm(tablesR, T, 'R') // 10 ** 8

  return { L, B, R }
}
export function neptuneCoordinatesGivenDate (date) {
  const T = MillenniaTFromJD(date)
  let tablesL = VSOP_NEPTUNE.L
  let tablesB = VSOP_NEPTUNE.B
  let tablesR = VSOP_NEPTUNE.R
  let L = calculateTerm(tablesL, T, 'L') // 10 ** 8
  let B = calculateTerm(tablesB, T, 'B') // 10 ** 8
  let R = calculateTerm(tablesR, T, 'R') // 10 ** 8

  return { L, B, R }
}

export function moonCoordinatesGivenDate (date) {
  const T = TFromJD(date)

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

/**
 *
 * Calculate earth obliquity of the ecliptic
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

  return e0 + earthNutationInObliquity(date) / 360
}

/***/
function earthNutationArguments (T) {
  const D = 297.85036 + 445267.11148 * T - 0.0019142 * T ** 2 + T ** 3 / 189474
  const M = 357.52772 + 35999.05034 * T - 0.0001603 * T ** 2 - T ** 3 / 300000
  const Mp = 134.96298 + 477198.867398 * T + 0.0086972 * T ** 2 + T ** 3 / 56250
  const F = 93.27191 + 483202.017538 * T - 0.0036825 * T ** 2 + T ** 3 / 327270
  const Omega =
    125.04452 - 1934.136261 * T + 0.0020708 * T ** 2 + T ** 3 / 450000

  return { D, M, Mp, F, Omega }
}

/**
 *
 *
 *
 */
export function earthNutationInObliquity (date) {
  const T = TFromJD(date)
  const { D, M, Mp, F, Omega } = earthNutationArguments(T)
  const terms = earth_nutation(T)
  let Sum = 0

  for (let x = 0; x < terms.length; x++) {
    const args = terms[x].args
    if (terms[x].cos != undefined) {
      Sum +=
        terms[x].cos *
        Math.cos(
          args[0] * D +
            args[1] * M +
            args[2] * Mp +
            args[3] * F +
            args[4] * Omega
        )
    }
  }

  return Sum * 0.0001
}

/**
 *
 *
 *
 */
export function earthNutationInLongitude (date) {
  const T = TFromJD(date)
  const { D, M, Mp, F, Omega } = earthNutationArguments(T)
  const terms = earth_nutation(T)
  let Sum = 0

  for (let x = 0; x < terms.length; x++) {
    const args = terms[x].args
    if (terms[x].sin != undefined) {
      Sum +=
        terms[x].sin *
        Math.sin(
          args[0] * D +
            args[1] * M +
            args[2] * Mp +
            args[3] * F +
            args[4] * Omega
        )
    }
  }

  return Sum * 0.0001

  /*const L = 280.4665 * 3600 + 36000.7698 * 3600 * T
  const Lp = 218.3165 * 3600 + 481267.8813 * 3600 * T

  return (
    -17.2 * Math.sin(Omega) -
    -1.32 * Math.sin(2 * L) -
    0.23 * Math.sin(2 * Lp) +
    0.21 * Math.sin(2 * Omega)
  )*/
}

function decimalHour (JD) {
  const fraccion = JD - Math.floor(JD)
  const horaDecimal = fraccion * 24
  return horaDecimal
}

/**
 *
 * Used to calculate earth orientation
 *
 */
export function sideralTimeAtGreenwich (date) {
  const T = TFromJD(date)

  const o0 =
    280.46061837 +
    360.98564736629 * (date - 2451545) +
    0.000387933 * T ** 2 -
    T ** 3 / 38710000

  //Corrections

  return angleToPos(o0 % 360)
}

/**
 *
 * @deprecated
 *
 */
function convertToFK5 () {
  //const Lp = L * 1.397 * (10 * T) - 0.00031 * (10 * T * T)
  //L += -0.09033 + 0.03916 * (Math.cos(Lp) - Math.sin(Lp)) * Math.tan(B)
  //B += 0.03916 * (Math.cos(Lp) - Math.sin(Lp))
  return 0
}
