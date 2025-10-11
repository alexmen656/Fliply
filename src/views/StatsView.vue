<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between">
                <button @click="$router.back()" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 class="text-xl font-bold text-gray-800">{{ $t('profile.statistics') || 'Statistiken' }}</h1>
                <div class="w-6"></div>
            </div>
        </header>
        <main class="flex-1 overflow-y-auto px-4 py-6">
            <div class="bg-white rounded-xl p-5 border border-gray-200 mb-4">
                <h2 class="text-sm font-semibold text-gray-500 mb-4 uppercase">{{ $t('profile.overview') || 'Übersicht'
                }}</h2>
                <div v-if="isLoadingStats" class="text-center py-8">
                    <p class="text-gray-500 text-sm">{{ $t('common.loading') }}</p>
                </div>
                <div v-else class="space-y-4">
                    <div class="flex items-center justify-between py-2">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <span class="text-gray-800 font-medium">Sets erstellt</span>
                        </div>
                        <span class="text-2xl font-bold text-gray-800">{{ totalSets }}</span>
                    </div>
                    <div class="flex items-center justify-between py-2 border-t border-gray-100">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <span class="text-gray-800 font-medium">{{ $t('common.cards') }}</span>
                        </div>
                        <span class="text-2xl font-bold text-gray-800">{{ totalCards }}</span>
                    </div>
                    <div class="flex items-center justify-between py-2 border-t border-gray-100">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                </svg>
                            </div>
                            <span class="text-gray-800 font-medium">{{ $t('home.streak') }}</span>
                        </div>
                        <span class="text-2xl font-bold text-gray-800">{{ streakDays }}</span>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-xl p-5 border border-gray-200">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-sm font-semibold text-gray-500 uppercase">{{ $t('profile.achievements') }}</h2>
                    <span class="text-xs text-gray-400">{{ achievementsStore.unlockedAchievements.length }} / {{
                        achievementsStore.achievements.length }}</span>
                </div>
                <div v-if="achievementsStore.achievements.length === 0" class="text-center py-6">
                    <p class="text-gray-500 text-sm">{{ $t('profile.noAchievements') }}</p>
                </div>
                <div v-else class="grid grid-cols-4 gap-3">
                    <div v-for="badge in achievementsStore.achievements" :key="badge.id"
                        :class="['text-center p-2', !badge.unlocked && 'opacity-40']">
                        <div :class="['text-3xl mb-1', !badge.unlocked && 'grayscale']">
                            {{ badge.icon }}
                        </div>
                        <div class="text-xs text-gray-600 font-medium truncate">
                            {{ badge.name }}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSetsStore } from '@/stores/sets'
import { useAchievementsStore } from '@/stores/achievements'
import { Preferences } from '@capacitor/preferences'
import axios from '@/axios'
import { useUserStore } from '@/stores/user'

const { t } = useI18n()
const router = useRouter()
const setsStore = useSetsStore()
const achievementsStore = useAchievementsStore()
const userStore = useUserStore()

const totalSets = ref(0)
const totalCards = ref(0)
const streakDays = ref(0)
const isLoadingStats = ref(true)

onMounted(async () => {
    isLoadingStats.value = true

    await setsStore.fetchMySets()
    await achievementsStore.loadFromStorage()

    totalSets.value = setsStore.mySets.length

    try {
        const { value } = await Preferences.get({ key: 'fliply_total_cards' })
        if (value) {
            totalCards.value = parseInt(value, 10)
        } else {
            let cardCount = 0
            for (const set of setsStore.mySets) {
                cardCount += typeof set.cards === 'number' ? set.cards : (set.cards as any[]).length
            }
            totalCards.value = cardCount
        }
    } catch (error) {
        console.error('Error loading total cards:', error)
    }

    if (userStore.profile.id) {
        try {
            const response = await axios.get(`/api/users/${userStore.profile.id}`)
            if (response.data.success) {
                streakDays.value = response.data.data.currentStreak || 0
            }
        } catch (error) {
            try {
                const { value } = await Preferences.get({ key: 'fliply_streak' })
                if (value) {
                    const streakData = JSON.parse(value)
                    streakDays.value = streakData.currentStreak || 0
                }
            } catch (e) {
                console.error('Error loading streak:', e)
            }
        }
    }

    isLoadingStats.value = false
})
</script>

<style scoped>
header {
    padding-top: env(safe-area-inset-top);
}

.grayscale {
    filter: grayscale(100%);
}
</style>
