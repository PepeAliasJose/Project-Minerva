function PlanetSelector ({ planet, setPlanet, sun = true }) {
  return (
    <select
      aria-label='Selecciona un planeta'
      className={'up  px-5 py-2.5 rounded-full z-50 w-full max-w-32 '}
      value={planet}
      onChange={e => {
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
        Jupiter
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
  )
}

export default PlanetSelector
