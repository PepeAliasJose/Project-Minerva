import { Line } from '@react-three/drei'
import {
  calculatePlanetOrbit,
  earthCoordinatesGivenDate
} from '../../helpers/functions/astronomicalFunctions'

function Orbits () {
  const points = calculatePlanetOrbit(
    earthCoordinatesGivenDate,
    1,
    360,
    1,
    2448725
  )

  console.log(points)

  return (
    <>
      <Line points={[...points]} />
    </>
  )
}

export default Orbits
