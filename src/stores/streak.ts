import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Preferences } from '@capacitor/preferences'

export const useStreakStore = defineStore('streak', () => {
  const currentStreak = ref(0)
  const longestStreak = ref(0)
  const lastStudyDate = ref<string | null>(null)
  const studyDates = ref<string[]>([])

  const loadFromStorage = async () => {
    try {
      const { value } = await Preferences.get({ key: 'fliply_streak' })
      if (value) {
        const data = JSON.parse(value)
        currentStreak.value = data.currentStreak || 0
        longestStreak.value = data.longestStreak || 0
        lastStudyDate.value = data.lastStudyDate || null
        studyDates.value = data.studyDates || []
      }
    } catch (e) {
      console.error('Error loading streak data:', e)
    }
  }

  const saveToStorage = async () => {
    try {
      const data = {
        currentStreak: currentStreak.value,
        longestStreak: longestStreak.value,
        lastStudyDate: lastStudyDate.value,
        studyDates: studyDates.value,
      }
      await Preferences.set({
        key: 'fliply_streak',
        value: JSON.stringify(data),
      })
    } catch (e) {
      console.error('Error saving streak data:', e)
    }
  }

  const getTodayString = (): string => {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    return dateStr || ''
  }

  const getYesterdayString = (): string => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const dateStr = yesterday.toISOString().split('T')[0]
    return dateStr || ''
  }

  const hasStudiedToday = computed(() => {
    const today = getTodayString()
    return studyDates.value.includes(today)
  })

  const recordStudySession = async () => {
    const today = getTodayString()
    const yesterday = getYesterdayString()

    if (hasStudiedToday.value) {
      return
    }

    if (!studyDates.value.includes(today)) {
      studyDates.value.push(today)
    }

    if (lastStudyDate.value === yesterday || lastStudyDate.value === today) {
      if (lastStudyDate.value === yesterday) {
        currentStreak.value++
      }
    } else if (lastStudyDate.value === null) {
      currentStreak.value = 1
    } else {
      currentStreak.value = 1
    }

    lastStudyDate.value = today

    if (currentStreak.value > longestStreak.value) {
      longestStreak.value = currentStreak.value
    }

    await saveToStorage()
  }

  const checkStreak = async () => {
    await loadFromStorage()

    if (!lastStudyDate.value) {
      return
    }

    const today = getTodayString()
    const yesterday = getYesterdayString()

    if (lastStudyDate.value !== yesterday && lastStudyDate.value !== today) {
      currentStreak.value = 0
      await saveToStorage()
    }
  }

  const resetStreak = async () => {
    currentStreak.value = 0
    lastStudyDate.value = null
    studyDates.value = []
    await saveToStorage()
  }

  return {
    currentStreak,
    longestStreak,
    lastStudyDate,
    studyDates,
    hasStudiedToday,
    recordStudySession,
    checkStreak,
    resetStreak,
    loadFromStorage,
  }
})
