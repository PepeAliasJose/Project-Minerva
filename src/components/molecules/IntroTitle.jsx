import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { useLayoutEffect, useState } from 'react'
import { useAnimation, useConfig } from '../../App'

function IntroTitle ({ loaded }) {
  const { tagsOn } = useConfig()
  const { intro_animation } = useAnimation()

  const [name, setName] = useState(false)
  const [intro, setIntro] = useState(intro_animation)

  useLayoutEffect(() => {
    //console.log('LOADED: ', loaded)

    if (loaded && intro) {
      const start = setTimeout(() => {
        setName(true)
      }, 10000)
      const secondPhase = setTimeout(() => {
        setName(false)
        setIntro(false)
        tagsOn()
        document.querySelector('#solarSystem').style.backgroundColor = '#101018'
      }, 14000)
      return () => {
        clearTimeout(start)
        clearTimeout(secondPhase)
      }
    }
    if (!intro) {
      document.querySelector('#solarSystem').style.backgroundColor = '#101018'
    }
  }, [loaded])

  return (
    <AnimatePresence>
      <motion.div
        key={'container'}
        className='absolute z-[51] bottom-15 sm:bottom-0 left-0 
          w-screen flex flex-col 
          items-center gap-2 pb-7 text-4xl sm:text-7xl font-black'
      >
        <AnimatePresence>
          {name && (
            <motion.div
              id='SATURN'
              key={'title'}
              initial={{
                opacity: 0,
                transition: { duration: 0.3, ease: 'easeInOut' }
              }}
              animate={{
                opacity: 1,
                transition: { duration: 1, ease: 'easeInOut' }
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.7, ease: 'easeInOut' }
              }}
              className='text-[#B4B5B7]'
            >
              SATURNO
            </motion.div>
          )}
          {intro && loaded && (
            <motion.div
              id='DATE'
              ey={'date'}
              initial={{
                opacity: 0,
                transition: { duration: 0.3, ease: 'easeInOut' }
              }}
              animate={{
                opacity: 1,
                transition: { duration: 0.3, ease: 'easeInOut' }
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.7, ease: 'easeInOut' }
              }}
              className='text-[#B4B5B7]'
            >
              12 Abril 1992
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

export default IntroTitle
