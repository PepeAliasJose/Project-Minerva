import { AnimatePresence, motion } from 'framer-motion'
import { useEclipse, useLines, useOrbits } from '../../App'
import { useState } from 'react'
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'

import PlanetSelector from '../atoms/PlanetSelector'
import { planetsNoSun } from '../../helpers/functions/orbitCalculator'
import Checker from '../atoms/Checker'
import Worker from '../../helpers/workers/orbitWorker?worker'

function ActionsMenu ({ date }) {
  const [show, setShow] = useState(false)
  return (
    <div className='fixed z-50 top-0 right-0 p-5 overflow-clip  '>
      <WrenchScrewdriverIcon
        className={
          'size-6 transition-all duration-500 z-[51] ease-in-out fixed top-8 right-16 ' +
          (show ? ' -rotate-90 text-white ' : ' text-gray-400 ')
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
       md:w-80 h-[calc(100svh-40px)] overflow-y-scroll overflow-x-clip 
       hide-scroll up out-rounded p-2 pb-4'
          >
            <div className='m-2 font-semibold text-center'>Acciones</div>
            <ActivateEclipse />
            <p className='m-2'>Calcular distancia: </p>
            <CreateDistanceLine />
            <p className='m-2 mt-5'>Calcular trayectoria: </p>
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

function ActivateEclipse () {
  const { eclip, setEclip, penum, setPenum } = useEclipse()
  return (
    <>
      <div className='flex flex-col gap-2'>
        <Checker
          tag={'Proyectar umbra lunar: '}
          value={eclip}
          setValue={() => {
            setEclip(!eclip)
          }}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Checker
          tag={'Proyectar penumbra lunar: '}
          value={penum}
          setValue={() => {
            setPenum(!penum)
          }}
        />
      </div>
    </>
  )
}

function CreateOrbit ({ date }) {
  const { orbits, addOrbit } = useOrbits()
  const [p1, setP1] = useState('earth')
  const [fecha, setFecha] = useState(1)
  const [duracion, setDuracion] = useState(1)
  const [precision, setPrecision] = useState(1)
  const [geocentrica, setGeo] = useState(false)
  const [calculando, setCalculando] = useState(false)
  const [color, setColor] = useState('#60a5fa')

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

  async function agregarLinea () {
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

        const calculateOrbit = new Worker()

        const agregar = event => {
          addOrbit({
            id: p1 + ':' + fecha,
            points: event.data.orbit,
            color: color,
            start: date,
            end: date + fecha * duracion,
            referencePoint: event.data.host
          })
          setCalculando(false)
        }

        calculateOrbit.addEventListener('message', agregar)
        calculateOrbit.postMessage([
          p1,
          fecha,
          duracion,
          precision,
          date,
          !geocentrica
        ])
        setCalculando(true)
      }
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col gap-2 mx-2'>
        <div className='inline-flex items-center justify-between gap-2 '>
          <PlanetSelector
            flat
            planet={p1}
            setPlanet={p => {
              setP1(p)
              setColor(colors[planetsNoSun.indexOf(p)])
            }}
            sun={false}
          />
          <DistanciaOrbita orbita={fecha} setOrbita={setFecha} />
          <button
            aria-label='Agregar orbita'
            className='hover:cursor-pointer up p-2'
            onClick={agregarLinea}
          >
            <PlusIcon className='size-6' />
          </button>
        </div>

        <label className='flex flex-col gap-1 text-sm text-[var(--soft-text)]'>
          Duración: (día, año...)
          <input
            type='text'
            value={duracion}
            onChange={e => {
              setDuracion(e.target.value)
            }}
            min={1}
            max={365}
            aria-label='Duración'
            className={
              'down p-1 px-3 border-2 text-lg ' +
              (chechNumber(duracion)
                ? ' border-red-400 '
                : ' border-transparent')
            }
          />
        </label>
        <label className='flex flex-col gap-1 text-sm text-[var(--soft-text)]'>
          División: (día/24, año/360...)
          <input
            type='text'
            value={precision}
            onChange={e => {
              setPrecision(e.target.value)
            }}
            min={1}
            max={100}
            aria-label='Precisión'
            className={
              'down p-1 px-3 border-2 text-lg ' +
              (chechNumber(precision)
                ? ' border-red-400 '
                : ' border-transparent')
            }
          />
        </label>
        <div className='inline-flex gap-2 w-full'>
          <label className='flex flex-row gap-2 text-sm text-[var(--soft-text)] items-center'>
            Color
            <input
              type='color'
              value={color}
              onChange={e => {
                setColor(e.target.value)
              }}
              min={1}
              max={100}
              aria-label='Color'
              className='rounded-xl'
            />
          </label>
          <Checker
            tag={'Geocéntrica: '}
            value={geocentrica}
            setValue={() => {
              setGeo(!geocentrica)
            }}
          />
        </div>
      </div>
      <div className='flex flex-col gap-2'></div>
      {duracion * precision >= 1000 && (
        <p className='text-sm text-yellow-300 mx-2 inline-flex gap-2 items-center'>
          <ExclamationTriangleIcon className='size-4 mt-0.5' />
          Los cálculos pueden tardar un poco
        </p>
      )}
      {duracion * precision >= 10000 && (
        <p className='text-sm text-red-400 mx-2 inline-flex gap-2 items-center'>
          <ExclamationTriangleIcon className='size-4 mt-0.5' />
          Requiere mucha potencia
        </p>
      )}
      {calculando && (
        <div className='inline-flex gap-2 items-center'>
          <ExclamationCircleIcon className='size-5 text-red-500' />
          calculando ...
        </div>
      )}
      <p className='text-sm text-[var(--soft-text)] mx-2'>
        En lunas, marcar geocéntrica genera la órbita alrededor de su planeta en
        la posición actual. <br />
        Calcula la trayectoria durante el intervalo seleccionado, desde la fecha
        establecida. La división es el número de cálculos intermedios entre
        unidades de tiempo.
      </p>
    </div>
  )
}

function chechNumber (number) {
  return isNaN(number) || number.length < 1
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
        + década
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
        - década
      </option>
      <option className='text-white bg-[var(--bg)]' value={-36500}>
        - siglo
      </option>
    </select>
  )
}
