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

function PlanetSelector ({ planet, setPlanet }) {
  return (
    <select
      className='up out-rounded px-5 py-2.5 z-50 w-full max-w-32'
      value={planet}
      onChange={e => {
        setPlanet(e.target.value)
      }}
    >
      <option className='text-black' value={'sun'}>
        Sol
      </option>
      <option className='text-black' value={'mercury'}>
        Mercurio
      </option>
      <option className='text-black' value={'venus'}>
        Venus
      </option>
      <option className='text-black' value={'earth'}>
        Tierra
      </option>
      <option className='text-black' value={'moon'}>
        Luna
      </option>
      <option className='text-black' value={'mars'}>
        Marte
      </option>
      <option className='text-black' value={'jupiter'}>
        Jupiter
      </option>
      <option className='text-black' value={'saturn'}>
        Saturno
      </option>
      <option className='text-black' value={'uranus'}>
        Urano
      </option>
      <option className='text-black' value={'neptune'}>
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
      className={
        'fixed md: z-50 transition-all duration-500 ease-in-out top-5 right-5 overflow-hidden up out-rounded p-2  ' +
        (show
          ? ' w-[calc(100vw-40px)] md:w-80 h-[calc(100svh-40px)]'
          : ' size-12 ')
      }
    >
      {stats && <Stats />}
      <Cog6ToothIcon
        className={
          'size-6 transition-all duration-500 ease-in-out absolute top-3 right-3 ' +
          (show && ' -rotate-180 ')
        }
        onClick={() => {
          setShow(!show)
        }}
      />
      <div className='flex flex-col w-[calc(100vw-40px)] md:w-80'>
        <div className='m-2 mt-12  font-semibold text-center'>Ajustes</div>
        <div className='inline-flex gap-2 items-center'>
          <p className='m-2 '>Etiquetas: </p>
          <input
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
        <p className='m-2'>Calcular orbita: </p>
      </div>
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
    <div className='inline-flex items-center justify-between gap-2 mx-2'>
      <PlanetSelector planet={p1} setPlanet={setP1} />
      <PlanetSelector planet={p2} setPlanet={setP2} />
      <button
        className='hover:cursor-pointer up out-rounded p-2'
        onClick={agregarLinea}
      >
        <PlusIcon className='size-6' />
      </button>
    </div>
  )
}

export default Controls
