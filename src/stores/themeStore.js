import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loadTheme, saveTheme } from '../utils/storage'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(loadTheme())

  function applyTheme(val) {
    document.documentElement.setAttribute('data-theme', val)
  }

  function setTheme(val) {
    theme.value = val
    saveTheme(val)
    applyTheme(val)
  }

  // init on first call
  applyTheme(theme.value)

  return { theme, setTheme }
})
