import { AnimatePresence, motion } from 'framer-motion'
import { useLines, useOrbits } from '../../App'
import { useState } from 'react'
import { PlusIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import {
  calculateObjectOrbit,
  planetsNoSun
} from '../../helpers/functions/astronomicalFunctions'
import PlanetSelector from '../atoms/PlanetSelector'

function ActionsMenu ({ date }) {
  const [show, setShow] = useState(false)
  return (
    <div className='fixed z-50 top-0 right-0 p-5 overflow-clip  '>
      <WrenchScrewdriverIcon
        className={
          'size-6 transition-all duration-500 z-[51] ease-in-out fixed top-8 right-16 ' +
          (show && ' size-7 ')
        }
        onClick={() => {
          setShow(!show)
        }}
      />
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ translateX: '120%' }}
            animate={{ translateX: '0%' }}
            exit={{ translateX: '120%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className='flex flex-col w-[calc(100vw-40px)]
       md:w-80 h-[calc(100svh-40px)] overflow-y-scroll 
       hide-scroll up out-rounded p-2 pb-4'
          >
            <div className='m-2 font-semibold text-center'>Acciones:</div>
            <p className='m-2'>Calcular distancia: </p>
            <CreateDistanceLine />
            <p className='m-2 mt-4'>Calcular trayectoria: </p>
            <CreateOrbit date={date} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ActionsMenu

function CreateDistanceLine () {
  const { lines, addLine } = useLines()
  const [p1, setP1] = useState('sun')
  const [p2, setP2] = useState('earth')

  function agregarLinea () {
    if (p1 != p2) {
      let repetido = false
      lines.map(l => {
        if (l.id == p1 + '.' + p2 || l.id == p2 + '.' + p1) {
          repetido = true
          console.log('Repetido')
        }
      })

      if (!repetido) {
        addLine({ id: p1 + '.' + p2, p1: p1, p2: p2 })
      }
    }
  }

  return (
    <div className='inline-flex items-center justify-between gap-2 mx-2 '>
      <PlanetSelector flat planet={p1} setPlanet={setP1} />
      <PlanetSelector flat planet={p2} setPlanet={setP2} />
      <button
        aria-label='Agregar linea de distancia'
        className='hover:cursor-pointer up p-2'
        onClick={agregarLinea}
      >
        <PlusIcon className='size-6' />
      </button>
    </div>
  )
}

function CreateOrbit ({ date }) {
  const { orbits, addOrbit } = useOrbits()
  const [p1, setP1] = useState('earth')
  const [fecha, setFecha] = useState(1)
  const [duracion, setDuracion] = useState(1)
  const [precision, setPrecision] = useState(1)
  const [color, setColor] = useState(1)

  const colors = [
    '#F0F0F0',
    '#fb923c',
    '#60a5fa',
    '#F0F0F0',
    '#f87171',
    '#fb923c',
    '#fef08a',
    '#cffafe',
    '#3b82f6'
  ]

  function agregarLinea () {
    if (p1 != 'sun') {
      let repetido = false
      orbits.map(o => {
        if (o.id == p1 + ':' + fecha) {
          repetido = true
          console.log('Repetido')
        }
      })

      if (!repetido) {
        console.log('Agregar orbita')
        calculateObjectOrbit(p1, fecha, duracion, precision, date).then(
          points => {
            addOrbit({
              id: p1 + ':' + fecha,
              points: points,
              color: colors[planetsNoSun.indexOf(p1)],
              start: date,
              end: date + fecha * duracion
            })
          }
        )
      }
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col gap-2 mx-2'>
        <div className='inline-flex items-center justify-between gap-2 '>
          <PlanetSelector flat planet={p1} setPlanet={setP1} sun={false} />
          <DistanciaOrbita orbita={fecha} setOrbita={setFecha} />
          <button
            aria-label='Agregar orbita'
            className='hover:cursor-pointer up p-2'
            onClick={agregarLinea}
          >
            <PlusIcon className='size-6' />
          </button>
        </div>
        <label className='flex flex-col gap-1'>
          Duración: {duracion} (día, año, ...)
          <input
            type='range'
            value={duracion}
            onChange={e => {
              setDuracion(e.target.value)
            }}
            min={1}
            max={365}
            aria-label='Duración'
          />
        </label>
        <label className='flex flex-col gap-1'>
          Subdivisión: {precision} %
          <input
            type='range'
            value={precision}
            onChange={e => {
              setPrecision(e.target.value)
            }}
            min={1}
            max={100}
            aria-label='Precisión'
          />
        </label>
      </div>
      <div className='flex flex-col gap-2'></div>
      <p className='text-sm text-[var(--soft-text)] mx-2'>
        Al establecer mas duración y subdivisiones, puede tardar mas en calcular
        y aparecer la órbita. Una subdivisón al 1% será un calculo entre unidad
        de tiempo establecida (1 cada día, 1 cada año), y una establecida al
        100% calculará 100 fracciones entre unidad de tiempo (100 calculos entre
        dia, ...) con lo que la curva sera mas suave y precisa.
        <br /> El maximo de puntos por trayetoria es de 36500
      </p>
    </div>
  )
}

function DistanciaOrbita ({ orbita, setOrbita }) {
  return (
    <select
      className='up px-5 py-2.5 z-50 w-full max-w-32'
      value={orbita}
      onChange={e => {
        setOrbita(e.target.value)
      }}
    >
      <option className='text-white bg-[var(--bg)]' value={36500}>
        + siglo
      </option>
      <option className='text-white bg-[var(--bg)]' value={3650}>
        + decada
      </option>
      <option className='text-white bg-[var(--bg)]' value={365}>
        + año
      </option>
      <option className='text-white bg-[var(--bg)]' value={1}>
        + día
      </option>
      <option className='text-white bg-[var(--bg)]' value={-1}>
        - día
      </option>
      <option className='text-white bg-[var(--bg)]' value={-365}>
        - año
      </option>
      <option className='text-white bg-[var(--bg)]' value={-3650}>
        - decada
      </option>
      <option className='text-white bg-[var(--bg)]' value={-36500}>
        - siglo
      </option>
    </select>
  )
}
