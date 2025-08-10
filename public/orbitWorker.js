const calculateObjectOrbit = import('../src/helpers/functions/orbitCalculator')

self.onmessage = function (event) {
  calculateObjectOrbit.then(module => {
    postMessage(module.default(...event.data))
    self.close()
  })
}
