<template lang="pug">
v-hover
  template(v-slot:default="{ isHovering, props }")
    v-card(
      v-bind="props"
      :class="$attrs.class"
      :title="value.name"
      :to="link"
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
          .d-flex(v-if="isHovering")
            v-btn(
              icon="mdi-delete-forever-outline"
              color="error"
              variant="text"
              size="small"
              @click.stop.prevent="emit('remove', value)"
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
                  @click.stop.prevent="copyLink"
                )
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useClipboard } from '@vueuse/core'

const { copy, copied } = useClipboard()
const router = useRouter()
const showTooltip = ref(false)

const props = defineProps({
  value: {
    type: Object,
    default: () => ({}),
  },
  link: {
    type: Object,
    default: undefined,
  },
  manage: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['remove'])
// const link = computed(() => router.)

function copyLink () {
  copy(props.value.token)
  if (copied) {
    showTooltip.value = true
  }
}
</script>

<style lang="sass" scoped>

</style>
