<template>
</template>

<script>
import { EventBus } from '@/utils/EventBus'
const path = require('path')

export default {
  name: 'Notification',

  data() {
    return {
      notification: null
    }
  },

  computed: {
    // store getters
    timeLongBreak() {
      return this.$store.getters.timeLongBreak
    },
    timeShortBreak() {
      return this.$store.getters.timeShortBreak
    },
    timeWork() {
      return this.$store.getters.timeWork
    }
  },

  methods: {
    callNotification(opts) {
      this.notification = new Notification(opts.title, {
        body: opts.body,
        icon: opts.icon || path.join('static', 'icon.png'),
        silent: true
      })
    },

    notifyLongBreak() {
      this.callNotification({
        title: this.$t('notifications.focusComplete'),
        body: this.$t('notifications.longBreakMessage', { minutes: this.timeLongBreak }),
        icon: path.join('static', 'icon--blue.png')
      })
    },

    notifyShortBreak() {
      this.callNotification({
        title: this.$t('notifications.focusComplete'),
        body: this.$t('notifications.shortBreakMessage', { minutes: this.timeShortBreak }),
        icon: path.join('static', 'icon--green.png')
      })
    },

    notifyWork() {
      this.callNotification({
        title: this.$t('notifications.breakFinished'),
        body: this.$t('notifications.workMessage', { minutes: this.timeWork })
      })
    }
  },

  mounted() {
    EventBus.$on('ready-long-break', this.notifyLongBreak)
    EventBus.$on('ready-short-break', this.notifyShortBreak)
    EventBus.$on('ready-work', this.notifyWork)
  },

  beforeDestroy() {
    EventBus.$off('ready-long-break', this.notifyLongBreak)
    EventBus.$off('ready-short-break', this.notifyShortBreak)
    EventBus.$off('ready-work', this.notifyWork)
  }
}
</script>
