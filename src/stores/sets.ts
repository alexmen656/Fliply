import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Set {
  id: number
  title: string
  cards: number
  author: string
  avatar: string
  icon: string
}

export const useSetsStore = defineStore('sets', () => {
  const mySets = ref<Set[]>([])
  const expertSets = ref<Set[]>([])
  const isLoading = ref(false)

  const fetchMySets = async (axios: any) => {
    if (mySets.value.length > 0) return

    isLoading.value = true
    try {
      const response = await axios.get('/api/my-sets')
      mySets.value = response.data
    } catch (error) {
      console.error('Error fetching my sets:', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchExpertSets = async (axios: any) => {
    if (expertSets.value.length > 0) return

    isLoading.value = true
    try {
      const response = await axios.get('/api/expert-sets')
      expertSets.value = response.data
    } catch (error) {
      console.error('Error fetching expert sets:', error)
    } finally {
      isLoading.value = false
    }
  }

  const addSet = (set: Set) => {
    mySets.value.push(set)
  }

  const removeSet = (id: number) => {
    mySets.value = mySets.value.filter((set) => set.id !== id)
  }

  const updateSet = (id: number, updatedSet: Partial<Set>) => {
    const index = mySets.value.findIndex((set) => set.id === id)
    if (index !== -1) {
      mySets.value[index] = { ...mySets.value[index], ...updatedSet } as Set
    }
  }

  return {
    mySets,
    expertSets,
    isLoading,
    fetchMySets,
    fetchExpertSets,
    addSet,
    removeSet,
    updateSet,
  }
})
