<template>
  <transition name="fade">
    <div v-if="visible" class="Modal-overlay" @click.self="selectLanguage('en')">
      <div class="Modal">
        <div class="Modal-header">
          <h2 class="Modal-title">Select Language / 选择语言</h2>
        </div>
        <div class="Modal-body">
          <button
            class="Lang-option"
            @click="selectLanguage('en')"
          >
            <span class="Lang-flag">🇺🇸</span>
            <span class="Lang-name">English</span>
          </button>
          <button
            class="Lang-option"
            @click="selectLanguage('zh-CN')"
          >
            <span class="Lang-flag">🇨🇳</span>
            <span class="Lang-name">简体中文</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { setLocale, isFirstLaunch } from '@/i18n'
import { ipcRenderer } from 'electron'

export default {
  name: 'LanguageModal',

  data() {
    return {
      visible: false
    }
  },

  mounted() {
    // Show modal on first launch
    if (isFirstLaunch()) {
      this.visible = true
    }
  },

  methods: {
    selectLanguage(locale) {
      setLocale(locale)
      this.visible = false
      // Notify main process to update tray menu
      ipcRenderer.send('locale-changed', locale)
    }
  }
}
</script>

<style lang="scss" scoped>
.Modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.Modal {
  background: var(--color-background-light);
  border-radius: 12px;
  padding: 24px;
  min-width: 280px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.Modal-header {
  text-align: center;
  margin-bottom: 24px;
}

.Modal-title {
  color: var(--color-foreground);
  font-size: 18px;
  font-weight: 400;
  margin: 0;
}

.Modal-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.Lang-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: var(--color-background);
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-accent);
    background: var(--color-background-lightest);
  }
}

.Lang-flag {
  font-size: 28px;
}

.Lang-name {
  font-size: 16px;
  color: var(--color-foreground);
  font-weight: 500;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
