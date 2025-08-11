import { Html, Line } from '@react-three/drei'
import { useConfig, useCustomCamera, useOrbits, usePlanets } from '../../App'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
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
        host={o.referencePoint}
      />
    )
  })

  return <>{o}</>
}

function Orbit ({ id, points, color, start, end, host }) {
  const { removeOrbit } = useOrbits()
  const { au } = useConfig()

  const [show, setShow] = useState(true)

  const endPoints = points.map(p => {
    return [p[0] + host[0], p[1] + host[1], p[2] + host[2]]
  })

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
    const p1 = new Vector3(...host)
    const p2 = new Vector3(...endPoints[endPoints.length - 1])

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
      <Line
        dashed
        dashSize={5}
        color={'#505050'}
        points={[host, endPoints[endPoints.length - 1], endPoints[0], host]}
      />
      <Html
        position={endPoints[endPoints.length - 1]}
        zIndexRange={[40, 10]}
        className='mt-2 -translate-x-1/2 bg-transparent
         inline-flex items-start gap-2 '
      >
        {show && (
          <>
            <div
              className='text-[var(--soft-text)] up out-rounded px-5 py-2.5 
        text-xs inline-flex flex-nowrap  gap-1 bg-transparent w-56 '
            >
              <div className='flex flex-col gap-2'>
                <p className='text-center text-white'>{id.split(':')[0]}</p>
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
                    Distancia al cuerpo primario final:{'  '}
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
          </>
        )}
        <div className='flex flex-col gap-2'>
          {show && (
            <button
              className='up out-rounded p-1.5 hover:cursor-pointer'
              onClick={() => {
                removeOrbit(id)
              }}
            >
              <TrashIcon className='size-3.5 text-red-400' />
            </button>
          )}
          <button
            className='up out-rounded p-1.5 hover:cursor-pointer'
            onClick={() => {
              setShow(!show)
            }}
          >
            {show && <EyeSlashIcon className='size-3.5 text-red-400' />}
            {!show && <EyeIcon className='size-3.5 ' />}
          </button>
        </div>
      </Html>
      <MiLinea points={endPoints} color={color} />
    </>
  )
}

function MiLinea ({ points, color }) {
  const { updateTarget } = useCustomCamera()
  const [point, setPoint] = useState({ point: [0, 0, 0], show: false })
  const [top, setTop] = useState(false)

  return (
    <>
      <Line
        color={color}
        points={points}
        lineWidth={3}
        onClick={e => {
          updateTarget([...e.pointOnLine])
          setPoint({ point: [...e.pointOnLine], show: true })
        }}
        onPointerEnter={e => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerLeave={e => {
          document.body.style.cursor = 'initial'
        }}
      />
      <Html
        position={point.point}
        zIndexRange={[40, 10]}
        className={
          ' -translate-x-1/2 bg-transparent inline-flex items-start gap-2 ' +
          (top ? ' mb-2 -translate-y-full ' : ' mt-2 ')
        }
      >
        {point.show && (
          <>
            <div
              className='text-[var(--soft-text)] up out-rounded px-5 py-2.5 
        text-xs flex flex-col gap-2 bg-transparent w-56 '
            >
              <p className='text-white text-center'>Punto seleccionado</p>
              <div className=' flex flex-col gap-1'>
                <p>Coord. rectangular</p>
                <p>X: {point.point[0] * SCALE}</p>
                <p>Y: {point.point[1] * SCALE}</p>
                <p>Z: {point.point[2] * SCALE}</p>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <button
                className='up out-rounded p-1.5 hover:cursor-pointer'
                onClick={() => {
                  setPoint({ ...point, show: false })
                }}
              >
                <TrashIcon className='size-3.5 text-red-400' />
              </button>
              <button
                className='up out-rounded p-1.5 hover:cursor-pointer'
                onClick={() => {
                  setTop(!top)
                }}
              >
                {!top && <ArrowUpIcon className='size-3.5 ' />}
                {top && <ArrowDownIcon className='size-3.5 ' />}
              </button>
            </div>
          </>
        )}
      </Html>
    </>
  )
}

export default Orbits
