<template lang="pug">
.card-stack(ref="elStack")
  .card(:class="{ card_flip: isMainCardFlip}")
    .card__content
      .card__face.card__face_front
        slot
      .card__face.card__face_back
        v-icon(icon="mdi-help" size="x-large")

  .card.card_flip.card_fake(
    v-for="i in 2"
    :key="`card-fake-${i}`"
  )
    .card__content
      .card__face.card__face_back
        v-icon(icon="mdi-help" size="x-large")
</template>

<script setup>
// TODO: Refactoring
import { ref, computed } from 'vue'

const elStack = ref(null)
const elCards = computed(() => elStack.value?.querySelectorAll('.card'))
const isMainCardFlip = ref(true)

async function openCard () {
  const lastCard = elCards.value[elCards.value.length - 1];

  if (!isMainCardFlip.value) {
    isMainCardFlip.value = true
    await delay(500);
  }

  for (let i = 0; i < 3; i++) {
    const animateCard = lastCard.cloneNode(true);
    animateCard.classList.add('card_animate');

    elStack.value.prepend(animateCard);
    await delay(100);

    setTimeout(() => {
      animateCard.remove();
    }, 1000);
  }

  isMainCardFlip.value = false
}

// function getRand (min, max) {
//   return Math.random() * (max - min) + min;
// }

function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

defineExpose({
  openCard,
})
</script>

<style src="./style.sass" lang="sass" scoped />
