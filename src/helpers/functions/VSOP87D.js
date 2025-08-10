import { MillenniaTFromJD } from './astronomicalFunctions'

import { VSOP_EARTH } from './VSOP87D/vsop_ear'
import { VSOP_VENUS } from './VSOP87D/vsop_ven'
import { VSOP_MERCURY } from './VSOP87D/vsop_mer'
import { VSOP_MARS } from './VSOP87D/vsop_mar'
import { VSOP_JUPITER } from './VSOP87D/vsop_jup'
import { VSOP_SATURN } from './VSOP87D/vsop_sat'
import { VSOP_URANUS } from './VSOP87D/vsop_ura'
import { VSOP_NEPTUNE } from './VSOP87D/vsop_nep'

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

  //const Lp = L * 1.397 * (10 * T) - 0.00031 * (10 * T * T)
  //L += -0.09033 + 0.03916 * (Math.cos(Lp) - Math.sin(Lp)) * Math.tan(B)
  //B += 0.03916 * (Math.cos(Lp) - Math.sin(Lp))

  //console.log('EARTH: ', L, B, R)

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

  //const Lp = L * 1.397 * (10 * T) - 0.00031 * (10 * T * T)
  //L += -0.09033 + 0.03916 * (Math.cos(Lp) - Math.sin(Lp)) * Math.tan(B)
  //B += 0.03916 * (Math.cos(Lp) - Math.sin(Lp))

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

  //const Lp = L * 1.397 * (10 * T) - 0.00031 * (10 * T * T)
  //L += -0.09033 + 0.03916 * (Math.cos(Lp) - Math.sin(Lp)) * Math.tan(B)
  //B += 0.03916 * (Math.cos(Lp) - Math.sin(Lp))

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

  //const Lp = L * 1.397 * (10 * T) - 0.00031 * (10 * T * T)
  //L += -0.09033 + 0.03916 * (Math.cos(Lp) - Math.sin(Lp)) * Math.tan(B)
  //B += 0.03916 * (Math.cos(Lp) - Math.sin(Lp))

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

  //const Lp = L * 1.397 * (10 * T) - 0.00031 * (10 * T * T)
  //L += -0.09033 + 0.03916 * (Math.cos(Lp) - Math.sin(Lp)) * Math.tan(B)
  //B += 0.03916 * (Math.cos(Lp) - Math.sin(Lp))

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

  //const Lp = L * 1.397 * (10 * T) - 0.00031 * (10 * T * T)
  //L += -0.09033 + 0.03916 * (Math.cos(Lp) - Math.sin(Lp)) * Math.tan(B)
  //B += 0.03916 * (Math.cos(Lp) - Math.sin(Lp))

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

  //const Lp = L * 1.397 * (10 * T) - 0.00031 * (10 * T * T)
  //L += -0.09033 + 0.03916 * (Math.cos(Lp) - Math.sin(Lp)) * Math.tan(B)
  //B += 0.03916 * (Math.cos(Lp) - Math.sin(Lp))

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

  //const Lp = L * 1.397 * (10 * T) - 0.00031 * (10 * T * T)
  //L += -0.09033 + 0.03916 * (Math.cos(Lp) - Math.sin(Lp)) * Math.tan(B)
  //B += 0.03916 * (Math.cos(Lp) - Math.sin(Lp))

  return { L, B, R }
}
