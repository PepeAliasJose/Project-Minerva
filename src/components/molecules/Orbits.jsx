import { Html, Line } from '@react-three/drei'
import {
  calculatePlanetOrbit,
  earthCoordinatesGivenDate,
  moonCoordinatesGivenDate,
  moonParseLBDToXYZ,
  parseLBRToXYZ,
  saturnCoordinatesGivenDate
} from '../../helpers/functions/astronomicalFunctions'
import { useConfig, useOrbits, usePlanets } from '../../App'
import { EyeIcon, EyeSlashIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { SCALE } from '../../helpers/functions/SolarSystemConstants'
import { Vector3 } from 'three'

function Orbits () {
  const { orbits } = useOrbits()

  const o = orbits.map(o => {
    return (
      <Orbit
        key={o.id}
        id={o.id}
        points={o.points}
        color={o.color}
        start={o.start}
        end={o.end}
      />
    )
  })

  return <>{o}</>
}

function Orbit ({ id, points, color }) {
  const { removeOrbit } = useOrbits()
  const { au } = useConfig()

  const [show, setShow] = useState(true)

  function calculaDesplazamiento () {
    const p1 = new Vector3(...points[0])
    const p2 = new Vector3(...points[points.length - 1])

    let distancia = p1.distanceTo(p2) * SCALE

    if (au) {
      distancia /= 149597870.7
    }

    return distancia
  }

  function calculaDisSol () {
    const p1 = new Vector3(0, 0, 0)
    const p2 = new Vector3(...points[points.length - 1])

    let distancia = p1.distanceTo(p2) * SCALE

    if (au) {
      distancia /= 149597870.7
    }

    return distancia
  }

  function calculaTotal () {
    let distancia = 0

    for (let i = 0; i <= points.length - 2; i++) {
      distancia +=
        new Vector3(...points[i]).distanceTo(new Vector3(...points[i + 1])) *
        SCALE
      //console.log(distancia)
    }

    if (au) {
      distancia /= 149597870.7
    }

    return distancia
  }

  function alturaRespectoPR () {
    let distancia = points[0][1] * SCALE

    if (au) {
      distancia /= 149597870.7
    }

    return distancia
  }

  function alturaFinalRespectoPR () {
    let distancia = points[points.length - 1][1] * SCALE

    if (au) {
      distancia /= 149597870.7
    }

    return distancia
  }

  return (
    <>
      <Line color={color} points={[...points]} />
      <Line
        dashed
        dashSize={5}
        color={'#505050'}
        points={[[0, 0, 0], points[points.length - 1], points[0], [0, 0, 0]]}
      />
      <Html
        position={points[points.length - 1]}
        zIndexRange={[40, 10]}
        className='mt-2 -translate-x-1/2 bg-transparent
         inline-flex items-start gap-2 '
      >
        <div
          className='up out-rounded p-1.5 hover:cursor-pointer'
          onClick={() => {
            setShow(!show)
          }}
        >
          {show && <EyeSlashIcon className='size-3.5 text-red-400' />}
          {!show && <EyeIcon className='size-3.5 ' />}
        </div>
        {show && (
          <>
            <div
              className='text-[var(--soft-text)] up out-rounded px-5 py-2.5 
        text-xs inline-flex flex-nowrap  gap-1 bg-transparent w-56 '
            >
              <div className='flex flex-col gap-2'>
                <div className='flex flex-col gap-1'>
                  <p>
                    Distancia recorrida total:{'  '}
                    <strong className='font-semibold text-nowrap'>
                      {calculaTotal().toFixed(4)} {au ? 'AU' : 'KM'}
                    </strong>
                  </p>
                </div>
                <div className='flex flex-col gap-1'>
                  <p>
                    Desplazamiento:{'  '}
                    <strong className='font-semibold'>
                      {calculaDesplazamiento().toFixed(4)} {au ? 'AU' : 'KM'}
                    </strong>
                  </p>
                </div>
                <div className='flex flex-col gap-1'>
                  <p>
                    Distancia al sol final:{'  '}
                    <strong className='font-semibold'>
                      {calculaDisSol().toFixed(8)} {au ? 'AU' : 'KM'}
                    </strong>
                  </p>
                </div>
                <div className='flex flex-col gap-1'>
                  <p>
                    Altura respecto al plano inicial:{'  '}
                    <strong className='font-semibold text-nowrap'>
                      {alturaRespectoPR().toFixed(4)} {au ? 'AU' : 'KM'}
                    </strong>
                  </p>
                </div>
                <div className='flex flex-col gap-1'>
                  <p>
                    Altura respecto al plano final:{'  '}
                    <strong className='font-semibold text-nowrap'>
                      {alturaFinalRespectoPR().toFixed(4)} {au ? 'AU' : 'KM'}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
            <div
              className='up out-rounded p-1.5 hover:cursor-pointer'
              onClick={() => {
                removeOrbit(id)
              }}
            >
              <TrashIcon className='size-3.5 text-red-400' />
            </div>
          </>
        )}
      </Html>
    </>
  )
}

export default Orbits
