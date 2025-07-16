<script setup>
const commitHash = __COMMIT_HASH__
const year = new Date().getFullYear()
</script>

<template lang="pug">
v-footer.flex-grow-0.text-grey-darken-1
  v-row(justify="space-between" no-gutters)
    span &nbsp;
    span.text-caption
      span ©&nbsp;
      span &nbsp;2024 — {{ year }}
      span &nbsp;[Build: &sharp;{{ commitHash }}]
    span.vr9copy
      |Created by&nbsp;
      a(href="https://vr9.pro" target="_blank") VR nine
</template>
