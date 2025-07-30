import { useThree } from '@react-three/fiber'
import { useRef, useEffect, memo } from 'react'

import { CameraControls, Line } from '@react-three/drei'

import { useMediaQuery } from 'react-responsive'

import SunSS from '../atoms/SunSS'
import MercurySS from '../atoms/MercurySS'
import EartMoon from '../atoms/EarthMoon'
import VenusSS from '../atoms/VenusSS'
import MarsSS from '../atoms/MarsSS'
import SaturnSS from '../atoms/SaturnSS'
import JupiterSS from '../atoms/JupiterSS'
import UranusSS from '../atoms/UranusSS'
import NeptuneSS from '../atoms/NeptuneSS'
import { useAnimation } from '../../App'
import SSCamera from '../molecules/SSCamera'
import Lineas from '../molecules/Lineas'

const Scene = memo(({ load }) => {
  //const desktop = useMediaQuery({ query: '(min-width: 40rem)' })

  const Camara = useRef()
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
      />
      <SunSS Sun={Sun} />
      {/*MERCURIO*/}
      <MercurySS Mercury={Mercury} />
      {/*VENUS*/}
      <VenusSS Venus={Venus} />
      {/*LA TIERRA*/}
      <EartMoon Earth={Earth} Moon={Moon} />
      {/*MARTE*/}
      <MarsSS Mars={Mars} />
      {/*SATURNO*/}
      <SaturnSS Saturn={Saturn} />
      {/*JUPITER*/}
      <JupiterSS Jupiter={Jupiter} />
      {/*URANO*/}
      <UranusSS Uranus={Uranus} />
      {/*NEPTUNO*/}
      <NeptuneSS Neptune={Neptune} />
      <Lineas />
      <SSCamera />
    </>
  )
})

export default Scene
