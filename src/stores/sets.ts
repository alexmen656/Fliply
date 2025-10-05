import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/axios'
import { useUserStore } from './user'

export interface Card {
  front: string
  back: string
  order: number
}

export interface Set {
  id?: string | number
  userId?: string
  title: string
  cards: Card[] | number
  author: string
  avatar?: string
  icon: string
  isExpert?: boolean
  createdAt?: string
  updatedAt?: string
}

export const useSetsStore = defineStore('sets', () => {
  const mySets = ref<Set[]>([])
  const expertSets = ref<Set[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchMySets = async (forceRefresh = false) => {
    if (mySets.value.length > 0 && !forceRefresh) return

    const userStore = useUserStore()
    const userId = userStore.profile.id

    if (!userId) {
      console.warn('No user ID available, skipping fetchMySets')
      return
    }

    isLoading.value = true
    error.value = null
    try {
      const response = await axios.get(`/api/sets/user/${userId}`)
      if (response.data.success) {
        mySets.value = response.data.data.map((set: any) => ({
          ...set,
          cards: Array.isArray(set.cards) ? set.cards.length : 0,
          avatar: userStore.profile.emoji || '😊',
        }))
      }
    } catch (err) {
      console.error('Error fetching my sets:', err)
      error.value = 'Fehler beim Laden deiner Sets'
    } finally {
      isLoading.value = false
    }
  }

  const fetchExpertSets = async (forceRefresh = false) => {
    if (expertSets.value.length > 0 && !forceRefresh) return

    isLoading.value = true
    error.value = null
    try {
      const response = await axios.get('/api/sets/expert')
      if (response.data.success) {
        expertSets.value = response.data.data.map((set: any) => ({
          ...set,
          cards: Array.isArray(set.cards) ? set.cards.length : 0,
          avatar: set.avatar || 'https://i.pravatar.cc/150?img=1',
        }))
      }
    } catch (err) {
      console.error('Error fetching expert sets:', err)
      error.value = 'Fehler beim Laden der Expert-Sets'
    } finally {
      isLoading.value = false
    }
  }

  const getSetById = async (id: string | number) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.get(`/api/sets/${id}`)
      if (response.data.success) {
        return response.data.data
      }
      return null
    } catch (err) {
      console.error('Error fetching set:', err)
      error.value = 'Fehler beim Laden des Sets'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const createSet = async (setData: {
    title: string
    cards: Card[]
    icon?: string
    isExpert?: boolean
  }) => {
    const userStore = useUserStore()
    const userId = userStore.profile.id

    if (!userId) {
      throw new Error('Kein User eingeloggt')
    }

    isLoading.value = true
    error.value = null
    try {
      const response = await axios.post('/api/sets', {
        userId,
        title: setData.title,
        cards: setData.cards,
        icon: setData.icon || '📚',
        isExpert: setData.isExpert || false,
        author: userStore.profile.name,
        avatar: userStore.profile.emoji,
      })

      if (response.data.success) {
        const newSet = response.data.data
        mySets.value.unshift({
          ...newSet,
          cards: newSet.cards.length,
          avatar: userStore.profile.emoji || '😊',
        })
        return newSet
      }
    } catch (err) {
      console.error('Error creating set:', err)
      error.value = 'Fehler beim Erstellen des Sets'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateSet = async (id: string | number, updates: Partial<Set>) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.put(`/api/sets/${id}`, updates)
      if (response.data.success) {
        const updatedSet = response.data.data
        const index = mySets.value.findIndex((set) => set.id === id)
        if (index !== -1) {
          mySets.value[index] = {
            ...updatedSet,
            cards: Array.isArray(updatedSet.cards) ? updatedSet.cards.length : 0,
          }
        }
        return updatedSet
      }
    } catch (err) {
      console.error('Error updating set:', err)
      error.value = 'Fehler beim Aktualisieren des Sets'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteSet = async (id: string | number) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.delete(`/api/sets/${id}`)
      if (response.data.success) {
        mySets.value = mySets.value.filter((set) => set.id !== id)
        return true
      }
      return false
    } catch (err) {
      console.error('Error deleting set:', err)
      error.value = 'Fehler beim Löschen des Sets'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    mySets,
    expertSets,
    isLoading,
    error,
    fetchMySets,
    fetchExpertSets,
    getSetById,
    createSet,
    updateSet,
    deleteSet,
  }
})
