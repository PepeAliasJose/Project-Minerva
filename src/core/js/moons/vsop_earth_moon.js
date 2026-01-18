import {
  angleToPos,
  linearCombinationCos,
  linearCombinationSin,
  TFromJD
} from '../scripts/functions/astronomicalFunctions'

import {
  moonDistanceArgsTable,
  moonLatitudeArgsTable,
  moonLongitudeArgsTable
} from '../vsop87d-data/vsop_mon'

export function moonCoordinatesGivenDate(date) {
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
