import { Html, Line } from '@react-three/drei'
import { MathUtils, Vector3 } from 'three'
import { SCALE } from '../../helpers/functions/SolarSystemConstants'
import { useConfig, useLines, usePlanets } from '../../App'
import {
  moonParseLBDToXYZ,
  parseLBRToXYZ
} from '../../helpers/functions/astronomicalFunctions'
import { TrashIcon } from '@heroicons/react/24/outline'

function Lineas () {
  const { lines } = useLines()

  const lineas = lines.map(l => {
    return <Linea key={l.id} id={l.id} punto1={l.p1} punto2={l.p2} />
  })

  return <>{lineas}</>
}

function Linea ({ id, punto1, punto2 }) {
  const { planets } = usePlanets()
  const { au } = useConfig()
  const { removeLine } = useLines()

  function getPlanetsCoordinates (planet) {
    //console.log(planet, planets[planet])
    switch (planet) {
      case 'sun':
        return [0, 0, 0]
      case 'moon':
        const e = parseLBRToXYZ(planets.earth)
        const m = moonParseLBDToXYZ(planets.moon)
        return [e[0] + m[0], e[1] + m[1], e[2] + m[2]]
      default:
        return parseLBRToXYZ(planets[planet])
    }
  }

  const p1 = new Vector3(...getPlanetsCoordinates(punto1))
  const p2 = new Vector3(...getPlanetsCoordinates(punto2))

  //console.log(p1, p2)
  let distancia = p1.distanceTo(p2) * SCALE

  if (au) {
    distancia /= 149597870.7
  }

  const mid = new Vector3()
  mid.lerpVectors(p1, p2, 0.5)

  return (
    <group>
      <Line color={'#606060'} points={[p1, p2]} />
      <Html
        center
        position={mid}
        zIndexRange={[40, 10]}
        className=' -translate-y-1/2 bg-transparent
         inline-flex items-center gap-2'
      >
        <div
          className='text-[var(--soft-text)] up out-rounded px-4 py-1 
        text-xs inline-flex items-center gap-1 bg-transparent '
        >
          <p>{distancia.toFixed(au ? 8 : 7)} </p>
          {au ? 'ua' : 'km'}
        </div>
        <div
          className='up out-rounded p-1.5 hover:cursor-pointer'
          onClick={() => {
            removeLine(id)
          }}
        >
          <TrashIcon className='size-3.5 text-red-400' />
        </div>
      </Html>
    </group>
  )
}

export default Lineas
