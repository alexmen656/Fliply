import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Preferences } from '@capacitor/preferences'

export interface Theme {
  id: string
  name: string
  description: string
  color: string
  cssVars: {
    primary: string
    primaryDark: string
    primaryLight: string
  }
  unlocked: boolean
  cost: number
}

export const useThemesStore = defineStore('themes', () => {
  const themes = ref<Theme[]>([
    {
      id: 'default',
      name: 'Standard',
      description: 'Blau & Modern',
      color: 'bg-[#4255FF]',
      cssVars: {
        primary: '#4255FF',
        primaryDark: '#3644CC',
        primaryLight: '#5A6AFF',
      },
      unlocked: true,
      cost: 0,
    },
    {
      id: 'green',
      name: 'Grün',
      description: 'Frisch & Natürlich',
      color: 'bg-green-500',
      cssVars: {
        primary: '#10B981',
        primaryDark: '#059669',
        primaryLight: '#34D399',
      },
      unlocked: false,
      cost: 100,
    },
    {
      id: 'purple',
      name: 'Lila',
      description: 'Kreativ & Elegant',
      color: 'bg-purple-500',
      cssVars: {
        primary: '#A855F7',
        primaryDark: '#9333EA',
        primaryLight: '#C084FC',
      },
      unlocked: false,
      cost: 150,
    },
    {
      id: 'orange',
      name: 'Orange',
      description: 'Warm & Energisch',
      color: 'bg-orange-500',
      cssVars: {
        primary: '#F97316',
        primaryDark: '#EA580C',
        primaryLight: '#FB923C',
      },
      unlocked: false,
      cost: 150,
    },
    {
      id: 'pink',
      name: 'Pink',
      description: 'Verspielt & Fröhlich',
      color: 'bg-pink-500',
      cssVars: {
        primary: '#EC4899',
        primaryDark: '#DB2777',
        primaryLight: '#F472B6',
      },
      unlocked: false,
      cost: 200,
    },
    {
      id: 'red',
      name: 'Rot',
      description: 'Kraftvoll & Dynamisch',
      color: 'bg-red-500',
      cssVars: {
        primary: '#EF4444',
        primaryDark: '#DC2626',
        primaryLight: '#F87171',
      },
      unlocked: false,
      cost: 200,
    },
  ])

  const currentTheme = ref<string>('default')

  const loadFromStorage = async () => {
    try {
      const { value } = await Preferences.get({ key: 'fliply_themes' })
      if (value) {
        const data = JSON.parse(value) as { themes: Theme[]; currentTheme: string }
        themes.value = themes.value.map((theme) => {
          const saved = data.themes.find((t) => t.id === theme.id)
          return saved ? { ...theme, unlocked: saved.unlocked } : theme
        })
        currentTheme.value = data.currentTheme || 'default'
        applyTheme(currentTheme.value)
      }
    } catch (e) {
      console.error('Error loading themes:', e)
    }
  }

  const saveToStorage = async () => {
    try {
      await Preferences.set({
        key: 'fliply_themes',
        value: JSON.stringify({
          themes: themes.value,
          currentTheme: currentTheme.value,
        }),
      })
    } catch (e) {
      console.error('Error saving themes:', e)
    }
  }

  const unlockTheme = async (themeId: string): Promise<boolean> => {
    const theme = themes.value.find((t) => t.id === themeId)
    if (theme && !theme.unlocked) {
      theme.unlocked = true
      await saveToStorage()
      return true
    }
    return false
  }

  const setTheme = async (themeId: string) => {
    const theme = themes.value.find((t) => t.id === themeId)
    if (theme && theme.unlocked) {
      currentTheme.value = themeId
      applyTheme(themeId)
      await saveToStorage()
    }
  }

  const applyTheme = (themeId: string) => {
    const theme = themes.value.find((t) => t.id === themeId)
    if (theme) {
      document.documentElement.style.setProperty('--color-primary', theme.cssVars.primary)
      document.documentElement.style.setProperty('--color-primary-dark', theme.cssVars.primaryDark)
      document.documentElement.style.setProperty(
        '--color-primary-light',
        theme.cssVars.primaryLight,
      )
    }
  }

  const getUnlockedThemes = () => themes.value.filter((t) => t.unlocked)
  const getLockedThemes = () => themes.value.filter((t) => !t.unlocked)

  return {
    themes,
    currentTheme,
    loadFromStorage,
    saveToStorage,
    unlockTheme,
    setTheme,
    applyTheme,
    getUnlockedThemes,
    getLockedThemes,
  }
})
