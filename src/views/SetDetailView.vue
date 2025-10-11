<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between mb-4">
                <button @click="$router.back()" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div class="flex items-center gap-3">
                    <button @click="toggleFavorite" class="text-gray-600 transition-transform active:scale-90">
                        <svg class="w-7 h-7 transition-colors" :class="isFavorite ? 'text-yellow-500' : 'text-gray-400'"
                            fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </button>
                    <button @click="editSet" class="text-gray-600 transition-transform active:scale-90">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div v-if="isLoading" class="text-center py-8">
                <p class="text-gray-500">{{ $t('common.loading') }}</p>
            </div>
            <div v-else class="mb-4">
                <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ setTitle }}</h1>
                <div class="flex items-center gap-3 text-sm text-gray-600">
                    <span>{{ totalCards }} {{ $t('common.cards') }}</span>
                    <span>•</span>
                    <div class="flex items-center gap-2">
                        <div class="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <span>{{ authorName }}</span>
                    </div>
                </div>
            </div>
            <div v-if="!isLoading" class="mb-4">
                <div class="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span class="font-medium">{{ $t('setDetail.progress') }}</span>
                    <span class="font-bold text-primary">{{ progress }}%</span>
                </div>
                <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div class="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out relative"
                        :style="{ width: progress + '%' }">
                        <div class="absolute inset-0 bg-white opacity-20 animate-shimmer"></div>
                    </div>
                </div>
                <!-- <div v-if="stats.mastered > 0 || stats.learning > 0"
                    class="flex items-center justify-between mt-2 text-xs">
                    <div class="flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-green-500"></span>
                        <span class="text-gray-600">{{ stats.mastered }} gemeistert</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-yellow-500"></span>
                        <span class="text-gray-600">{{ stats.learning }} am Lernen</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-gray-400"></span>
                        <span class="text-gray-600">{{ stats.notSeen }} neu</span>
                    </div>
                </div>-->
            </div>
        </header>
        <main class="flex-1 overflow-y-auto pb-20 px-4 py-5">
            <section v-if="!isLoading" class="mb-6">
                <div class="flex items-center gap-2 mb-3">
                    <h2 class="text-lg font-bold text-gray-800">{{ $t('setDetail.studyModes') }}</h2>
                    <button @click="showCoinsInfo = true" class="text-gray-400 hover:text-gray-600 transition">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button @click="startMode('flashcards')"
                        class="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg active:scale-95 transition-all duration-200 flex flex-col items-center justify-center hover:shadow-xl transform hover:-translate-y-1">
                        <svg class="w-10 h-10 mb-2 animate-bounce-subtle" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span class="font-semibold">{{ $t('setDetail.flashcards') }}</span>
                        <span v-if="stats.flashcardsCompleted > 0" class="text-xs mt-1 opacity-90">{{
                            stats.flashcardsCompleted }}x {{ $t('setDetail.played') }}</span>
                    </button>
                    <button @click="startMode('quiz')"
                        class="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl p-6 shadow-lg active:scale-95 transition-all duration-200 flex flex-col items-center justify-center relative hover:shadow-xl transform hover:-translate-y-1">
                        <svg class="w-10 h-10 mb-2 animate-bounce-subtle" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="font-semibold">{{ $t('setDetail.quiz') }}</span>
                        <span v-if="stats.quizCompleted > 0" class="text-xs mt-1 opacity-90">{{ stats.quizCompleted }}x
                            {{ $t('setDetail.played') }}</span>
                    </button>
                    <button @click="startMode('match')"
                        class="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg active:scale-95 transition-all duration-200 flex flex-col items-center justify-center relative hover:shadow-xl transform hover:-translate-y-1">
                        <svg class="w-10 h-10 mb-2 animate-bounce-subtle" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span class="font-semibold">{{ $t('setDetail.match') }}</span>
                        <span v-if="stats.matchCompleted > 0" class="text-xs mt-1 opacity-90">{{ stats.matchCompleted
                            }}x {{ $t('setDetail.played') }}</span>
                    </button>
                    <button @click="startMode('learn')"
                        class="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl p-6 shadow-lg active:scale-95 transition-all duration-200 flex flex-col items-center justify-center relative hover:shadow-xl transform hover:-translate-y-1">
                        <svg class="w-10 h-10 mb-2 animate-bounce-subtle" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span class="font-semibold">{{ $t('setDetail.learn') }}</span>
                        <span v-if="stats.learnCompleted > 0" class="text-xs mt-1 opacity-90">{{ stats.learnCompleted
                            }}x {{ $t('setDetail.played') }}</span>
                    </button>
                </div>
            </section>
            <section v-if="!isLoading && cards.length > 0">
                <div class="flex items-center justify-between mb-3">
                    <h2 class="text-lg font-bold text-gray-800">{{ $t('common.cards') }} ({{ cards.length }})</h2>
                    <button @click="viewAllCards" class="text-primary text-sm font-semibold">{{ $t('common.viewAll')
                        }}</button>
                </div>
                <div class="space-y-3">
                    <div v-for="(card, index) in cards.slice(0, 5)" :key="index"
                        class="bg-white rounded-xl p-4 shadow-sm">
                        <div class="flex items-start justify-between mb-2">
                            <span class="text-xs font-semibold text-gray-500">{{ $t('common.cards') }} {{ index + 1
                                }}</span>
                        </div>
                        <div class="space-y-2">
                            <div class="text-gray-800 font-medium">{{ card.front }}</div>
                            <div class="text-sm text-gray-600">{{ card.back }}</div>
                        </div>
                    </div>
                </div>
            </section>
            <section v-if="!isLoading && cards.length === 0" class="text-center py-8">
                <p class="text-gray-500">{{ $t('allCards.noCards') }}</p>
            </section>
        </main>

        <!-- Coins Info Modal -->
        <div v-if="showCoinsInfo" @click="showCoinsInfo = false"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div @click.stop class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-gray-800">{{ $t('setDetail.earnCoins') }}</h3>
                    <button @click="showCoinsInfo = false" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="space-y-3">
                    <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                        <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                clip-rule="evenodd" />
                        </svg>
                        <div>
                            <div class="font-semibold text-gray-800">{{ $t('setDetail.flashcards') }}</div>
                            <div class="text-sm text-gray-600">{{ totalCards }} {{ $t('profile.coins') }}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                        <svg class="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                clip-rule="evenodd" />
                        </svg>
                        <div>
                            <div class="font-semibold text-gray-800">{{ $t('setDetail.quiz') }}</div>
                            <div class="text-sm text-gray-600">{{ totalCards * 10 }} {{ $t('profile.coins') }}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                        <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                clip-rule="evenodd" />
                        </svg>
                        <div>
                            <div class="font-semibold text-gray-800">{{ $t('setDetail.match') }}</div>
                            <div class="text-sm text-gray-600">{{ totalCards * 7 }} {{ $t('profile.coins') }}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                        <svg class="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                clip-rule="evenodd" />
                        </svg>
                        <div>
                            <div class="font-semibold text-gray-800">{{ $t('setDetail.learn') }}</div>
                            <div class="text-sm text-gray-600">{{ totalCards * 5 }} {{ $t('profile.coins') }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSetsStore } from '@/stores/sets'
import { useProgressStore } from '@/stores/progress'

const router = useRouter()
const route = useRoute()
const setsStore = useSetsStore()
const progressStore = useProgressStore()

const setTitle = ref('')
const authorName = ref('')
const authorAvatar = ref('')
const totalCards = ref(0)
const cards = ref<any[]>([])
const setIcon = ref('📚')
const isLoading = ref(true)
const isFavorite = ref(false)
const showCoinsInfo = ref(false)

const progress = computed(() => {
    const setId = route.params.id
    if (!setId || Array.isArray(setId)) return 0
    return progressStore.calculateProgress(setId)
})

const stats = computed(() => {
    const setId = route.params.id
    if (!setId || Array.isArray(setId)) return {
        mastered: 0,
        learning: 0,
        notSeen: 0,
        totalSessions: 0,
        flashcardsCompleted: 0,
        quizCompleted: 0,
        matchCompleted: 0,
        learnCompleted: 0,
    }
    return progressStore.getSetStats(setId)
})

onMounted(async () => {
    await progressStore.loadProgress()
    await loadSetData()
})

const loadSetData = async () => {
    const setId = route.params.id
    if (!setId || Array.isArray(setId)) return

    isLoading.value = true
    try {
        const setData = await setsStore.getSetById(setId)
        if (setData) {
            setTitle.value = setData.title
            authorName.value = setData.author || 'Unbekannt'
            authorAvatar.value = setData.avatar || ''
            setIcon.value = setData.icon || '📚'

            if (Array.isArray(setData.cards)) {
                cards.value = setData.cards.map((card: any, index: number) => ({
                    front: card.front,
                    back: card.back,
                    order: card.order || index,
                    starred: false
                }))

                totalCards.value = cards.value.length
                progressStore.initSetProgress(setId, totalCards.value)
            } else {
                totalCards.value = 0
                cards.value = []
            }

            isFavorite.value = setsStore.isFavorite(setId)
            await setsStore.markAsRecent(setId, setTitle.value, totalCards.value)
        }
    } catch (error) {
        console.error('Error loading set data:', error)
    } finally {
        isLoading.value = false
    }
}

const toggleFavorite = async () => {
    const setId = route.params.id
    if (setId && !Array.isArray(setId)) {
        await setsStore.toggleFavorite(setId)
        isFavorite.value = setsStore.isFavorite(setId)
    }
}

const startMode = (mode: string) => {
    const setId = route.params.id
    if (mode === 'flashcards') {
        router.push(`/flashcards/${setId}`)
    } else if (mode === 'quiz') {
        router.push(`/quiz/${setId}`)
    } else if (mode === 'match') {
        router.push(`/match/${setId}`)
    } else if (mode === 'learn') {
        router.push(`/learn/${setId}`)
    } else {
        console.log('Starting mode:', mode)
    }
}

const editSet = () => {
    const setId = route.params.id
    router.push(`/edit-set/${setId}`)
}

const viewAllCards = () => {
    const setId = route.params.id
    router.push(`/set/${setId}/cards`)
}
</script>

<style scoped>
.safe-area-inset {
    padding-bottom: env(safe-area-inset-bottom);
}

.active\:scale-98:active {
    transform: scale(0.98);
}

.active\:scale-95:active {
    transform: scale(0.95);
}

header {
    padding-top: env(safe-area-inset-top);
}
</style>
