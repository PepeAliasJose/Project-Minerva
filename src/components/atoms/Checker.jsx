function Checker ({ tag, value, setValue }) {
  return (
    <div className='inline-flex gap-2 items-center'>
      <p className='m-2'>{tag}</p>
      <div
        onClick={setValue}
        className='down w-[3.25rem] h-7 transition-all p-0.5 hover:cursor-pointer 
        grid grid-cols-1 grid-rows-1'
      >
        <div className='w-[3.25rem] flex flex-row justify-between px-2'>
          <p>λ</p>
          <p>Θ</p>
        </div>
        <div
          className={
            'up size-6 transition-all hover:cursor-pointer ' +
            (value ? ' bg-cyan-500 translate-x-full' : ' bg-amber-400 ')
          }
        />
      </div>
    </div>
  )
}

export default Checker
