import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Preferences } from '@capacitor/preferences'

export interface Avatar {
  id: string
  url: string
  name: string
  cost: number
  unlocked: boolean
}

export const useAvatarsStore = defineStore('avatars', () => {
  const avatars = ref<Avatar[]>([
    {
      id: 'default',
      url: 'https://i.pravatar.cc/150?img=1',
      name: 'Standard',
      cost: 0,
      unlocked: true,
    },
    {
      id: 'avatar2',
      url: 'https://i.pravatar.cc/150?img=2',
      name: 'Cool Guy',
      cost: 50,
      unlocked: false,
    },
    {
      id: 'avatar3',
      url: 'https://i.pravatar.cc/150?img=3',
      name: 'Smart Lady',
      cost: 50,
      unlocked: false,
    },
    {
      id: 'avatar4',
      url: 'https://i.pravatar.cc/150?img=4',
      name: 'Happy Person',
      cost: 100,
      unlocked: false,
    },
    {
      id: 'avatar5',
      url: 'https://i.pravatar.cc/150?img=5',
      name: 'Business Pro',
      cost: 100,
      unlocked: false,
    },
    {
      id: 'avatar6',
      url: 'https://i.pravatar.cc/150?img=6',
      name: 'Creative Mind',
      cost: 150,
      unlocked: false,
    },
    {
      id: 'avatar7',
      url: 'https://i.pravatar.cc/150?img=7',
      name: 'Tech Guru',
      cost: 150,
      unlocked: false,
    },
    {
      id: 'avatar8',
      url: 'https://i.pravatar.cc/150?img=8',
      name: 'Adventure Seeker',
      cost: 200,
      unlocked: false,
    },
    {
      id: 'avatar9',
      url: 'https://i.pravatar.cc/150?img=9',
      name: 'Wisdom Master',
      cost: 200,
      unlocked: false,
    },
    {
      id: 'avatar10',
      url: 'https://i.pravatar.cc/150?img=10',
      name: 'Legend',
      cost: 500,
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
