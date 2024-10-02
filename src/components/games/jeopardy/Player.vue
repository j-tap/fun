<template lang="pug">
v-hover
  template(v-slot:default="{ isHovering, props }")
    v-card(
      v-bind="props"
      :class="$attrs.class"
      :title="value.name"
      color="info"
      variant="outlined"
    )
      template(v-slot:prepend)
        v-icon(:color="value.color" size="x-large" ) mdi-account

      template(v-slot:subtitle)
        span {{ $t('points') }}:
        b(:class="{ 'text-error': value.points < 0 }") {{ value.points }}

      template(v-if="manage" v-slot:append)
        v-fade-transition
          v-btn(
            v-show="isHovering"
            icon="mdi-delete-forever-outline"
            color="error"
            variant="text"
            @click="emit('remove', value)"
          )
</template>

<script setup>
defineProps({
  value: {
    type: Object,
    default: () => ({}),
  },
  manage: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['remove'])
</script>

<style lang="sass" scoped>

</style>
