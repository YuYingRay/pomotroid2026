<template>
  <div
    v-if="showOverlay"
    class="celebration-overlay"
    @click="closeCelebration"
    ref="overlay"
  >
    <canvas ref="confettiCanvas" class="confetti-canvas"></canvas>
    <div class="close-hint">{{ $t('celebration.clickToClose') }}</div>
  </div>
</template>

<script>
import { EventBus } from '@/utils/EventBus'
import confetti from 'canvas-confetti'
import { remote } from 'electron'

export default {
  name: 'Celebration',

  data() {
    return {
      showOverlay: false,
      myConfetti: null,
      animationTimer: null,
      escHandler: null
    }
  },

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
      // Enter fullscreen
      const win = remote.getCurrentWindow()
      if (!win.isFullScreen()) {
        win.setFullScreen(true)
      }

      this.showOverlay = true

      this.$nextTick(() => {
        if (this.$refs.overlay) {
          this.$refs.overlay.focus()
        }

        const canvas = this.$refs.confettiCanvas
        if (canvas) {
          canvas.width = window.screen.width
          canvas.height = window.screen.height

          this.myConfetti = confetti.create(canvas, {
            resize: true,
            useWorker: true
          })

          this.runAnimation()
        }

        // Auto close after duration
        this.animationTimer = setTimeout(() => {
          this.closeCelebration()
        }, this.celebrationDuration * 1000)
      })
    },

    runAnimation() {
      const duration = this.celebrationDuration * 1000
      const end = Date.now() + duration
      const style = this.celebrationStyle

      if (style === 'fireworks') {
        this.fireworksAnimation(end)
      } else if (style === 'stars') {
        this.starsAnimation(end)
      } else {
        this.confettiAnimation(end)
      }
    },

    confettiAnimation(end) {
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8', '#a29bfe']

      const frame = () => {
        if (!this.showOverlay || !this.myConfetti) return

        this.myConfetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: colors
        })
        this.myConfetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: colors
        })

        if (Date.now() < end && this.showOverlay) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    },

    fireworksAnimation(end) {
      const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6fff', '#ffffff', '#ff9f43']

      const randomInRange = (min, max) => Math.random() * (max - min) + min

      const firework = () => {
        if (!this.showOverlay || !this.myConfetti || Date.now() > end) return

        // Create explosion effect
        const x = randomInRange(0.2, 0.8)
        const y = randomInRange(0.2, 0.6)

        // Main burst
        this.myConfetti({
          particleCount: 80,
          spread: 360,
          origin: { x, y },
          colors: colors,
          startVelocity: 30,
          gravity: 0.8,
          scalar: 1.2,
          ticks: 60,
          shapes: ['circle', 'square']
        })

        // Secondary sparkles
        setTimeout(() => {
          if (!this.showOverlay || !this.myConfetti) return
          this.myConfetti({
            particleCount: 30,
            spread: 360,
            origin: { x, y },
            colors: ['#fff', '#ffd700', '#ff6b6b'],
            startVelocity: 20,
            gravity: 0.5,
            scalar: 0.8,
            ticks: 40
          })
        }, 100)

        if (this.showOverlay && Date.now() < end) {
          setTimeout(firework, randomInRange(200, 400))
        }
      }

      // Start multiple fireworks
      firework()
      setTimeout(() => {
        if (this.showOverlay) firework()
      }, 150)
    },

    starsAnimation(end) {
      const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8']
      }

      const shoot = () => {
        if (!this.showOverlay || !this.myConfetti || Date.now() > end) return

        this.myConfetti({
          ...defaults,
          particleCount: 40,
          scalar: 1.2,
          shapes: ['star'],
          origin: { x: Math.random(), y: Math.random() * 0.5 }
        })

        this.myConfetti({
          ...defaults,
          particleCount: 10,
          scalar: 0.75,
          shapes: ['circle'],
          origin: { x: Math.random(), y: Math.random() * 0.5 }
        })

        if (this.showOverlay && Date.now() < end) {
          setTimeout(shoot, 400)
        }
      }
      shoot()
    },

    closeCelebration() {
      this.showOverlay = false

      // Exit fullscreen
      const win = remote.getCurrentWindow()
      if (win.isFullScreen()) {
        win.setFullScreen(false)
      }

      if (this.animationTimer) {
        clearTimeout(this.animationTimer)
        this.animationTimer = null
      }
      if (this.myConfetti) {
        this.myConfetti.reset()
        this.myConfetti = null
      }
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

    // ESC key handler
    this.escHandler = (e) => {
      if (e.key === 'Escape' && this.showOverlay) {
        this.closeCelebration()
      }
    }
    document.addEventListener('keydown', this.escHandler)
  },

  beforeDestroy() {
    EventBus.$off('ready-short-break', this.onWorkComplete)
    EventBus.$off('ready-long-break')
    EventBus.$off('ready-work', this.onBreakComplete)
    if (this.escHandler) {
      document.removeEventListener('keydown', this.escHandler)
    }
    this.closeCelebration()
  }
}
</script>

<style lang="scss" scoped>
.celebration-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 40px;
}

.confetti-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.close-hint {
  color: white;
  font-size: 16px;
  background: rgba(0, 0, 0, 0.6);
  padding: 12px 24px;
  border-radius: 30px;
  z-index: 100000;
  font-weight: 500;
}
</style>
