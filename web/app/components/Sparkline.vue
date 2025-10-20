<template>
  <ClientOnly>
    <svg
      v-if="points.length > 1"
      :width="width"
      :height="height"
      class="sparkline"
      :viewBox="`0 0 ${width} ${height}`"
      preserveAspectRatio="none"
    >
      <polyline
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
        :style="{ animationDelay: `${1 + index * 0.05}s` }"
      />
    </svg>
  </ClientOnly>
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
const hasAnimated = ref(false)

const animatePath = () => {
  if (!pathRef.value) return

  try {
    const length = pathRef.value.getTotalLength()

    // Temporarily disable transition to set initial state
    pathRef.value.style.transition = 'none'
    pathRef.value.style.strokeDasharray = `${length}`
    pathRef.value.style.strokeDashoffset = `${length}`

    // Force browser to acknowledge the style change
    pathRef.value.offsetHeight // trigger reflow

    // Re-enable transition and animate in next frame
    requestAnimationFrame(() => {
      if (pathRef.value) {
        pathRef.value.style.transition = 'stroke-dashoffset 1s ease-in-out'
        requestAnimationFrame(() => {
          if (pathRef.value) {
            pathRef.value.style.strokeDashoffset = '0'
          }
        })
      }
    })
  } catch (error) {
    console.error('Failed to animate sparkline:', error)
  }
}

// Animate on mount and when data changes
onMounted(() => {
  previousPoints.value = polylinePoints.value

  // Try immediately
  if (pathRef.value) {
    hasAnimated.value = true
    animatePath()
  } else {
    // If not ready, wait and try again
    setTimeout(() => {
      if (pathRef.value && !hasAnimated.value) {
        hasAnimated.value = true
        animatePath()
      }
    }, 100)
  }
})

// Animate when data actually changes
watch(
  polylinePoints,
  (newPoints) => {
    if (newPoints !== previousPoints.value && hasAnimated.value) {
      previousPoints.value = newPoints
      nextTick(() => {
        animatePath()
      })
    }
  },
  { flush: 'post' }
)
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
