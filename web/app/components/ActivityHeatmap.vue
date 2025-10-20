<template>
  <div class="activity-heatmap">
    <!-- Custom Tooltip -->
    <Teleport to="body">
      <div
        v-if="hoveredDay && showTooltip"
        class="fixed z-50 pointer-events-none"
        :style="{
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`,
        }"
      >
        <div
          class="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-sm whitespace-nowrap"
        >
          <div class="font-semibold">{{ formatTooltipDate(hoveredDay.date) }}</div>
          <div class="text-purple-300">${{ hoveredDay.cost.toFixed(2) }}</div>
        </div>
      </div>
    </Teleport>

    <!-- Container for heatmap with fixed day labels -->
    <div class="mb-4">
      <!-- Month labels (synced with grid scroll via transform) -->
      <div class="flex mb-3">
        <div class="w-12 flex-shrink-0"></div>
        <div class="overflow-x-hidden">
          <div
            ref="monthLabelsContainer"
            class="relative transition-transform duration-0"
            :style="{
              width: `${gridWidth}px`,
              height: '16px',
              transform: `translateX(${-scrollLeft}px)`,
            }"
          >
            <div
              v-for="month in monthLabels"
              :key="`${month.month}-${month.offset}`"
              :style="{ position: 'absolute', left: `${month.offset * (cellSize + gap)}px` }"
              class="text-xs text-gray-500 font-medium"
            >
              {{ month.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- Grid with fixed day labels -->
      <div class="flex">
        <!-- Fixed day labels -->
        <div
          class="flex flex-col justify-around w-12 flex-shrink-0 text-xs text-gray-500 pr-2"
          :style="{ height: `${gridHeight}px` }"
        >
          <div>Mon</div>
          <div>Wed</div>
          <div>Fri</div>
        </div>

        <!-- Scrollable grid -->
        <div ref="gridScrollContainer" class="overflow-x-auto" @scroll="syncScroll">
          <div class="flex gap-1" :style="{ width: `${gridWidth}px` }">
            <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="flex flex-col gap-1">
              <div
                v-for="(day, dayIndex) in week"
                :key="dayIndex"
                :class="[
                  'rounded border transition-all duration-200',
                  day.cost > 0
                    ? 'cursor-pointer hover:ring-2 hover:ring-purple-400 hover:scale-110'
                    : '',
                ]"
                :style="{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  backgroundColor: getCellColor(day.cost),
                  borderColor: day.cost > 0 ? getBorderColor(day.cost) : '#e5e7eb',
                }"
                @mouseenter="handleMouseEnter(day, $event)"
                @mousemove="handleMouseMove"
                @mouseleave="handleMouseLeave"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Static Legend -->
    <div class="flex items-center justify-between">
      <div class="text-xs text-gray-600">{{ totalDays }} days of activity</div>
      <div class="flex items-center gap-2 text-xs text-gray-600">
        <span>Less</span>
        <div class="flex gap-1">
          <div
            v-for="(color, index) in legendColors"
            :key="index"
            class="rounded border"
            :style="{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              backgroundColor: color,
              borderColor: index === 0 ? '#e5e7eb' : getBorderColor(legendValues[index]),
            }"
          ></div>
        </div>
        <span>More</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: Array<{ date: string; cost: number }>
  days?: number
  cellSize?: number
  gap?: number
}

const props = withDefaults(defineProps<Props>(), {
  days: 365,
  cellSize: 10,
  gap: 2,
})

const monthLabelsContainer = ref<HTMLDivElement | null>(null)
const gridScrollContainer = ref<HTMLDivElement | null>(null)
const hoveredDay = ref<{ date: string; cost: number } | null>(null)
const showTooltip = ref(false)
const tooltipPosition = ref({ x: 0, y: 0 })
const scrollLeft = ref(0)

// Sync scroll between month labels and grid using transform
const syncScroll = () => {
  if (gridScrollContainer.value) {
    scrollLeft.value = gridScrollContainer.value.scrollLeft
  }
}

// Auto-scroll to the right (most recent) side on mount
onMounted(() => {
  if (gridScrollContainer.value) {
    gridScrollContainer.value.scrollLeft = gridScrollContainer.value.scrollWidth
    scrollLeft.value = gridScrollContainer.value.scrollWidth
  }
})

const weeks = computed(() => {
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - props.days)

  // Adjust to start on Sunday
  const dayOfWeek = startDate.getDay()
  startDate.setDate(startDate.getDate() - dayOfWeek)

  // Create a map of date -> cost
  const dataMap = new Map<string, number>()
  props.data.forEach((d) => {
    dataMap.set(d.date, d.cost)
  })

  // Build weeks array
  const weeksArray: Array<Array<{ date: string | null; cost: number }>> = []
  const currentDate = new Date(startDate)

  while (currentDate <= today) {
    const week: Array<{ date: string | null; cost: number }> = []

    for (let i = 0; i < 7; i++) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const cost = dataMap.get(dateStr) || 0

      // Include all dates in the 90-day window
      if (currentDate >= startDate && currentDate <= today) {
        week.push({ date: dateStr, cost })
      } else {
        week.push({ date: null, cost: 0 })
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    weeksArray.push(week)
  }

  return weeksArray
})

const totalDays = computed(() => {
  return weeks.value.flat().filter((d) => d.date !== null).length
})

const monthLabels = computed(() => {
  const labels: Array<{ label: string; offset: number; month: number }> = []
  let currentMonth = -1
  let monthStartWeek = 0

  weeks.value.forEach((week, weekIndex) => {
    const firstDay = week.find((d) => d.date !== null)
    if (firstDay && firstDay.date) {
      const date = new Date(firstDay.date)
      const month = date.getMonth()

      if (month !== currentMonth) {
        // New month detected
        if (currentMonth !== -1) {
          // We've moved to a new month, so finalize the previous month's label
          const weeksInMonth = weekIndex - monthStartWeek
          // Only show label if month has at least 2 weeks visible
          if (weeksInMonth >= 2) {
            labels.push({
              label: new Date(weeks.value[monthStartWeek][0].date!).toLocaleDateString('en-US', {
                month: 'short',
              }),
              offset: monthStartWeek,
              month: currentMonth,
            })
          }
        }
        currentMonth = month
        monthStartWeek = weekIndex
      }
    }
  })

  // Add the final month if it has enough weeks
  if (currentMonth !== -1) {
    const weeksInMonth = weeks.value.length - monthStartWeek
    if (weeksInMonth >= 2) {
      const firstDayOfMonth = weeks.value[monthStartWeek].find((d) => d.date !== null)
      if (firstDayOfMonth && firstDayOfMonth.date) {
        labels.push({
          label: new Date(firstDayOfMonth.date).toLocaleDateString('en-US', { month: 'short' }),
          offset: monthStartWeek,
          month: currentMonth,
        })
      }
    }
  }

  return labels
})

// Calculate color based on cost
const maxCost = computed(() => {
  return Math.max(...props.data.map((d) => d.cost), 1)
})

const getCellColor = (cost: number) => {
  if (cost === 0) return '#f3f4f6' // gray-100

  const intensity = Math.min(cost / maxCost.value, 1)

  // Purple gradient - matching the app theme
  const colors = [
    '#e9d5ff', // purple-200
    '#c084fc', // purple-400
    '#9333ea', // purple-600
    '#6b21a8', // purple-800
  ]

  if (intensity <= 0.25) return colors[0]
  if (intensity <= 0.5) return colors[1]
  if (intensity <= 0.75) return colors[2]
  return colors[3]
}

const getBorderColor = (cost: number) => {
  if (cost === 0) return '#e5e7eb'

  const intensity = Math.min(cost / maxCost.value, 1)

  const colors = ['#c084fc', '#a855f7', '#7c3aed', '#5b21b6']

  if (intensity <= 0.25) return colors[0]
  if (intensity <= 0.5) return colors[1]
  if (intensity <= 0.75) return colors[2]
  return colors[3]
}

const legendColors = ['#f3f4f6', '#e9d5ff', '#c084fc', '#9333ea', '#6b21a8']
const legendValues = [0, 0.2, 0.4, 0.6, 0.8].map((v) => v * maxCost.value)

const formatTooltipDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Calculate grid dimensions for month label positioning and day label alignment
const gridWidth = computed(() => {
  return weeks.value.length * (props.cellSize + props.gap) - props.gap
})

const gridHeight = computed(() => {
  return 7 * props.cellSize + 6 * props.gap
})

const handleMouseEnter = (day: { date: string | null; cost: number }, event: MouseEvent) => {
  if (!day.date || day.cost === 0) return
  hoveredDay.value = day as { date: string; cost: number }
  showTooltip.value = true
  updateTooltipPosition(event)
}

const handleMouseMove = (event: MouseEvent) => {
  updateTooltipPosition(event)
}

const handleMouseLeave = () => {
  hoveredDay.value = null
  showTooltip.value = false
}

const updateTooltipPosition = (event: MouseEvent) => {
  // Position tooltip above and to the right of cursor
  tooltipPosition.value = {
    x: event.clientX + 10,
    y: event.clientY - 60,
  }
}
</script>

<style scoped>
.activity-heatmap {
  user-select: none;
}
</style>
