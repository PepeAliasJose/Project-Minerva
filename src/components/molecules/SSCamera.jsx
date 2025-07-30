import { useEffect, useLayoutEffect, useRef } from 'react'
import { useAnimation, useConfig, useCustomCamera, usePlanets } from '../../App'
import { useThree } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import { useMediaQuery } from 'react-responsive'

function SSCamera ({ moveCamera }) {
  const { camera, gl } = useThree()
  const desktop = useMediaQuery({ query: '(min-width: 40rem)' })

  const { intro_animation } = useAnimation()

  //Control de camara por zustand
  const { target, theta, phi, radius, smoothTime, fov } = useCustomCamera()
  const { zoomWhenChange } = useConfig()

  const camara = useRef()

  //Cambiar target
  useEffect(() => {
    zoomWhenChange && (camara.current._sphericalEnd.radius = radius)
    camara.current._targetEnd = { x: target[0], y: target[1], z: target[2] }
  }, [target])

  //Cambiar angulo de la camara
  useEffect(() => {
    camara.current._sphericalEnd.theta = theta
    camara.current._sphericalEnd.phi = phi
  }, [theta, phi])
  //cambiar radio
  useEffect(() => {}, [radius])
  //cambiar suavidad
  useEffect(() => {
    camara.current.smoothTime = smoothTime
  }, [smoothTime])
  //cambiar suavidad
  useEffect(() => {
    camera.fov = fov
    camera.updateProjectionMatrix()
  }, [fov])

  useEffect(() => {
    //Inicializar camara
    camera.fov = fov
    camera.far = 300000
    camera.near = 0.01

    let start

    if (intro_animation) {
      camara.current.smoothTime = 0
      camara.current._sphericalEnd.theta = Math.PI / 1.45
      camara.current._sphericalEnd.phi = Math.PI / 2
      camara.current._sphericalEnd.radius = 1

      camera.updateProjectionMatrix()
      //Animacion de entrada
      start = setTimeout(() => {
        camara.current.smoothTime = 6
        camara.current._sphericalEnd.theta = -0.1
        camara.current._sphericalEnd.radius = desktop ? 1.3 : 3
        //setSol(true)
      }, 2000)
    } else {
      camara.current.smoothTime = 0
      camara.current._sphericalEnd.phi = Math.PI / 3
      camara.current._sphericalEnd.theta = -Math.PI / 1.75
      camara.current._sphericalEnd.radius = 10000 //desktop ? 120.3 : 125
      camera.updateProjectionMatrix()
    }

    return () => {
      clearTimeout(start)
      gl.dispose()
    }
  }, [])

  return (
    <CameraControls
      ref={camara}
      minZoom={0.1}
      maxZoom={5}
      maxDistance={30000}
    />
  )
}

export default SSCamera
