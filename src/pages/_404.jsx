import { Link } from 'react-router-dom'

function _404 () {
  return (
    <div className='bg-neutral-900 text-neutral-200 min-h-screen flex flex-col items-center gap-5'>
      <h2 className='mt-10 text-7xl font-semibold'>404</h2>
      <p>Esta página no existe</p>
      <Link className='up px-5 py-2' to={'/'}>
        Volver
      </Link>
    </div>
  )
}

export default _404
