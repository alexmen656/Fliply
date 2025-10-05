import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Preferences } from '@capacitor/preferences'
import { useUserStore } from './user'
import { useSetsStore } from './sets'
import axios from '@/axios'

export interface Achievement {
  id: string
  icon: string
  name: string
  description: string
  unlocked: boolean
  unlockedAt?: string
  type: 'streak' | 'cards' | 'sets' | 'study_days' | 'perfect_score'
  threshold: number
}

export const useAchievementsStore = defineStore('achievements', () => {
  const achievements = ref<Achievement[]>([
    {
      id: 'starter',
      icon: '🏆',
      name: 'Starter',
      description: 'Erstes Set erstellt',
      unlocked: false,
      type: 'sets',
      threshold: 1,
    },
    {
      id: 'streak_3',
      icon: '🔥',
      name: '3-Tage Streak',
      description: '3 Tage am Stück gelernt',
      unlocked: false,
      type: 'streak',
      threshold: 3,
    },
    {
      id: 'streak_7',
      icon: '💪',
      name: '7-Tage Streak',
      description: '7 Tage am Stück gelernt',
      unlocked: false,
      type: 'streak',
      threshold: 7,
    },
    {
      id: 'streak_30',
      icon: '⚡',
      name: 'Monats-Streak',
      description: '30 Tage am Stück gelernt',
      unlocked: false,
      type: 'streak',
      threshold: 30,
    },
    {
      id: 'cards_50',
      icon: '🎯',
      name: '50 Karten',
      description: '50 Karten erstellt',
      unlocked: false,
      type: 'cards',
      threshold: 50,
    },
    {
      id: 'cards_100',
      icon: '🎮',
      name: '100 Karten',
      description: '100 Karten erstellt',
      unlocked: false,
      type: 'cards',
      threshold: 100,
    },
    {
      id: 'cards_500',
      icon: '🌟',
      name: '500 Karten',
      description: '500 Karten erstellt',
      unlocked: false,
      type: 'cards',
      threshold: 500,
    },
    {
      id: 'sets_5',
      icon: '📚',
      name: 'Bücher',
      description: '5 Sets erstellt',
      unlocked: false,
      type: 'sets',
      threshold: 5,
    },
    {
      id: 'sets_10',
      icon: '📖',
      name: 'Bibliothek',
      description: '10 Sets erstellt',
      unlocked: false,
      type: 'sets',
      threshold: 10,
    },
    {
      id: 'top_learner',
      icon: '⭐',
      name: 'Top Lerner',
      description: '7-Tage Streak + 100 Karten',
      unlocked: false,
      type: 'streak',
      threshold: 7,
    },
    {
      id: 'dedicated',
      icon: '💎',
      name: 'Fleißig',
      description: '15 Tage gelernt',
      unlocked: false,
      type: 'study_days',
      threshold: 15,
    },
    {
      id: 'scholar',
      icon: '🎓',
      name: 'Gelehrter',
      description: '20 Sets + 500 Karten',
      unlocked: false,
      type: 'sets',
      threshold: 20,
    },
  ])

  const unlockedAchievements = computed(() => achievements.value.filter((a) => a.unlocked))

  const lockedAchievements = computed(() => achievements.value.filter((a) => !a.unlocked))

  const loadFromStorage = async () => {
    try {
      const { value } = await Preferences.get({ key: 'fliply_achievements' })
      if (value) {
        const data = JSON.parse(value) as Achievement[]
        // Merge with default achievements to handle new ones
        achievements.value = achievements.value.map((achievement) => {
          const saved = data.find((a) => a.id === achievement.id)
          return saved
            ? { ...achievement, unlocked: saved.unlocked, unlockedAt: saved.unlockedAt }
            : achievement
        })
      }
    } catch (e) {
      console.error('Error loading achievements:', e)
    }
  }

  const saveToStorage = async () => {
    try {
      await Preferences.set({
        key: 'fliply_achievements',
        value: JSON.stringify(achievements.value),
      })
    } catch (e) {
      console.error('Error saving achievements:', e)
    }
  }

  const checkAndUnlockAchievements = async () => {
    const userStore = useUserStore()
    const setsStore = useSetsStore()

    let currentStreak = 0
    let totalCards = 0
    let totalSets = setsStore.mySets.length
    let studyDaysCount = 0

    if (userStore.profile.id) {
      try {
        const response = await axios.get(`/api/users/${userStore.profile.id}`)
        if (response.data.success) {
          currentStreak = response.data.data.currentStreak || 0
          studyDaysCount = response.data.data.studyDates?.length || 0
        }
      } catch (error) {
        console.error('Error loading streak from API:', error)
        try {
          const { value } = await Preferences.get({ key: 'fliply_streak' })
          if (value) {
            const streakData = JSON.parse(value)
            currentStreak = streakData.currentStreak || 0
            studyDaysCount = streakData.studyDates?.length || 0
          }
        } catch (e) {
          console.error('Error loading streak from preferences:', e)
        }
      }
    }

    try {
      const { value } = await Preferences.get({ key: 'fliply_total_cards' })
      if (value) {
        totalCards = parseInt(value, 10)
      }
    } catch (error) {
      console.error('Error loading total cards:', error)
    }

    let newUnlocks = 0

    achievements.value.forEach((achievement) => {
      if (achievement.unlocked) return

      let shouldUnlock = false

      switch (achievement.type) {
        case 'streak':
          if (achievement.id === 'top_learner') {
            shouldUnlock = currentStreak >= 7 && totalCards >= 100
          } else {
            shouldUnlock = currentStreak >= achievement.threshold
          }
          break

        case 'cards':
          shouldUnlock = totalCards >= achievement.threshold
          break

        case 'sets':
          if (achievement.id === 'scholar') {
            shouldUnlock = totalSets >= 20 && totalCards >= 500
          } else {
            shouldUnlock = totalSets >= achievement.threshold
          }
          break

        case 'study_days':
          shouldUnlock = studyDaysCount >= achievement.threshold
          break
      }

      if (shouldUnlock) {
        achievement.unlocked = true
        achievement.unlockedAt = new Date().toISOString()
        newUnlocks++
        console.log(`🎉 Achievement unlocked: ${achievement.name}`)
      }
    })

    if (newUnlocks > 0) {
      await saveToStorage()
    }

    return newUnlocks
  }

  const unlockAchievement = async (achievementId: string) => {
    const achievement = achievements.value.find((a) => a.id === achievementId)
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true
      achievement.unlockedAt = new Date().toISOString()
      await saveToStorage()
      return true
    }
    return false
  }

  const resetAchievements = async () => {
    achievements.value.forEach((a) => {
      a.unlocked = false
      a.unlockedAt = undefined
    })
    await saveToStorage()
  }

  return {
    achievements,
    unlockedAchievements,
    lockedAchievements,
    loadFromStorage,
    saveToStorage,
    checkAndUnlockAchievements,
    unlockAchievement,
    resetAchievements,
  }
})
