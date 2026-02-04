<template>
  <!-- Empty template - celebration is shown in a separate window -->
  <div></div>
</template>

<script>
import { EventBus } from '@/utils/EventBus'
import { ipcRenderer } from 'electron'

export default {
  name: 'Celebration',

  computed: {
    celebrationEnabled() {
      return this.$store.getters.celebrationEnabled
    },
    celebrationTrigger() {
      return this.$store.getters.celebrationTrigger
    },
    celebrationDuration() {
      return this.$store.getters.celebrationDuration
    },
    celebrationStyle() {
      return this.$store.getters.celebrationStyle
    }
  },

  methods: {
    triggerCelebration(eventType) {
      if (!this.celebrationEnabled) return

      const trigger = this.celebrationTrigger
      let shouldTrigger = false

      switch (trigger) {
        case 'work':
          shouldTrigger = eventType === 'work-complete'
          break
        case 'break':
          shouldTrigger = eventType === 'break-complete'
          break
        case 'all':
          shouldTrigger = true
          break
        case 'cycle':
          shouldTrigger = eventType === 'cycle-complete'
          break
      }

      if (shouldTrigger) {
        this.startCelebration()
      }
    },

    startCelebration() {
      // Send IPC to main process to create independent celebration window
      ipcRenderer.send('show-celebration', {
        duration: this.celebrationDuration,
        style: this.celebrationStyle
      })
    },

    onWorkComplete() {
      this.triggerCelebration('work-complete')
    },

    onBreakComplete() {
      this.triggerCelebration('break-complete')
    },

    onCycleComplete() {
      this.triggerCelebration('cycle-complete')
    }
  },

  mounted() {
    // Work complete -> short break or long break
    EventBus.$on('ready-short-break', this.onWorkComplete)
    EventBus.$on('ready-long-break', () => {
      this.onWorkComplete()
      this.onCycleComplete()
    })
    // Break complete -> work
    EventBus.$on('ready-work', this.onBreakComplete)
  },

  beforeDestroy() {
    EventBus.$off('ready-short-break', this.onWorkComplete)
    EventBus.$off('ready-long-break')
    EventBus.$off('ready-work', this.onBreakComplete)
  }
}
</script>
