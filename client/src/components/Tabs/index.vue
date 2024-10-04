<template lang="pug">
template(v-if="items.length")
  v-tabs(
    v-model="tab"
    align-tabs="end"
    slider-color="orange"
  )
    v-tab(
      v-for="item in items"
      :key="item.value"
      :value="item.value"
      :text="item.text"
      :prepend-icon="item.icon"
    )

  v-tabs-window.mt-12(v-model="tab")
    v-tabs-window-item(
      v-for="(item, ind) in items"
      :key="item.value"
      :value="item.value"
    )
      slot(:name="item.value")
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const tab = defineModel()
const router = useRouter()
const route = useRoute()

watch(tab, (val) => {
  router.push({ hash: `#${val}` })
})

onMounted(() => {
  const curTab = route.hash.replace('#', '')

  if (curTab) {
    tab.value = curTab
  }
  else {
    router.push({ hash: `#${tab.value}` })
  }
})
</script>
