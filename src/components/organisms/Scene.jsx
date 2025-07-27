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

const Scene = memo(({ load }) => {
  const { camera, gl } = useThree()
  const { intro_animation } = useAnimation()

  const desktop = useMediaQuery({ query: '(min-width: 40rem)' })

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

  //TODO: moveCamera(camera?,coords,st,updateRadius){
  // camera.current.smoothTime = st
  // camera.current._targetEnd = {...coords}
  // updateRadius && (camera.current._sphericalEnd.radius = 14)
  //}
  function moveCamera (planet, st, updateRadius = false) {
    //console.log(planet, st, updateRadius)
    Camara.current.smoothTime = st
    switch (planet) {
      case 'sun':
        Camara.current._targetEnd = { ...Sun.current.position }
        updateRadius && (Camara.current._sphericalEnd.radius = 14)
        break
      case 'mercury':
        Camara.current._targetEnd = { ...Mercury.current.position }
        updateRadius && (Camara.current._sphericalEnd.radius = 0.7)
        break
      case 'venus':
        Camara.current._targetEnd = { ...Venus.current.position }
        updateRadius && (Camara.current._sphericalEnd.radius = 0.7)
        break
      case 'earth':
        Camara.current._targetEnd = { ...Earth.current.position }
        updateRadius && (Camara.current._sphericalEnd.radius = 0.2)
        break
      case 'moon':
        Camara.current._targetEnd = {
          x: Earth.current.position.x + Moon.current.position.x,
          y: Earth.current.position.y + Moon.current.position.y,
          z: Earth.current.position.z + Moon.current.position.z
        }
        updateRadius && (Camara.current._sphericalEnd.radius = 0.5)
        break
      case 'mars':
        Camara.current._targetEnd = { ...Mars.current.position }
        updateRadius && (Camara.current._sphericalEnd.radius = 0.7)
        break
      case 'saturn':
        Camara.current._targetEnd = { ...Saturn.current.position }
        updateRadius && (Camara.current._sphericalEnd.radius = 1.3)
        break
      case 'jupiter':
        Camara.current._targetEnd = { ...Jupiter.current.position }
        updateRadius && (Camara.current._sphericalEnd.radius = 1.7)
        break
      case 'uranus':
        Camara.current._targetEnd = { ...Uranus.current.position }
        updateRadius && (Camara.current._sphericalEnd.radius = 1)
        break
      case 'neptune':
        Camara.current._targetEnd = { ...Neptune.current.position }
        updateRadius && (Camara.current._sphericalEnd.radius = 1)
        break
      default:
        Camara.current._targetEnd = { ...Saturn.current.position }
        updateRadius && (Camara.current._sphericalEnd.radius = 1.5)
        break
    }
  }

  function updateCamera (planet = 'sun', st = 1, updateRadius) {
    try {
      moveCamera(planet, st, updateRadius)
    } catch (error) {
      console.log('ERROR: Error actualizando la camara')
    }
  }

  useEffect(() => {
    //console.log('Cambio planeta')
    //updateCamera(0.5, zoomWhenChange)
    //console.log('LOAD')
    load(true)
  }, [])

  useEffect(() => {
    //Inicializar camara
    camera.fov = 40
    camera.far = 300000
    camera.near = 0.01

    let start

    if (intro_animation) {
      Camara.current.smoothTime = 0
      Camara.current._sphericalEnd.theta = Math.PI / 1.45
      Camara.current._sphericalEnd.phi = Math.PI / 2
      Camara.current._sphericalEnd.radius = 1

      camera.updateProjectionMatrix()
      //Animacion de entrada
      start = setTimeout(() => {
        Camara.current.smoothTime = 6
        Camara.current._sphericalEnd.theta = -0.1
        Camara.current._sphericalEnd.radius = desktop ? 1.3 : 3
        //setSol(true)
      }, 2000)
    } else {
      Camara.current.smoothTime = 0
      Camara.current._sphericalEnd.phi = Math.PI / 3
      Camara.current._sphericalEnd.theta = -Math.PI / 1.75
      Camara.current._sphericalEnd.radius = 10000 //desktop ? 120.3 : 125
      camera.updateProjectionMatrix()
    }

    return () => {
      clearTimeout(start)
      gl.dispose()
    }
  }, [])

  return (
    <>
      <CameraControls
        ref={Camara}
        minZoom={0.1}
        maxZoom={5}
        onChange={c => {
          //console.log(c)
        }}
        maxDistance={30000}
      />
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
      <SSCamera moveCamera={updateCamera} />
    </>
  )
})

export default Scene
