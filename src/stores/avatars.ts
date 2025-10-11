import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Preferences } from '@capacitor/preferences'

export interface Avatar {
  id: string
  url: string
  cost: number
  unlocked: boolean
}

export const useAvatarsStore = defineStore('avatars', () => {
  const avatars = ref<Avatar[]>([
    {
      id: 'default',
      url: 'avatar1.png',
      cost: 0,
      unlocked: true,
    },
    {
      id: 'avatar2',
      url: 'avatar2.png',
      cost: 50,
      unlocked: false,
    },
    {
      id: 'avatar3',
      url: 'avatar3.png',
      cost: 50,
      unlocked: false,
    },
    {
      id: 'avatar4',
      url: 'avatar4.png',
      cost: 100,
      unlocked: false,
    },
    {
      id: 'avatar5',
      url: 'avatar5.png',
      cost: 100,
      unlocked: false,
    },
    {
      id: 'avatar6',
      url: 'avatar6.png',
      cost: 150,
      unlocked: false,
    },
    {
      id: 'avatar7',
      url: 'avatar7.png',
      cost: 150,
      unlocked: false,
    },
    {
      id: 'avatar8',
      url: 'avatar8.png',
      cost: 200,
      unlocked: false,
    },
  ])

  const loadFromStorage = async () => {
    try {
      const { value } = await Preferences.get({ key: 'fliply_avatars' })
      if (value) {
        const data = JSON.parse(value) as Avatar[]
        avatars.value = avatars.value.map((avatar) => {
          const saved = data.find((a) => a.id === avatar.id)
          return saved ? { ...avatar, unlocked: saved.unlocked } : avatar
        })
      }
    } catch (e) {
      console.error('Error loading avatars data:', e)
    }
  }

  const saveToStorage = async () => {
    try {
      await Preferences.set({
        key: 'fliply_avatars',
        value: JSON.stringify(avatars.value),
      })
    } catch (e) {
      console.error('Error saving avatars data:', e)
    }
  }

  const unlockAvatar = async (avatarId: string) => {
    const avatar = avatars.value.find((a) => a.id === avatarId)
    if (avatar) {
      avatar.unlocked = true
      await saveToStorage()
    }
  }

  const getUnlockedAvatars = () => {
    return avatars.value.filter((a) => a.unlocked)
  }

  const getLockedAvatars = () => {
    return avatars.value.filter((a) => !a.unlocked)
  }

  return {
    avatars,
    loadFromStorage,
    saveToStorage,
    unlockAvatar,
    getUnlockedAvatars,
    getLockedAvatars,
  }
})
