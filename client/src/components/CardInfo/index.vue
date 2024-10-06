<template lang="pug">
v-container(max-width="340")
  v-card.mx-auto(
    v-touch="{ left: () => getPrevCard, right: () => getNextCard }"
    :variant="outlined ? 'outlined' : undefined"
    :color="color"
    @click="click"
  )
    v-card-text(v-if="outlined")
      slot

    v-img.align-end.select-none(
      v-else
      :src="src"
      aspect-ratio="1"
      gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.8)"
      cover
    )
      v-card-actions.align-end
        slot

  .d-flex.flex-center.my-4
    v-btn(
      :text="$t('prev')"
      color="orange"
      variant="outlined"
      size="large"
      @click.stop="getPrevCard"
    )
    v-spacer
    v-btn(
      :text="$t('next')"
      color="orange"
      variant="outlined"
      size="large"
      @click.stop="getNextCard"
    )
</template>

<script setup>
defineProps({
  src: {
    type: String,
    default: undefined,
  },
  color: {
    type: String,
    default: undefined,
  },
  outlined: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['prev', 'next', 'click'])

function getPrevCard () {
  emit('prev')
}

function getNextCard () {
  emit('next')
}

function click () {
  emit('click')
}
</script>
