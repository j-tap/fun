export function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getRand (min, max) {
  return Math.random() * (max - min) + min;
}

export function genToken () {
  return Math.random().toString(36).substr(2) + Date.now().toString(36)
}

export function strRevert (str = '') {
  return str.split('').reverse().join('')
}
