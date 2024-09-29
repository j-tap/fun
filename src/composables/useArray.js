export default function useArray () {
  return {
    shuffleArray,
  }
}

function shuffleArray (array = []) {
  const arr = [...array]

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    if (j !== undefined && j >= 0 && j < arr.length) {
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }

  return arr
}
