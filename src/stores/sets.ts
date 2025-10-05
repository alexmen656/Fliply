import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/axios'
import { useUserStore } from './user'
import { Preferences } from '@capacitor/preferences'

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

export interface RecentSet {
  setId: string | number
  accessedAt: string
  title?: string
  cards?: number
}

export const useSetsStore = defineStore('sets', () => {
  const mySets = ref<Set[]>([])
  const expertSets = ref<Set[]>([])
  const favoriteSets = ref<Set[]>([])
  const recentSets = ref<RecentSet[]>([])
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
        await updateTotalCardsCount()
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
        await updateTotalCardsCount()
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
        await updateTotalCardsCount()
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
        await updateTotalCardsCount()
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

  const updateTotalCardsCount = async () => {
    try {
      let totalCards = 0
      for (const set of mySets.value) {
        totalCards += typeof set.cards === 'number' ? set.cards : (set.cards as any[]).length
      }
      await Preferences.set({ key: 'fliply_total_cards', value: totalCards.toString() })

      try {
        const { useAchievementsStore } = await import('./achievements')
        const achievementsStore = useAchievementsStore()
        await achievementsStore.checkAndUnlockAchievements()
      } catch (error) {
        console.error('Error checking achievements:', error)
      }
    } catch (error) {
      console.error('Error updating total cards count:', error)
    }
  }

  // Favoriten laden
  const loadFavorites = async () => {
    try {
      const { value } = await Preferences.get({ key: 'fliply_favorites' })
      if (value) {
        const favoriteIds: (string | number)[] = JSON.parse(value)
        // Lade die Details für jedes Favoriten-Set
        const promises = favoriteIds.map((id) => getSetById(id))
        const results = await Promise.all(promises)
        favoriteSets.value = results
          .filter((set) => set !== null)
          .map((set: any) => ({
            ...set,
            cards: Array.isArray(set.cards) ? set.cards.length : 0,
          }))
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }

  // Favoriten speichern
  const saveFavorites = async () => {
    try {
      const favoriteIds = favoriteSets.value.map((set) => set.id).filter((id) => id !== undefined)
      await Preferences.set({
        key: 'fliply_favorites',
        value: JSON.stringify(favoriteIds),
      })
    } catch (error) {
      console.error('Error saving favorites:', error)
    }
  }

  // Favorit hinzufügen/entfernen
  const toggleFavorite = async (setId: string | number) => {
    const index = favoriteSets.value.findIndex((set) => set.id === setId)
    if (index !== -1) {
      // Entfernen
      favoriteSets.value.splice(index, 1)
    } else {
      // Hinzufügen
      const set = await getSetById(setId)
      if (set) {
        favoriteSets.value.push({
          ...set,
          cards: Array.isArray(set.cards) ? set.cards.length : 0,
        })
      }
    }
    await saveFavorites()
  }

  // Prüfen ob ein Set ein Favorit ist
  const isFavorite = (setId: string | number) => {
    return favoriteSets.value.some((set) => set.id === setId)
  }

  // Zuletzt verwendete Sets laden
  const loadRecentSets = async () => {
    try {
      const { value } = await Preferences.get({ key: 'fliply_recent_sets' })
      if (value) {
        recentSets.value = JSON.parse(value)
      }
    } catch (error) {
      console.error('Error loading recent sets:', error)
    }
  }

  // Set als "zuletzt verwendet" markieren
  const markAsRecent = async (setId: string | number, title: string, cards: number) => {
    try {
      // Entferne das Set falls es schon existiert
      recentSets.value = recentSets.value.filter((set) => set.setId !== setId)

      // Füge es am Anfang hinzu
      recentSets.value.unshift({
        setId,
        title,
        cards,
        accessedAt: new Date().toISOString(),
      })

      // Behalte nur die letzten 10
      if (recentSets.value.length > 10) {
        recentSets.value = recentSets.value.slice(0, 10)
      }

      // Speichern
      await Preferences.set({
        key: 'fliply_recent_sets',
        value: JSON.stringify(recentSets.value),
      })
    } catch (error) {
      console.error('Error marking set as recent:', error)
    }
  }

  // Zuletzt verwendete Sets mit Details abrufen
  const getRecentSetsWithDetails = async () => {
    await loadRecentSets()
    const setsWithDetails = []

    for (const recent of recentSets.value) {
      // Versuche, das Set aus mySets oder expertSets zu finden
      let set =
        mySets.value.find((s) => s.id === recent.setId) ||
        expertSets.value.find((s) => s.id === recent.setId)

      // Falls nicht gefunden, hole von API
      if (!set) {
        set = await getSetById(recent.setId)
      }

      if (set) {
        setsWithDetails.push({
          ...set,
          cards: Array.isArray(set.cards) ? set.cards.length : set.cards || recent.cards || 0,
          accessedAt: recent.accessedAt,
        })
      }
    }

    return setsWithDetails
  }

  return {
    mySets,
    expertSets,
    favoriteSets,
    recentSets,
    isLoading,
    error,
    fetchMySets,
    fetchExpertSets,
    getSetById,
    createSet,
    updateSet,
    deleteSet,
    updateTotalCardsCount,
    loadFavorites,
    toggleFavorite,
    isFavorite,
    loadRecentSets,
    markAsRecent,
    getRecentSetsWithDetails,
  }
})
