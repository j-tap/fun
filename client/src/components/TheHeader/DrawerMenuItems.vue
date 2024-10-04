<template lang="pug">
v-list-item(
  v-for="([icon, title, to, internet], index) in items"
  :key="index"
  :to="to"
)
  template(v-slot:prepend)
    v-icon(:icon="icon")
  template(v-if="internet" v-slot:append)
    v-badge(color="warning" inline)
      template(v-slot:badge)
        v-icon mdi-wifi
  v-list-item-title {{ $t(title) }}
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
</script>
