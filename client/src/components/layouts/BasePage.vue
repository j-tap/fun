<template lang="pug">
v-container(fluid)
  v-card(
    :title="title"
    variant="elevated"
  )
    template(v-slot:prepend)
      v-icon(:color="color" :icon="icon")
    template(v-slot:append)
      slot(name="append")

    v-card-text.mb-12
      slot(name="default")

  slot(name="extra")
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: null,
  },
  color: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
})
</script>
