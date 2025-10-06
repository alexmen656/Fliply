import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Preferences } from '@capacitor/preferences'

export interface CardProgress {
  cardIndex: number
  level: number
  lastStudied: string
  correctCount: number
  incorrectCount: number
}

export interface SetProgress {
  setId: string | number
  cards: CardProgress[]
  totalStudySessions: number
  lastStudied: string
  flashcardsCompleted: number
  quizCompleted: number
  matchCompleted: number
  learnCompleted: number
}

export const useProgressStore = defineStore('progress', () => {
  const progressData = ref<Map<string | number, SetProgress>>(new Map())

  const loadProgress = async () => {
    try {
      const { value } = await Preferences.get({ key: 'fliply_progress' })
      if (value) {
        const data = JSON.parse(value)
        const entries = Object.entries(data).map(([key, value]) => {
          const numKey = Number(key)
          const finalKey = isNaN(numKey) ? key : numKey
          return [finalKey, value]
        })
        progressData.value = new Map(entries as [string | number, SetProgress][])
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  const saveProgress = async () => {
    try {
      const data = Object.fromEntries(progressData.value)
      await Preferences.set({
        key: 'fliply_progress',
        value: JSON.stringify(data),
      })
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  const getSetProgress = (setId: string | number): SetProgress | null => {
    const progress =
      progressData.value.get(setId) ||
      progressData.value.get(String(setId)) ||
      progressData.value.get(Number(setId))
    return progress || null
  }

  const initSetProgress = async (setId: string | number, cardCount: number) => {
    const existing = getSetProgress(setId)
    if (!existing) {
      const newProgress: SetProgress = {
        setId,
        cards: Array.from({ length: cardCount }, (_, index) => ({
          cardIndex: index,
          level: 0,
          lastStudied: '',
          correctCount: 0,
          incorrectCount: 0,
        })),
        totalStudySessions: 0,
        lastStudied: '',
        flashcardsCompleted: 0,
        quizCompleted: 0,
        matchCompleted: 0,
        learnCompleted: 0,
      }
      progressData.value.set(setId, newProgress)
      await saveProgress()
    }
  }

  const updateCardLevel = async (
    setId: string | number,
    cardIndex: number,
    newLevel: number,
    isCorrect: boolean,
  ) => {
    const progress = getSetProgress(setId)
    if (!progress) return

    const card = progress.cards[cardIndex]
    if (card) {
      card.level = Math.max(0, Math.min(3, newLevel))
      card.lastStudied = new Date().toISOString()
      if (isCorrect) {
        card.correctCount++
      } else {
        card.incorrectCount++
      }
    }

    await saveProgress()
  }

  const completeSession = async (
    setId: string | number,
    mode: 'flashcards' | 'quiz' | 'match' | 'learn',
    cardResults?: { cardIndex: number; isCorrect: boolean }[],
  ) => {
    let progress = getSetProgress(setId)
    if (!progress) {
      console.error('no prog')
      return
    }

    progress.totalStudySessions++
    progress.lastStudied = new Date().toISOString()

    if (mode === 'flashcards') {
      progress.flashcardsCompleted++
    } else if (mode === 'quiz') {
      progress.quizCompleted++
    } else if (mode === 'match') {
      progress.matchCompleted++
    } else if (mode === 'learn') {
      progress.learnCompleted++
    }

    if (cardResults) {
      cardResults.forEach(({ cardIndex, isCorrect }) => {
        const card = progress!.cards[cardIndex]
        if (card) {
          card.lastStudied = new Date().toISOString()
          if (isCorrect) {
            card.correctCount++
            card.level = Math.min(3, card.level + 2)
          } else {
            card.incorrectCount++
            card.level = Math.max(0, card.level - 1)
          }
        } else {
          console.warn(`  ⚠️ Card ${cardIndex} not found in progress`)
        }
      })
    }

    await saveProgress()
  }

  const calculateProgress = (setId: string | number): number => {
    const progress = getSetProgress(setId)
    if (!progress || progress.cards.length === 0) {
      return 0
    }

    const totalCards = progress.cards.length
    const masteredCards = progress.cards.filter((c) => c.level === 3).length
    const percentage = Math.round((masteredCards / totalCards) * 100)

    return percentage
  }

  const getSetStats = (setId: string | number) => {
    const progress = getSetProgress(setId)
    if (!progress) {
      return {
        mastered: 0,
        learning: 0,
        notSeen: 0,
        totalSessions: 0,
        flashcardsCompleted: 0,
        quizCompleted: 0,
        matchCompleted: 0,
        learnCompleted: 0,
      }
    }

    return {
      mastered: progress.cards.filter((c) => c.level === 3).length,
      learning: progress.cards.filter((c) => c.level > 0 && c.level < 3).length,
      notSeen: progress.cards.filter((c) => c.level === 0).length,
      totalSessions: progress.totalStudySessions,
      flashcardsCompleted: progress.flashcardsCompleted,
      quizCompleted: progress.quizCompleted,
      matchCompleted: progress.matchCompleted,
      learnCompleted: progress.learnCompleted,
    }
  }

  const resetSetProgress = async (setId: string | number) => {
    const progress = getSetProgress(setId)
    if (!progress) return

    progress.cards.forEach((card) => {
      card.level = 0
      card.correctCount = 0
      card.incorrectCount = 0
    })

    await saveProgress()
  }

  const clearAllProgress = async () => {
    progressData.value.clear()
    await Preferences.remove({ key: 'fliply_progress' })
  }

  return {
    progressData,
    loadProgress,
    saveProgress,
    getSetProgress,
    initSetProgress,
    updateCardLevel,
    completeSession,
    calculateProgress,
    getSetStats,
    resetSetProgress,
    clearAllProgress,
  }
})
