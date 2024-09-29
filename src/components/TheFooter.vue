<template lang="pug">
v-footer.flex-grow-0.text-grey-darken-1
  v-row(justify="center" no-gutters)
    span.text-caption © VR Nine 2024 — {{ year }}
</template>

<script setup>
const year = new Date().getFullYear()
</script>
