import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Preferences } from '@capacitor/preferences'
import { useCoinHistoryStore } from './coinHistory'
import axios from '@/axios'

export interface UserProfile {
  id?: string
  name: string
  email?: string
  emoji?: string
  avatar?: string
  bio?: string
  coins: number
  hasCompletedOnboarding: boolean
  onboardingStep: number
  createdAt: string
}

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile>({
    name: '',
    email: undefined,
    emoji: '😊',
    avatar: 'https://i.pravatar.cc/150?img=1',
    coins: 0,
    hasCompletedOnboarding: false,
    onboardingStep: 0,
    createdAt: '',
  })

  const isOnboarding = ref(false)

  const loadFromStorage = async () => {
    try {
      const { value } = await Preferences.get({ key: 'fliply_user' })
      if (value) {
        const data = JSON.parse(value)
        profile.value = { ...profile.value, ...data }
      }
    } catch (e) {
      console.error('Error loading user data:', e)
    }
  }

  const saveToStorage = async () => {
    try {
      await Preferences.set({
        key: 'fliply_user',
        value: JSON.stringify(profile.value),
      })
    } catch (e) {
      console.error('Error saving user data:', e)
    }
  }

  const checkOnboardingStatus = async () => {
    await loadFromStorage()
    return !profile.value.hasCompletedOnboarding
  }

  const setName = async (name: string) => {
    profile.value.name = name
    if (!profile.value.createdAt) {
      profile.value.createdAt = new Date().toISOString()
    }
    await saveToStorage()
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    profile.value = { ...profile.value, ...updates }
    await saveToStorage()
  }

  const completeOnboarding = async () => {
    profile.value.hasCompletedOnboarding = true
    profile.value.onboardingStep = 999
    isOnboarding.value = false

    try {
      const response = await axios.post('/api/users', {
        name: profile.value.name,
        email: profile.value.email,
        emoji: profile.value.emoji,
        hasCompletedOnboarding: true,
        onboardingStep: 999,
      })

      if (response.data.success) {
        profile.value.id = response.data.data.id
        await saveToStorage()
      }
    } catch (error) {
      console.error('Error creating user account:', error)
    }

    await saveToStorage()
  }

  const setOnboardingStep = async (step: number) => {
    profile.value.onboardingStep = step
    await saveToStorage()
  }

  const reset = async () => {
    profile.value = {
      name: '',
      email: undefined,
      emoji: '😊',
      avatar: undefined,
      coins: 0,
      hasCompletedOnboarding: false,
      onboardingStep: 0,
      createdAt: '',
    }
    await Preferences.remove({ key: 'fliply_user' })
  }

  const earnCoins = async (amount: number, reason: string = 'Münzen verdient') => {
    profile.value.coins += amount
    await saveToStorage()

    const coinHistoryStore = useCoinHistoryStore()
    await coinHistoryStore.addTransaction(amount, reason, 'earned')
  }

  const spendCoins = async (
    amount: number,
    reason: string = 'Münzen ausgegeben',
  ): Promise<boolean> => {
    if (profile.value.coins >= amount) {
      profile.value.coins -= amount
      await saveToStorage()

      const coinHistoryStore = useCoinHistoryStore()
      await coinHistoryStore.addTransaction(amount, reason, 'spent')
      return true
    }
    return false
  }

  const setAvatar = async (avatarUrl: string) => {
    profile.value.avatar = avatarUrl
    profile.value.emoji = undefined
    await saveToStorage()
  }

  return {
    profile,
    isOnboarding,
    loadFromStorage,
    checkOnboardingStatus,
    setName,
    updateProfile,
    completeOnboarding,
    setOnboardingStep,
    reset,
    earnCoins,
    spendCoins,
    setAvatar,
  }
})
