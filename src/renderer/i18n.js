import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'
import { createLocalStore } from './utils/LocalStore'

Vue.use(VueI18n)

const localStore = createLocalStore()

const messages = {
  en,
  'zh-CN': zhCN
}

// Get saved language or detect system language
function getDefaultLocale() {
  const savedLocale = localStore.get('locale')
  if (savedLocale) {
    return savedLocale
  }

  // Check if first launch (no locale saved)
  const isFirstLaunch = localStore.get('firstLaunchComplete') !== true
  if (isFirstLaunch) {
    return null // Will trigger language selection modal
  }

  // Fallback to system language detection
  const systemLang = navigator.language || navigator.userLanguage
  if (systemLang.startsWith('zh')) {
    return 'zh-CN'
  }
  return 'en'
}

const locale = getDefaultLocale() || 'en'

const i18n = new VueI18n({
  locale,
  fallbackLocale: 'en',
  messages,
  silentTranslationWarn: true
})

export function setLocale(locale) {
  i18n.locale = locale
  localStore.set('locale', locale)
  localStore.set('firstLaunchComplete', true)
}

export function getLocale() {
  return i18n.locale
}

export function isFirstLaunch() {
  return localStore.get('firstLaunchComplete') !== true
}

export default i18n
