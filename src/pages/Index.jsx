import { Link } from 'react-router-dom'

function Index () {
  return (
    <section className='bg-gray-100 text-black min-h-screen'>
      <header className='p-5'>
        <h1 className='text-4xl font-bold'>MINERVA I</h1>
      </header>
      <main className='p-5'>
        <div className='inline-flex gap-5 items-center'>
          <h2>Ir al simulador:</h2>
          <Link className='up px-5 py-2' to={'/'}>
            Ver simulador
          </Link>
        </div>
        <section className='p-5'>
          <article>
            <h3 className='text-xl font-semibold'>Caracteristicas</h3>
            Version actual 1.0
          </article>
          <article>
            <h3 className='text-xl font-semibold'>Historial de cambios</h3>
            <ul className=''>
              <li>
                Nombre de medidas cambiado al sistema internacional (Norma ISO
                80000)
              </li>
              <li>
                Cambio de sitio donde indica si es tiempo UT o Local para movil
              </li>
              <li>
                Puedes sacar captura de pantalla con transparencia pulsando la
                R, en la consola esta el codigo en Base64
              </li>
              <li>
                TODO: cambiar que cuando en ua el resultado sea 0.0000 o -0.0000
                se ponga automatico en km
              </li>
              <li>
                TODO: Mejorar la proyeccion de eclipses lanzando 4 lineas desde
                el sol a los polos de la luna por cada dimension, asi puedes ver
                la umbra y penumbra de verdad segun la distancia
              </li>
            </ul>
          </article>
          <article>
            <h3 className='text-xl font-semibold'>Cambios para V1.1</h3>
            <ul className='numered-li'>
              <li>Lunas de jupiter</li>
              <li>Menu de información de cuerpos celestes</li>
              <li>Nuevo selector de fecha y hora</li>
              <li>Proyección de eclipse lunar</li>
              <li>Implementación TOTAL en WASM</li>
              <li>Mejora de la interfaz</li>
              <li>Movimiento de camara más preciso</li>
              <li>Movimiento de camara con teclado</li>
              <li>Clculos de distancia basado en tu posición geografica</li>
              <li>Guardar la foto de R como imagen en descargas</li>
              <li>Ajustar el ancho de las lineas</li>
            </ul>
          </article>
          <article>
            <h3 className='text-xl font-semibold'>Cambios para ¿?</h3>
            <ul className=''>
              <li>Cambio a VSOP2013</li>
              <li>Proyección local en coordenada terrestre</li>
              <li>
                Más cuerpos del sistema solar (Planetas enanos, cometas
                conocidos ...)
              </li>
              <li>Varios idiomas</li>
              <li>Mejorar los calculos en C</li>
            </ul>
          </article>
        </section>
      </main>
      <footer></footer>
    </section>
  )
}

export default Index
