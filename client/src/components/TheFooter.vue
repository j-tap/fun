<template lang="pug">
v-footer.flex-grow-0.text-grey-darken-1
  v-row(justify="center" no-gutters)
    span.text-caption
      span ©&nbsp;
      a.no-link(href="https://vr9.pro" target="_blank") VR Nine
      span &nbsp;2024 — {{ year }}
      span &nbsp;[Build: &sharp;{{ commitHash }}]
</template>

<script setup>
const commitHash = __COMMIT_HASH__
const year = new Date().getFullYear()
</script>
