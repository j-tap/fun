<template lang="pug">
v-hover(v-if="value")
  template(v-slot:default="{ isHovering, props }")
    v-card.text-left(
      v-bind="props"
      :class="$attrs.class"
      :title="value.name || 'Unknown'"
      color="info"
      variant="tonal"
      min-width="260"
    )
      template(v-slot:prepend)
        v-badge.mr-4(
          :color="value.online ? 'success' : 'error'"
          floating
          dot
        )
          v-avatar(:size="40" :color="value.color")
            v-icon mdi-account

      template(v-slot:subtitle)
        span {{ $t('points') }}:&nbsp;
        b(:class="{ 'text-error': value.points < 0 }") {{ value.points || 0 }}

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
import { ref } from 'vue'
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

function copyLink () {
  const route = router.resolve(props.link)
  copy(`${window.location.origin}${route.href}`)

  if (copied) {
    showTooltip.value = true
  }
}
</script>

<style lang="sass" scoped>
</style>
