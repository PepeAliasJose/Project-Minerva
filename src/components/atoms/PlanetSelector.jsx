function PlanetSelector({ planet, setPlanet, sun = true }) {
  return (
    <div className={'up out-rounded z-50 w-full'}>
      <select
        aria-label='Selecciona un planeta'
        className={' px-2 py-2 h-10 rounded-full z-50 w-full focus:outline-0'}
        value={planet}
        onChange={(e) => {
          setPlanet(e.target.value)
        }}
      >
        {sun && (
          <option className='text-white bg-[var(--bg)]' value={'sun'}>
            Sol
          </option>
        )}
        <option className='text-white bg-[var(--bg)]' value={'mercury'}>
          Mercurio
        </option>
        <option className='text-white bg-[var(--bg)]' value={'venus'}>
          Venus
        </option>
        <option className='text-white bg-[var(--bg)]' value={'earth'}>
          Tierra
        </option>
        <option className='text-white bg-[var(--bg)]' value={'moon'}>
          Luna
        </option>
        <option className='text-white bg-[var(--bg)]' value={'mars'}>
          Marte
        </option>
        <option className='text-white bg-[var(--bg)]' value={'jupiter'}>
          Júpiter
        </option>
        <option className='text-white bg-[var(--bg)]' value={'saturn'}>
          Saturno
        </option>
        <option className='text-white bg-[var(--bg)]' value={'uranus'}>
          Urano
        </option>
        <option className='text-white bg-[var(--bg)]' value={'neptune'}>
          Neptuno
        </option>
      </select>
    </div>
  )
}

export default PlanetSelector
