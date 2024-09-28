import { h } from 'vue'

import crocodile from '@/components/icons/Crocodile.vue'

const customSvgNameToComponent = {
  crocodile,
}

export default {
  component: o => h(customSvgNameToComponent[o.icon]),
}