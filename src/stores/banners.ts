import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Preferences } from '@capacitor/preferences'

export interface Banner {
  id: string
  name: string
  description: string
  gradient: string
  unlocked: boolean
  cost: number
}

export const useBannersStore = defineStore('banners', () => {
  const banners = ref<Banner[]>([
    {
      id: 'default',
      name: 'Standard Blau',
      description: 'Der klassische Look',
      gradient: 'bg-gradient-to-br from-[#4255FF] to-indigo-600',
      unlocked: true,
      cost: 0,
    },
    {
      id: 'sunset',
      name: 'Sonnenuntergang',
      description: 'Warme Orange-Töne',
      gradient: 'bg-gradient-to-br from-orange-400 to-pink-600',
      unlocked: false,
      cost: 150,
    },
    {
      id: 'forest',
      name: 'Wald',
      description: 'Natürliche Grün-Töne',
      gradient: 'bg-gradient-to-br from-green-400 to-emerald-600',
      unlocked: false,
      cost: 150,
    },
    {
      id: 'ocean',
      name: 'Ozean',
      description: 'Tiefes Blau',
      gradient: 'bg-gradient-to-br from-blue-400 to-cyan-600',
      unlocked: false,
      cost: 200,
    },
    {
      id: 'purple_rain',
      name: 'Lila Regen',
      description: 'Mystisches Lila',
      gradient: 'bg-gradient-to-br from-purple-400 to-pink-600',
      unlocked: false,
      cost: 200,
    },
    {
      id: 'fire',
      name: 'Feuer',
      description: 'Heiße Rot-Töne',
      gradient: 'bg-gradient-to-br from-red-500 to-orange-600',
      unlocked: false,
      cost: 250,
    },
    {
      id: 'rainbow',
      name: 'Regenbogen',
      description: 'Bunte Farbenpracht',
      gradient: 'bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500',
      unlocked: false,
      cost: 300,
    },
    {
      id: 'midnight',
      name: 'Mitternacht',
      description: 'Dunkles Violett',
      gradient: 'bg-gradient-to-br from-indigo-900 to-purple-900',
      unlocked: false,
      cost: 250,
    },
    {
      id: 'gold',
      name: 'Gold',
      description: 'Luxuriös & Glänzend',
      gradient: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      unlocked: false,
      cost: 350,
    },
  ])

  const currentBanner = ref<string>('default')

  const loadFromStorage = async () => {
    try {
      const { value } = await Preferences.get({ key: 'fliply_banners' })
      if (value) {
        const data = JSON.parse(value) as { banners: Banner[]; currentBanner: string }
        banners.value = banners.value.map((banner) => {
          const saved = data.banners.find((b) => b.id === banner.id)
          return saved ? { ...banner, unlocked: saved.unlocked } : banner
        })
        currentBanner.value = data.currentBanner || 'default'
      }
    } catch (e) {
      console.error('Error loading banners:', e)
    }
  }

  const saveToStorage = async () => {
    try {
      await Preferences.set({
        key: 'fliply_banners',
        value: JSON.stringify({
          banners: banners.value,
          currentBanner: currentBanner.value,
        }),
      })
    } catch (e) {
      console.error('Error saving banners:', e)
    }
  }

  const unlockBanner = async (bannerId: string): Promise<boolean> => {
    const banner = banners.value.find((b) => b.id === bannerId)
    if (banner && !banner.unlocked) {
      banner.unlocked = true
      await saveToStorage()
      return true
    }
    return false
  }

  const setBanner = async (bannerId: string) => {
    const banner = banners.value.find((b) => b.id === bannerId)
    if (banner && banner.unlocked) {
      currentBanner.value = bannerId
      await saveToStorage()
    }
  }

  const getCurrentBanner = () => {
    return banners.value.find((b) => b.id === currentBanner.value) || banners.value[0]
  }

  const getUnlockedBanners = () => banners.value.filter((b) => b.unlocked)
  const getLockedBanners = () => banners.value.filter((b) => !b.unlocked)

  return {
    banners,
    currentBanner,
    loadFromStorage,
    saveToStorage,
    unlockBanner,
    setBanner,
    getCurrentBanner,
    getUnlockedBanners,
    getLockedBanners,
  }
})
