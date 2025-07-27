import { useEffect, useLayoutEffect } from 'react'
import { useConfig, useDate, usePlanet } from '../../App'

function SSCamera ({ moveCamera }) {
  const { planet } = usePlanet()
  const { date } = useDate()
  const { zoomWhenChange } = useConfig()

  useEffect(() => {
    console.log('Cambio planeta')
    moveCamera(planet, 0.5, zoomWhenChange)
  }, [planet])

  useLayoutEffect(() => {
    console.log('Cambio fecha')
    setTimeout(() => {
      //TODO: buscar una mejor solución que esta
      moveCamera(planet, 0, false)
    }, 10)
  }, [date])

  return <></>
}

export default SSCamera
