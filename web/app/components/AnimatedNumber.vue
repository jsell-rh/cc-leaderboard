<template>
  <span>{{ displayValue }}</span>
</template>

<script setup lang="ts">
interface Props {
  value: number
  decimals?: number
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  decimals: 0,
  duration: 800,
})

// Format initial value
const formatValue = (value: number): string => {
  if (props.decimals > 0) {
    return value.toFixed(props.decimals)
  } else {
    return new Intl.NumberFormat('en-US').format(Math.round(value))
  }
}

const displayValue = ref(formatValue(0))
const tweenedValue = ref(0)

const animateToValue = (targetValue: number) => {
  const startValue = tweenedValue.value
  const startTime = Date.now()
  const endTime = startTime + props.duration
  const diff = targetValue - startValue

  const animate = () => {
    const now = Date.now()
    const progress = Math.min((now - startTime) / props.duration, 1)

    // Easing function (easeOutCubic)
    const eased = 1 - Math.pow(1 - progress, 3)

    tweenedValue.value = startValue + diff * eased
    displayValue.value = formatValue(tweenedValue.value)

    if (now < endTime) {
      requestAnimationFrame(animate)
    } else {
      tweenedValue.value = targetValue
      displayValue.value = formatValue(targetValue)
    }
  }

  requestAnimationFrame(animate)
}

// Animate on mount
onMounted(() => {
  animateToValue(props.value)
})

// Animate on value change (only if value actually changed)
watch(
  () => props.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      animateToValue(newValue)
    }
  }
)
</script>
