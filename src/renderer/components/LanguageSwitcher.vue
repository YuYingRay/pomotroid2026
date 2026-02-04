<template>
  <div
    class="Lang-switcher"
    :title="$t('language.title')"
    @click="toggleLanguage"
  >
    <span class="Lang-flag">{{ currentFlag }}</span>
    <span class="Lang-code">{{ currentCode }}</span>
  </div>
</template>

<script>
import { setLocale, getLocale } from '@/i18n'
import { ipcRenderer } from 'electron'

export default {
  name: 'LanguageSwitcher',

  data() {
    return {
      locales: [
        { code: 'en', flag: '🇺🇸', label: 'EN' },
        { code: 'zh-CN', flag: '🇨🇳', label: '中文' }
      ]
    }
  },

  computed: {
    currentLocale() {
      return getLocale()
    },
    currentFlag() {
      const locale = this.locales.find(l => l.code === this.currentLocale)
      return locale ? locale.flag : '🇺🇸'
    },
    currentCode() {
      const locale = this.locales.find(l => l.code === this.currentLocale)
      return locale ? locale.label : 'EN'
    }
  },

  methods: {
    toggleLanguage() {
      const currentIndex = this.locales.findIndex(l => l.code === this.currentLocale)
      const nextIndex = (currentIndex + 1) % this.locales.length
      const newLocale = this.locales[nextIndex].code
      setLocale(newLocale)
      this.$forceUpdate()
      // Notify main process to update tray menu
      ipcRenderer.send('locale-changed', newLocale)
    }
  }
}
</script>

<style lang="scss" scoped>
.Lang-switcher {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  margin-right: 8px;
  border-radius: 4px;
  background: var(--color-background);
  cursor: pointer;
  transition: $transitionDefault;
  -webkit-app-region: no-drag;

  &:hover {
    background: var(--color-background-light);
  }
}

.Lang-flag {
  font-size: 14px;
  line-height: 1;
}

.Lang-code {
  font-size: 11px;
  color: var(--color-foreground-darker);
  font-weight: 500;
}
</style>
