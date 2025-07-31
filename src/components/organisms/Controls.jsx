import { AnimatePresence, motion } from 'framer-motion'
import {
  useAnimation,
  useConfig,
  useCustomCamera,
  useLines,
  usePlanets
} from '../../App'
import { useEffect, useState } from 'react'
import { Cog6ToothIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Stats } from '@react-three/drei'
import {
  changeDateFromInput,
  moonParseLBDToXYZ,
  parseLBRToXYZ
} from '../../helpers/functions/astronomicalFunctions'

function Controls ({}) {
  const { controls, zoomWhenChange } = useConfig() //Configuracion
  const { intro_animation } = useAnimation()

  //Fecha y planeta seleccionado
  const [date, setDate] = useState('1992-04-12T14:00:00') //1992-04-12T00:00:00 //2025-07-30T14:00:00
  const [gmt, setGmt] = useState(2)
  const [planet, setPlanet] = useState(intro_animation ? 'saturn' : 'sun')

  //Planetas
  const { planets, updateAllPlanets } = usePlanets()

  //Target de la camara
  const { updateTarget, updateRadius, updateST } = useCustomCamera()

  useEffect(() => {
    const JDday = changeDateFromInput(date)
    console.log(JDday)
    updateAllPlanets(JDday)
  }, [date])

  useEffect(() => {
    updateST(0.5)
    updateCameraTarget(planet)
  }, [planet])

  useEffect(() => {
    updateST(0)
    updateCameraTarget(planet)
  }, [planets])

  function updateCameraTarget (planet) {
    //console.log(planet, planets[planet])
    switch (planet) {
      case 'sun':
        updateTarget([0, 0, 0])
        zoomWhenChange && updateRadius(14)
        break
      case 'moon':
        const e = parseLBRToXYZ(planets.earth)
        const m = moonParseLBDToXYZ(planets.moon)
        updateTarget([e[0] + m[0], e[1] + m[1], e[2] + m[2]])
        zoomWhenChange && updateRadius(0.2)
        break
      default:
        updateTarget(parseLBRToXYZ(planets[planet]))
        zoomWhenChange && updateRadius(1.4)
        break
    }
  }

  return (
    <AnimatePresence>
      {controls && (
        <motion.div
          key={'Controls'}
          initial={{
            opacity: 0,
            transition: { duration: 0.3, ease: 'easeInOut' }
          }}
          animate={{
            opacity: 1,
            transition: { delay: 0.6, duration: 0.3, ease: 'easeInOut' }
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.7, ease: 'easeInOut' }
          }}
          className='absolute bottom-5 left-0 w-full justify-center 
       flex flex-row-reverse gap-10 items-center '
        >
          <input
            aria-label='Fecha para calcular'
            className='up out-rounded px-5 py-2.5 z-50'
            type='datetime-local'
            value={date}
            onChange={e => {
              //changeDateFromInput(e.target.value)
              setDate(e.target.value)
            }}
          />

          <PlanetSelector planet={planet} setPlanet={setPlanet} />
        </motion.div>
      )}
      <SettingsMenu />
    </AnimatePresence>
  )
}

function PlanetSelector ({ planet, setPlanet, flat = false }) {
  return (
    <select
      aria-label='Selecciona un planeta'
      className={
        'up  px-5 py-2.5 z-50 w-full max-w-32 ' + (!flat && ' out-rounded ')
      }
      value={planet}
      onChange={e => {
        setPlanet(e.target.value)
      }}
    >
      <option className='text-white bg-[var(--bg)]' value={'sun'}>
        Sol
      </option>
      <option className='text-white bg-[var(--bg)]' value={'mercury'}>
        Mercurio
      </option>
      <option className='text-white bg-[var(--bg)]' value={'venus'}>
        Venus
      </option>
      <option className='text-white bg-[var(--bg)]' value={'earth'}>
        Tierra
      </option>
      <option className='text-white bg-[var(--bg)]' value={'moon'}>
        Luna
      </option>
      <option className='text-white bg-[var(--bg)]' value={'mars'}>
        Marte
      </option>
      <option className='text-white bg-[var(--bg)]' value={'jupiter'}>
        Jupiter
      </option>
      <option className='text-white bg-[var(--bg)]' value={'saturn'}>
        Saturno
      </option>
      <option className='text-white bg-[var(--bg)]' value={'uranus'}>
        Urano
      </option>
      <option className='text-white bg-[var(--bg)]' value={'neptune'}>
        Neptuno
      </option>
    </select>
  )
}

function SettingsMenu () {
  const [show, setShow] = useState(false)
  const [stats, setStats] = useState(false)

  const {
    tags,
    tagsOn,
    tagsOff,
    controls,
    controlsOn,
    controlsOff,
    zoomWhenChange,
    zoomOn,
    zoomOff,
    au,
    auOn,
    auOff
  } = useConfig()

  return (
    <motion.div
      key={'settings-menu'}
      className='fixed z-50 top-0 right-0 p-5 overflow-clip  '
    >
      {stats && <Stats />}
      <Cog6ToothIcon
        className={
          'size-6 transition-all duration-500 z-50 ease-in-out fixed top-8 right-8 ' +
          (show && ' -rotate-180 ')
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
            <div className='m-2 font-semibold text-center'>Ajustes</div>
            <div className='inline-flex gap-2 items-center'>
              <p className='m-2 '>Etiquetas: </p>
              <input
                aria-label='Ver etiquetas'
                type='checkbox'
                checked={tags}
                onChange={() => {
                  if (tags) {
                    tagsOff()
                  } else {
                    tagsOn()
                  }
                }}
              />
            </div>
            <div className='inline-flex gap-2 items-center '>
              <p className='m-2'>Ajustar camara al cambiar: </p>
              <input
                aria-label='Ajustar la camara al cambiar '
                type='checkbox'
                checked={zoomWhenChange}
                onChange={() => {
                  if (zoomWhenChange) {
                    zoomOff()
                  } else {
                    zoomOn()
                  }
                }}
              />
            </div>
            <div className='inline-flex gap-2 items-center'>
              <p className='m-2'>Ver controles: </p>
              <input
                aria-label='Ver controles'
                type='checkbox'
                checked={controls}
                onChange={() => {
                  if (controls) {
                    controlsOff()
                  } else {
                    controlsOn()
                  }
                }}
              />
            </div>
            <div className='inline-flex gap-2 items-center'>
              <p className='m-2'>Distancia en {au ? 'AU' : 'KM'}: </p>
              <input
                aria-label='Cambiar unidad de distancia'
                type='checkbox'
                checked={au}
                onChange={() => {
                  if (au) {
                    auOff()
                  } else {
                    auOn()
                  }
                }}
              />
            </div>
            <div className='inline-flex gap-2 items-center'>
              <p className='m-2'>Animación en siguiente carga: </p>
            </div>
            <div className='inline-flex gap-2 items-center'>
              <p className='m-2'>Estadisticas de rendimiento: </p>
              <input
                aria-label='Estadisticas de rendimiento'
                type='checkbox'
                checked={stats}
                onChange={() => {
                  setStats(!stats)
                }}
              />
            </div>
            <div className='m-2 font-semibold text-center'>Acciones:</div>
            <p className='m-2'>Calcular distancia: </p>
            <CreateDistanceLine />
            <p className='m-2'>Calcular órbita: </p>
            <CreateOrbit />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

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

function CreateOrbit () {
  const { lines, addLine } = useLines()
  const [p1, setP1] = useState('sun')
  const [fecha, setFecha] = useState(1)
  const [duracion, setDuracion] = useState(1)
  const [precison, setPrecision] = useState(1)

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
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col gap-2 mx-2'>
        <div className='inline-flex items-center justify-between gap-2 '>
          <PlanetSelector flat planet={p1} setPlanet={setP1} />
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
            max={364}
            aria-label='Duración'
          />
        </label>
        <label className='flex flex-col gap-1'>
          Precisión: {precison} %
          <input
            type='range'
            value={precison}
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
        Al establecer mas duración y precisión, puede tardar mas en calcular y
        aparecer la órbita. Una precisión al 1% será un calculo entre unidad de
        tiempo establecida (1 cada día, 1 cada año), y una establecida al 100%
        calculará 100 fracciones entre unidad de tiempo (100 calculos entre dia,
        ...) con lo que la curva sera mas suave y precisa
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

export default Controls
