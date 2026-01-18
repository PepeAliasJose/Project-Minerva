export function getMenuItems () {
  const i = document.querySelector('#myMenu')
  //Esto da un HTMLCollection, y tenemos que convertirlo a un array
  return [...i.children]
}

export function getAllMenuItemsUnselected (id) {
  const items = getMenuItems()
  const res = items.filter(i => {
    return i.id !== id
  })
  return res
}

/**
 * @returns width - ancho de la ventana, height - alto de la ventana
 */
export function getWindowDimensions () {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height
  }
}

/**
 *
 * @param {string} id id del elemento a encontrar la posicion
 * @param {float} scroll % de scroll de la pagina en caso en que la pagina este scrolleada y quieras
 * su posicion respecto al viewport
 * @returns x para la coordenada X e y para la coordenada Y
 */
export function getObjectCoordinates (id, scroll) {
  const { height } = getWindowDimensions()
  const bodyRect = document.body.getBoundingClientRect()
  const photo = document.querySelector(id)
  const e = photo?.getBoundingClientRect()

  const offset = height * (isNaN(scroll) ? 0 : scroll)
  const y = e?.top - bodyRect.top - offset
  const x = e?.left - bodyRect.left
  return { x, y }
}

//FUNCIONES PARA EL CALCULO DE CONTRASTE Y EL CAMBIO DE TEMA

const RED = 0.2126
const GREEN = 0.7152
const BLUE = 0.0722

const GAMMA = 2.4

export function luminance (r, g, b) {
  var a = [r, g, b].map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, GAMMA)
  })
  return a[0] * RED + a[1] * GREEN + a[2] * BLUE
}

export function contrast (rgb1, rgb2) {
  var lum1 = luminance(...rgb1)
  var lum2 = luminance(...rgb2)
  var brightest = Math.max(lum1, lum2)
  var darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

export function lightReducer (x) {
  return (
    1.619546 -
    0.2854454 * x -
    0.01577268 * x ** 2 +
    0.0002438628 * x ** 3 -
    0.00000120554 * x ** 4 +
    2.012484 * 10 ** -9 * x ** 5
  )
}

export function fixContrast (contrast, c2, hard, h) {
  if (contrast < 4.5 && hard) {
    c2[2] = c2[2] - (4.5 - contrast) * 6
  }

  if (hard) {
    console.log(lightReducer(h))
  }

  return c2
}

//Convertir de HSL a RGB para luego pasarlos a HEX
export const HSLToRGB = (h, s, l) => {
  s /= 100
  l /= 100
  const k = n => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [
    Math.round(255 * f(0)),
    Math.round(255 * f(8)),
    Math.round(255 * f(4))
  ]
}

//Pasar de RGB a HEX para comodidad al usarlo
export const RGBtoHEX = (r, g, b) => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

//Convertir un numero a exadedecimal
function componentToHex (c) {
  var hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

export function media (array) {
  let suma = 0
  for (let x = 0; x < array.length; x++) {
    suma += array[x]
  }
  return suma / array.length
}
//**
//
// Devuelve un numero convertio a positivo
//
// */
export function toPos (i) {
  if (i < 0) return i * -1
  return i
}

export function normalizar (val, max) {
  const res = toPos(val) / toPos(max)
  if (res > 1) return 1
  return res
}

export function isTouchDevice () {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}
