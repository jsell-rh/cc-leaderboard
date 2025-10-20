<template>
  <svg
    v-if="points.length > 1"
    :width="width"
    :height="height"
    class="sparkline"
    :viewBox="`0 0 ${width} ${height}`"
    preserveAspectRatio="none"
  >
    <polyline
      :key="polylinePoints"
      ref="pathRef"
      :points="polylinePoints"
      fill="none"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="sparkline-path"
    />
    <circle
      v-if="showDots"
      v-for="(point, index) in normalizedPoints"
      :key="index"
      :cx="point.x"
      :cy="point.y"
      :r="dotRadius"
      :fill="color"
      class="sparkline-dot"
      :style="{ animationDelay: `${0.5 + index * 0.05}s` }"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  data: Array<{ date: string; cost: number }>
  width?: number
  height?: number
  color?: string
  strokeWidth?: number
  showDots?: boolean
  dotRadius?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 120,
  height: 30,
  color: '#8b5cf6',
  strokeWidth: 2,
  showDots: false,
  dotRadius: 2,
})

const points = computed(() => {
  return props.data.map((d) => d.cost)
})

const normalizedPoints = computed(() => {
  if (points.value.length === 0) return []

  const min = Math.min(...points.value)
  const max = Math.max(...points.value)
  const range = max - min || 1 // Avoid division by zero

  return points.value.map((value, index) => {
    const x = (index / (points.value.length - 1)) * props.width
    const y = props.height - ((value - min) / range) * props.height
    return { x, y }
  })
})

const polylinePoints = computed(() => {
  return normalizedPoints.value.map((p) => `${p.x},${p.y}`).join(' ')
})

const pathRef = ref<SVGPolylineElement | null>(null)
const previousPoints = ref<string>('')

const animatePath = () => {
  if (pathRef.value) {
    const length = pathRef.value.getTotalLength()
    pathRef.value.style.strokeDasharray = `${length}`
    pathRef.value.style.strokeDashoffset = `${length}`

    // Force reflow to restart animation
    void pathRef.value.offsetWidth

    pathRef.value.style.strokeDashoffset = '0'
  }
}

// Animate path on mount and when data actually changes
watch(
  polylinePoints,
  (newPoints) => {
    if (newPoints !== previousPoints.value) {
      previousPoints.value = newPoints
      nextTick(() => {
        animatePath()
      })
    }
  },
  { flush: 'post' }
)

onMounted(() => {
  previousPoints.value = polylinePoints.value
  // Use nextTick to ensure SVG is fully rendered
  nextTick(() => {
    if (pathRef.value) {
      const length = pathRef.value.getTotalLength()
      pathRef.value.style.strokeDasharray = `${length}`
      pathRef.value.style.strokeDashoffset = `${length}`

      // Trigger animation after a brief delay to ensure styles are applied
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (pathRef.value) {
            pathRef.value.style.strokeDashoffset = '0'
          }
        })
      })
    }
  })
})
</script>

<style scoped>
.sparkline {
  display: block;
}

.sparkline-path {
  transition: stroke-dashoffset 1s ease-in-out;
}

.sparkline-dot {
  opacity: 0;
  animation: fade-in 0.3s ease-in forwards;
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}
</style>
