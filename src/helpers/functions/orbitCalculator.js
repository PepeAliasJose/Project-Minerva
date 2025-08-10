import {
  moonCoordinatesGivenDate,
  moonParseLBDToXYZ,
  parseLBRToXYZ
} from './astronomicalFunctions'
import {
  earthCoordinatesGivenDate,
  jupiterCoordinatesGivenDate,
  marsCoordinatesGivenDate,
  mercuryCoordinatesGivenDate,
  neptuneCoordinatesGivenDate,
  saturnCoordinatesGivenDate,
  uranusCoordinatesGivenDate,
  venusCoordinatesGivenDate
} from './VSOP87D'

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
export default function calculateObjectOrbit (
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
  //const start = Date.now()

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
        //const end = Date.now()
        //console.log('MOON TIME: ', end - start, start)
        return earth.map((p, i) => {
          return [p[0] + moon[i][0], p[1] + moon[i][1], p[2] + moon[i][2]]
        })
      }
      //const end = Date.now()
      //console.log('MOON TIME: ', end - start, start)
      return moon
    }

    const r = calculatePlanetOrbit(
      func[id],
      period,
      quantity,
      precision,
      startDate,
      parseLBRToXYZ
    )

    //const end = Date.now()
    //console.log('PLANET TIME: ', end - start, start)
    return r
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
 * @param parseFunc function to convert LBR to XYZ coords
 *
 *  Calculate an amount of points of an object between 2 given JD
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
  const max = Math.max(startDate, endDate)
  const min = Math.min(startDate, endDate)
  const inverse = startDate == max

  //console.log(min, max)
  let lastVal = min

  while (lastVal <= max) {
    !inverse && (posiciones = [...posiciones, parseFunc(fn(lastVal))])
    inverse && (posiciones = [parseFunc(fn(lastVal)), ...posiciones])

    lastVal += Math.abs(period / precision)
  }

  //Si no ha coincidido la subdivision con el punto final de la trayectoria
  //Lo agregamos, casos como agregar decimales
  if (lastVal != max) {
    !inverse && (posiciones = [...posiciones, parseFunc(fn(max))])
    inverse && (posiciones = [parseFunc(fn(max)), ...posiciones])
  }

  return posiciones
}
