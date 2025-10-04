import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UserProfile {
  name: string
  email?: string
  emoji?: string
  hasCompletedOnboarding: boolean
  onboardingStep: number
  createdAt: string
}

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile>({
    name: '',
    email: undefined,
    emoji: '😊',
    hasCompletedOnboarding: false,
    onboardingStep: 0,
    createdAt: '',
  })

  const isOnboarding = ref(false)

  const loadFromStorage = () => {
    const stored = localStorage.getItem('fliply_user')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        profile.value = { ...profile.value, ...data }
      } catch (e) {
        console.error('Error loading user data:', e)
      }
    }
  }

  const saveToStorage = () => {
    localStorage.setItem('fliply_user', JSON.stringify(profile.value))
  }

  const checkOnboardingStatus = () => {
    loadFromStorage()
    return !profile.value.hasCompletedOnboarding
  }

  const setName = (name: string) => {
    profile.value.name = name
    if (!profile.value.createdAt) {
      profile.value.createdAt = new Date().toISOString()
    }
    saveToStorage()
  }

  const updateProfile = (updates: Partial<UserProfile>) => {
    profile.value = { ...profile.value, ...updates }
    saveToStorage()
  }

  const completeOnboarding = () => {
    profile.value.hasCompletedOnboarding = true
    profile.value.onboardingStep = 999
    isOnboarding.value = false
    saveToStorage()
  }

  const setOnboardingStep = (step: number) => {
    profile.value.onboardingStep = step
    saveToStorage()
  }

  const reset = () => {
    profile.value = {
      name: '',
      email: undefined,
      emoji: '😊',
      hasCompletedOnboarding: false,
      onboardingStep: 0,
      createdAt: '',
    }
    localStorage.removeItem('fliply_user')
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
  }
})
