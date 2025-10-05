import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Preferences } from '@capacitor/preferences'

export const useGoalsStore = defineStore('goals', () => {
  const dailyGoal = ref(20)
  const weeklyGoal = ref(5)
  const studyTime = ref('evening')
  const todayProgress = ref(0)
  const weekProgress = ref(0)

  const loadGoals = async () => {
    try {
      const { value: dailyValue } = await Preferences.get({ key: 'fliply_daily_goal' })
      const { value: weeklyValue } = await Preferences.get({ key: 'fliply_weekly_goal' })
      const { value: timeValue } = await Preferences.get({ key: 'fliply_study_time' })
      const { value: todayProgressValue } = await Preferences.get({ key: 'fliply_today_progress' })
      const { value: weekProgressValue } = await Preferences.get({ key: 'fliply_week_progress' })

      if (dailyValue) dailyGoal.value = parseInt(dailyValue)
      if (weeklyValue) weeklyGoal.value = parseInt(weeklyValue)
      if (timeValue) studyTime.value = timeValue
      if (todayProgressValue) todayProgress.value = parseInt(todayProgressValue)
      if (weekProgressValue) weekProgress.value = parseInt(weekProgressValue)
    } catch (error) {
      console.error('Error loading goals:', error)
    }
  }

  const saveGoals = async () => {
    try {
      await Preferences.set({ key: 'fliply_daily_goal', value: dailyGoal.value.toString() })
      await Preferences.set({ key: 'fliply_weekly_goal', value: weeklyGoal.value.toString() })
      await Preferences.set({ key: 'fliply_study_time', value: studyTime.value })
    } catch (error) {
      console.error('Error saving goals:', error)
    }
  }

  const updateTodayProgress = async (cards: number) => {
    todayProgress.value += cards
    try {
      await Preferences.set({ key: 'fliply_today_progress', value: todayProgress.value.toString() })
    } catch (error) {
      console.error('Error updating today progress:', error)
    }
  }

  const updateWeekProgress = async (days: number) => {
    weekProgress.value = days
    try {
      await Preferences.set({ key: 'fliply_week_progress', value: weekProgress.value.toString() })
    } catch (error) {
      console.error('Error updating week progress:', error)
    }
  }

  const getDailyProgressPercentage = () => {
    return Math.min(Math.round((todayProgress.value / dailyGoal.value) * 100), 100)
  }

  return {
    dailyGoal,
    weeklyGoal,
    studyTime,
    todayProgress,
    weekProgress,
    loadGoals,
    saveGoals,
    updateTodayProgress,
    updateWeekProgress,
    getDailyProgressPercentage,
  }
})
