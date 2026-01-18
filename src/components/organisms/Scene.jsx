import { useRef, useEffect, memo } from 'react'

import SunSS from '../atoms/SunSS'
import MercurySS from '../atoms/MercurySS'
import EartMoon from '../atoms/EarthMoon'
import VenusSS from '../atoms/VenusSS'
import MarsSS from '../atoms/MarsSS'
import SaturnSS from '../atoms/SaturnSS'
import JupiterSS from '../atoms/JupiterSS'
import UranusSS from '../atoms/UranusSS'
import NeptuneSS from '../atoms/NeptuneSS'

import SSCamera from '../molecules/SSCamera'
import Lineas from '../molecules/Lineas'
import Orbits from '../molecules/Orbits'

import EclipseSim from '../atoms/EclipseSim'

const Scene = memo(({ load }) => {
  const Sun = useRef()
  const Mercury = useRef()
  const Venus = useRef()
  const Earth = useRef()
  const Moon = useRef()
  const Mars = useRef()
  const Saturn = useRef()
  const Jupiter = useRef()
  const Uranus = useRef()
  const Neptune = useRef()

  useEffect(() => {
    console.log('Render scene')
  })

  useEffect(() => {
    load(true)
  }, [])

  return (
    <>
      */
      {/*SOL*/}
      <pointLight
        position={[0, 0, 0]}
        intensity={5}
        decay={0}
        distance={1000}
        castShadow
      />
      <EclipseSim />
      <SunSS Sun={Sun} />
      <MercurySS Mercury={Mercury} />
      <VenusSS Venus={Venus} />
      <EartMoon Earth={Earth} Moon={Moon} />
      <MarsSS Mars={Mars} />
      <SaturnSS Saturn={Saturn} />
      <JupiterSS Jupiter={Jupiter} />
      <UranusSS Uranus={Uranus} />
      <NeptuneSS Neptune={Neptune} />
      <Orbits />
      <Lineas />
      <SSCamera />
    </>
  )
})

export default Scene
