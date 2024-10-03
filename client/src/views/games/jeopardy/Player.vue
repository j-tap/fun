<template lang="pug">
v-container(fluid)
  v-card(
    :title="$t('games.jeopardy.title')"
    variant="elevated"
  )
    template(v-slot:prepend)
      v-icon(color="blue" icon="mdi-school-outline")
    template(v-slot:append)
      v-btn(
        color="info"
        variant="text"
        icon="mdi-information-slab-box"
        @click="displayDialogInfo = true"
      )
</template>

<script setup>

</script>

<style lang="sass" scoped>

</style>
