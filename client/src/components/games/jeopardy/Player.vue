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
          .d-flex(v-show="isHovering")
            v-btn(
              icon="mdi-delete-forever-outline"
              color="error"
              variant="text"
              size="small"
              @click="emit('remove', value)"
            )
            v-tooltip(
              v-model="showTooltip"
              :text="$t('copied')"
              :open-on-hover="false"
              @click:outside="showTooltip = false"
            )
              template(v-slot:activator="{ props }")
                v-btn(
                  v-bind="props"
                  icon="mdi-content-copy"
                  color="info"
                  variant="text"
                  size="small"
                  @click="copyToken"
                )
</template>

<script setup>
import { ref } from 'vue'
import { useClipboard } from '@vueuse/core'

const { copy, copied } = useClipboard()
const showTooltip = ref(false)

const props = defineProps({
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

function copyToken () {
  copy(props.value.token)
  if (copied) {
    showTooltip.value = true
  }
}
</script>

<style lang="sass" scoped>

</style>
