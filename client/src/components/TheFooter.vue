<template lang="pug">
v-footer.flex-grow-0.text-grey-darken-1
  v-row(justify="center" no-gutters)
    span.text-caption
      span ©&nbsp;
      a.no-link(href="https://vr9.pro" target="_blank") VR Nine
      span &nbsp;2024 — {{ year }}
</template>

<script setup>
const year = new Date().getFullYear()
</script>
