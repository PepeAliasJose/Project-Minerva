import {
  angleToPos,
  MillenniaTFromJD,
  TFromJD
} from './helpers/functions/astronomicalFunctions'

import { VSOP_EARTH } from './VSOP87D/vsop_ear'
import { VSOP_VENUS } from './VSOP87D/vsop_ven'
import { VSOP_MERCURY } from './VSOP87D/vsop_mer'
import { VSOP_MARS } from './VSOP87D/vsop_mar'
import { VSOP_JUPITER } from './VSOP87D/vsop_jup'
import { VSOP_SATURN } from './VSOP87D/vsop_sat'
import { VSOP_URANUS } from './VSOP87D/vsop_ura'
import { VSOP_NEPTUNE } from './VSOP87D/vsop_nep'

import { earth_nutation } from './VSOP87D/1980IAU_nutation'
import { getMeanLongitude } from './VSOP87D/meanLongitudes'
import { moonCoordinatesGivenDate as moonCoordinatesGivenDateR } from './moons/vsop_earth_moon'
//import { EARTH_SIZE } from './helpers/functions/SolarSystemConstants'

function calculateIndex(terms, T) {
  let phi = 0
  for (let x = 0; x < 12; x++) {
    phi += terms[x] * getMeanLongitude(x, T)
  }

  return phi
}

function calculateSubTerm(list, T) {
  let X = 0
  for (let x = 0; x < list.length; x++) {
    const phi = calculateIndex(list[x], T)
    X += list[x][12] * Math.sin(phi) + list[x][13] * Math.cos(phi)
  }
  return X
}

function calculateTerm(tables, T, term) {
  let X = 0
  const keys = Object.keys(tables)
  for (let x = 0; x < keys.length; x++) {
    X += calculateSubTerm(tables[keys[x]], T) * T ** x
  }
  return X
}

/**
 *
 * Gets the planet's heliocentric coordinates
 * @param {number} date JD day
 * @param {number} planet planet number starting from 0
 *
 */
export function getPlanetHeliocentricCoordinates(date, planet) {
  const elements = [
    VSOP_MERCURY,
    VSOP_VENUS,
    VSOP_EARTH,
    VSOP_MARS,
    VSOP_JUPITER,
    VSOP_SATURN,
    VSOP_URANUS,
    VSOP_NEPTUNE
  ]

  return calculatePlanetHeliocentricCoordinates(date, elements[planet])
}

function calculatePlanetHeliocentricCoordinates(date, vsop_data) {
  const T = MillenniaTFromJD(date)

  let tablesL = vsop_data.L
  let tablesB = vsop_data.B
  let tablesR = vsop_data.R
  let L = calculateTerm(tablesL, T, 'L') // 10 ** 8
  let B = calculateTerm(tablesB, T, 'B') // 10 ** 8
  let R = calculateTerm(tablesR, T, 'R') // 10 ** 8

  return { L, B, R }
}

/**
 *
 * Useless conversion only to call the function from the core
 * Meant to be replaced in the future for other moons' calculations
 *
 */
export const moonCoordinatesGivenDate = (date) => {
  return moonCoordinatesGivenDateR(date)
}

/**
 *
 * Calculate earth obliquity of the ecliptic
 *
 */
export function calculateEarthObliquityOfTheEcliptic(date) {
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
function earthNutationArguments(T) {
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
export function earthNutationInObliquity(date) {
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
export function earthNutationInLongitude(date) {
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

function decimalHour(JD) {
  const fraccion = JD - Math.floor(JD)
  const horaDecimal = fraccion * 24
  return horaDecimal
}

/**
 *
 * Used to calculate earth orientation
 *
 */
export function sideralTimeAtGreenwich(date) {
  const T = TFromJD(date)

  const o0 =
    280.46061837 +
    360.98564736629 * (date - 2451545) +
    0.000387933 * T ** 2 -
    T ** 3 / 38710000

  //Corrections

  return angleToPos(o0 % 360)
}
