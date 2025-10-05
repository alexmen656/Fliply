<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between">
                <button @click="$router.back()" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 class="text-xl font-bold text-gray-800">Errungenschaften</h1>
                <div class="w-6"></div>
            </div>
        </header>
        <main class="flex-1 overflow-y-auto px-4 py-5 pb-6">
            <div class="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-5 mb-6 shadow-lg">
                <div class="text-center mb-4">
                    <svg class="w-16 h-16 mx-auto mb-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <h2 class="text-2xl font-bold text-white mb-1">
                        {{ achievementsStore.unlockedAchievements.length }} / {{ achievementsStore.achievements.length
                        }}
                    </h2>
                    <p class="text-white text-sm opacity-90">Errungenschaften freigeschaltet</p>
                </div>
                <div class="bg-white bg-opacity-20 rounded-full h-3 overflow-hidden">
                    <div class="bg-white h-full transition-all duration-500" :style="{
                        width: `${(achievementsStore.unlockedAchievements.length / achievementsStore.achievements.length) * 100}%`
                    }"></div>
                </div>
            </div>
            <section v-if="achievementsStore.unlockedAchievements.length > 0" class="mb-6">
                <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd" />
                    </svg>
                    <span>Freigeschaltet</span>
                </h2>
                <div class="space-y-3">
                    <div v-for="achievement in achievementsStore.unlockedAchievements" :key="achievement.id"
                        class="bg-white rounded-xl p-4 shadow-sm">
                        <div class="flex items-start gap-4">
                            <div class="text-5xl flex-shrink-0">{{ achievement.icon }}</div>
                            <div class="flex-1">
                                <h3 class="font-bold text-gray-800 mb-1">{{ achievement.name }}</h3>
                                <p class="text-sm text-gray-600 mb-2">{{ achievement.description }}</p>
                                <div class="flex items-center gap-2">
                                    <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span class="text-xs text-green-600 font-semibold">Freigeschaltet</span>
                                    <span v-if="achievement.unlockedAt" class="text-xs text-gray-400">
                                        {{ formatDate(achievement.unlockedAt) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section v-if="achievementsStore.lockedAchievements.length > 0">
                <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clip-rule="evenodd" />
                    </svg>
                    <span>Noch zu erreichen</span>
                </h2>
                <div class="space-y-3">
                    <div v-for="achievement in achievementsStore.lockedAchievements" :key="achievement.id"
                        class="bg-white rounded-xl p-4 shadow-sm opacity-70">
                        <div class="flex items-start gap-4">
                            <div class="text-5xl flex-shrink-0 grayscale opacity-50">{{ achievement.icon }}</div>
                            <div class="flex-1">
                                <h3 class="font-bold text-gray-700 mb-1">{{ achievement.name }}</h3>
                                <p class="text-sm text-gray-500 mb-2">{{ achievement.description }}</p>
                                <div class="flex items-center gap-2">
                                    <span class="text-xs text-gray-500 font-semibold">
                                        {{ getAchievementProgress(achievement) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div v-if="achievementsStore.achievements.length === 0" class="text-center py-12">
                <svg class="w-20 h-20 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Keine Errungenschaften</h3>
                <p class="text-gray-500">Beginne zu lernen, um Erfolge zu sammeln!</p>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAchievementsStore } from '@/stores/achievements'
import type { Achievement } from '@/stores/achievements'

const achievementsStore = useAchievementsStore()

onMounted(async () => {
    await achievementsStore.loadFromStorage()
})

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Heute'
    if (diffDays === 1) return 'Gestern'
    if (diffDays < 7) return `vor ${diffDays} Tagen`
    if (diffDays < 30) return `vor ${Math.floor(diffDays / 7)} Wochen`
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const getAchievementProgress = (achievement: Achievement) => {
    switch (achievement.type) {
        case 'streak':
            return `Erreiche einen ${achievement.threshold}-Tage Streak`
        case 'cards':
            return `Erstelle ${achievement.threshold} Karten`
        case 'sets':
            return `Erstelle ${achievement.threshold} Sets`
        case 'study_days':
            return `Lerne an ${achievement.threshold} Tagen`
        case 'perfect_score':
            return 'Erreiche eine perfekte Punktzahl'
        default:
            return 'Erfülle die Bedingung'
    }
}
</script>

<style scoped>
header {
    padding-top: env(safe-area-inset-top);
}

.grayscale {
    filter: grayscale(100%);
}
</style>
