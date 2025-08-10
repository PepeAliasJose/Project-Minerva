import { SCALE } from '../src/helpers/functions/SolarSystemConstants.js'
import Module from './build/main.js'

export function setFromSphericalCoords (radius, phi, theta) {
  const sinPhiRadius = Math.sin(phi) * radius

  let x = sinPhiRadius * Math.sin(theta)
  let y = Math.cos(phi) * radius
  let z = sinPhiRadius * Math.cos(theta)

  return [x, y, z]
}

function parseFunc (pos) {
  const { L, B, R } = pos
  const v = setFromSphericalCoords(
    (R * 149597870.7) / SCALE, //Parse from AU to KM then reduce to scale
    -Math.PI / 2 + B,
    L
  )
  return [...v]
}

export function MillenniaTFromJD (time) {
  const T = (time - 2451545) / 365250
  return T
}

Module().then(instance => {
  const start = Date.now()

  let posiciones = []
  const endDate = 2448725 + 1 * 365
  const max = 2449090
  const min = 2448725
  const inverse = 2448725 == max

  //console.log(min, max)

  for (let i = min; i <= max; i += Math.abs(1 / 100)) {
    !inverse &&
      (posiciones = [
        ...posiciones,
        parseFunc({
          L: instance._earthCoordinatesGivenDateL(MillenniaTFromJD(i)),
          B: instance._earthCoordinatesGivenDateL(MillenniaTFromJD(i)),
          R: instance._earthCoordinatesGivenDateL(MillenniaTFromJD(i))
        })
      ])
    inverse &&
      (posiciones = [
        parseFunc({
          L: instance._earthCoordinatesGivenDateL(MillenniaTFromJD(i)),
          B: instance._earthCoordinatesGivenDateL(MillenniaTFromJD(i)),
          R: instance._earthCoordinatesGivenDateL(MillenniaTFromJD(i))
        }),
        ...posiciones
      ])
  }

  //console.log(posiciones)
  const end = Date.now()
  console.log('PLANET TIME: ', end - start)
})

//Test para ver mejora de velocidad calculando orbitas:

// FUNCIONES VSOP87D.js
// Calculo de la orbita de la tierra para dentro de 365 dias con 100 subdivisiones
// TIEMPO: 19.335 S

// TEST con node usando el modulo WASM
// Calculo de la orbita de la tierra para dentro de 365 dias con 100 subdivisiones
// TIEMPO: 5.335 S

// EJECUCION FINAL EN LA APP
// Calculo de la orbita de la tierra para dentro de 365 dias con 100 subdivisiones
// TIEMPO: 6.263 S
