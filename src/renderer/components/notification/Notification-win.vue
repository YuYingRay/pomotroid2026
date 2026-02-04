<template></template>

<script>
import { EventBus } from '@/utils/EventBus'
import { logger } from '@/utils/logger'

const notifier = require('node-notifier')
const path = require('path')

export default {
  name: 'Notification-win',

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
      notifier.notify(
        {
          appName: 'com.splode.pomotroid',
          title: opts.title || this.$t('notifications.focusComplete'),
          message: opts.message,
          icon: opts.icon || path.join(__static, 'icon.png'),
          sound: false
        },
        (err, res) => {
          if (err) {
            logger.error(err)
          }
        }
      )
    },

    notifyLongBreak() {
      this.callNotification({
        title: this.$t('notifications.focusComplete'),
        message: this.$t('notifications.longBreakMessage', { minutes: this.timeLongBreak }),
        icon: path.join(__static, 'icon--blue.png')
      })
    },

    notifyShortBreak() {
      this.callNotification({
        title: this.$t('notifications.focusComplete'),
        message: this.$t('notifications.shortBreakMessage', { minutes: this.timeShortBreak }),
        icon: path.join(__static, 'icon--green.png')
      })
    },

    notifyWork() {
      this.callNotification({
        title: this.$t('notifications.breakFinished'),
        message: this.$t('notifications.workMessage', { minutes: this.timeWork })
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
