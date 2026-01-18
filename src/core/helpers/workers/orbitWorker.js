const calculateObjectOrbit = import('../functions/orbitCalculator')

self.onmessage = function (event) {
  calculateObjectOrbit.then(module => {
    postMessage(module.calculateObjectOrbit(...event.data))
    self.close()
  })
}
