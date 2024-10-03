import { delay } from '@/utils/common'

const name = 'microanim'
const cls = `btn-${name}`

export default {
  install ({ directive }) {
    directive(name, {
      mounted (el) {
        el.classList.add(cls)
        el.addEventListener('click', clickHandler)
      },

      unmounted (el) {
        el.classList.remove(cls)
        el.removeEventListener('click', clickHandler)
      },
    })
  },
}

async function clickHandler ({ target }) {
  const animCls = `${cls}_animation`
  const el = target.closest(`.${cls}`)
  console.log('clickHandler', target, el)
  if (el) {
    el.classList.add(animCls)
    await delay(1000)
    el.classList.remove(animCls)
  }
}
