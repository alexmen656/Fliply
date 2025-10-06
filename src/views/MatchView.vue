<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between">
                <button @click="exitMatch" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div class="text-center">
                    <div class="text-sm font-semibold text-gray-800">{{ $t('match.title') }}</div>
                    <div class="text-xs text-gray-500 mt-1">{{ matchedPairs }} / {{ totalPairs }} {{ $t('match.pairs')
                    }}</div>
                </div>
                <div class="text-right">
                    <div class="text-sm font-bold text-primary">{{ formatTime(elapsedTime) }}</div>
                </div>
            </div>
        </header>
        <main v-if="!showResults" class="flex-1 overflow-y-auto px-4 py-6">
            <div class="max-w-2xl mx-auto">
                <div class="text-center mb-6">
                    <p class="text-gray-600 text-sm">{{ $t('match.instructions') }}</p>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-3">
                        <button v-for="item in leftItems" :key="item.id" @click="selectItem(item, 'left')" :class="[
                            'w-full p-4 rounded-xl font-medium text-left transition-all',
                            getItemClass(item, 'left')
                        ]">
                            {{ item.text }}
                        </button>
                    </div>
                    <div class="space-y-3">
                        <button v-for="item in rightItems" :key="item.id" @click="selectItem(item, 'right')" :class="[
                            'w-full p-4 rounded-xl font-medium text-left transition-all',
                            getItemClass(item, 'right')
                        ]">
                            {{ item.text }}
                        </button>
                    </div>
                </div>
            </div>
        </main>
        <main v-else class="flex-1 overflow-y-auto px-6 py-8">
            <div class="max-w-2xl mx-auto text-center">
                <div class="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div class="mb-4">
                        <svg class="w-24 h-24 mx-auto text-green-500" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ $t('match.perfect') }}</h2>
                    <p class="text-gray-600 mb-6">{{ $t('match.allPairsFound') }}</p>

                    <div v-if="coinsEarned > 0" class="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-6">
                        <div class="flex items-center justify-center gap-2">
                            <svg class="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                    clip-rule="evenodd" />
                            </svg>
                            <div>
                                <div class="text-lg font-bold text-yellow-800">{{ $t('profile.coinsEarned', {
                                    count:
                                        coinsEarned
                                }) }}</div>
                                <div class="text-sm text-yellow-700">{{ $t('coinHistory.total') }}: {{
                                    userStore.profile.coins }} {{ $t('profile.coins') }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-blue-50 rounded-xl p-4">
                            <div class="text-2xl font-bold text-blue-600">{{ formatTime(finalTime) }}</div>
                            <div class="text-xs text-gray-600">{{ $t('match.time') }}</div>
                        </div>
                        <div class="bg-green-50 rounded-xl p-4">
                            <div class="text-2xl font-bold text-green-600">{{ totalPairs }}</div>
                            <div class="text-xs text-gray-600">{{ $t('match.pairs') }}</div>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <button @click="restartMatch"
                            class="flex-1 bg-primary text-white py-3 rounded-xl font-semibold active:scale-95 transition">
                            {{ $t('match.tryAgain') }}
                        </button>
                        <button @click="$router.back()"
                            class="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold active:scale-95 transition">
                            {{ $t('common.back') }}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useSetsStore } from '@/stores/sets'
import { useProgressStore } from '@/stores/progress'
import { useGoalsStore } from '@/stores/goals'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const setsStore = useSetsStore()
const progressStore = useProgressStore()
const goalsStore = useGoalsStore()

interface MatchItem {
    id: number
    text: string
    pairId: number
    matched: boolean
}

const leftItems = ref<MatchItem[]>([])
const rightItems = ref<MatchItem[]>([])
const selectedLeft = ref<MatchItem | null>(null)
const selectedRight = ref<MatchItem | null>(null)
const matchedPairs = ref(0)
const totalPairs = ref(0)
const showResults = ref(false)
const elapsedTime = ref(0)
const finalTime = ref(0)
const timerInterval = ref<number | null>(null)
const coinsEarned = ref(0)
const isLoading = ref(true)

interface Pair {
    term: string
    definition: string
    cardIndex: number
}

const pairs = ref<Pair[]>([])

onMounted(async () => {
    await progressStore.loadProgress()
    const setId = route.params.id
    if (setId && !Array.isArray(setId)) {
        isLoading.value = true
        try {
            const setData = await setsStore.getSetById(setId)
            if (setData && Array.isArray(setData.cards)) {
                pairs.value = setData.cards.map((card: any, index: number) => ({
                    term: card.front,
                    definition: card.back,
                    cardIndex: index
                }))
                initializeGame()

                progressStore.initSetProgress(setId, pairs.value.length)
            }
        } catch (error) {
            console.error('Error loading match pairs:', error)
        } finally {
            isLoading.value = false
        }
    }
})

const initializeGame = () => {
    totalPairs.value = pairs.value.length

    const leftItemsTemp = pairs.value.map((pair, index) => ({
        id: index * 2,
        text: pair.term,
        pairId: index,
        matched: false
    }))

    const rightItemsTemp = pairs.value.map((pair, index) => ({
        id: index * 2 + 1,
        text: pair.definition,
        pairId: index,
        matched: false
    }))

    leftItems.value = shuffleArray(leftItemsTemp)
    rightItems.value = shuffleArray(rightItemsTemp)

    startTimer()
}

const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = shuffled[i]
        shuffled[i] = shuffled[j]!
        shuffled[j] = temp!
    }
    return shuffled
}

const selectItem = (item: MatchItem, side: 'left' | 'right') => {
    if (item.matched) return

    if (side === 'left') {
        selectedLeft.value = selectedLeft.value?.id === item.id ? null : item
    } else {
        selectedRight.value = selectedRight.value?.id === item.id ? null : item
    }

    if (selectedLeft.value && selectedRight.value) {
        checkMatch()
    }
}

const checkMatch = () => {
    if (!selectedLeft.value || !selectedRight.value) return

    if (selectedLeft.value.pairId === selectedRight.value.pairId) {
        selectedLeft.value.matched = true
        selectedRight.value.matched = true
        matchedPairs.value++

        setTimeout(() => {
            selectedLeft.value = null
            selectedRight.value = null

            if (matchedPairs.value === totalPairs.value) {
                finishGame()
            }
        }, 500)
    } else {
        setTimeout(() => {
            selectedLeft.value = null
            selectedRight.value = null
        }, 800)
    }
}

const getItemClass = (item: MatchItem, side: 'left' | 'right') => {
    if (item.matched) {
        return 'bg-green-100 border-2 border-green-500 text-green-800 opacity-50'
    }

    const isSelected = side === 'left'
        ? selectedLeft.value?.id === item.id
        : selectedRight.value?.id === item.id

    if (isSelected) {
        if (selectedLeft.value && selectedRight.value &&
            selectedLeft.value.pairId !== selectedRight.value.pairId) {
            return 'bg-red-100 border-2 border-red-500 text-red-800 animate-shake'
        }
        return 'bg-primary border-2 border-primary text-white'
    }

    return 'bg-white border-2 border-gray-200 text-gray-800 active:scale-95 hover:border-gray-300'
}

const startTimer = () => {
    elapsedTime.value = 0
    timerInterval.value = window.setInterval(() => {
        elapsedTime.value++
    }, 1000)
}

const stopTimer = () => {
    if (timerInterval.value) {
        clearInterval(timerInterval.value)
        timerInterval.value = null
    }
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

const finishGame = async () => {
    finalTime.value = elapsedTime.value
    stopTimer()

    const setId = route.params.id
    if (setId && !Array.isArray(setId)) {
        const cardResults = pairs.value.map((pair) => ({
            cardIndex: pair.cardIndex,
            isCorrect: true
        }))

        await progressStore.completeSession(setId, 'match', cardResults)
        await goalsStore.updateTodayProgress(pairs.value.length)
    }

    coinsEarned.value = totalPairs.value * 7
    userStore.earnCoins(coinsEarned.value)

    setTimeout(() => {
        showResults.value = true
    }, 1000)
}

const restartMatch = () => {
    matchedPairs.value = 0
    showResults.value = false
    selectedLeft.value = null
    selectedRight.value = null
    coinsEarned.value = 0
    stopTimer()
    initializeGame()
}

const exitMatch = async () => {
    if (matchedPairs.value > 0 && !showResults.value) {
        if (confirm(t('match.confirmExit'))) {
            // Count matched pairs even when exiting early
            await goalsStore.updateTodayProgress(matchedPairs.value)
            stopTimer()
            router.back()
        }
    } else {
        stopTimer()
        router.back()
    }
}

onUnmounted(() => {
    stopTimer()
})
</script>

<style scoped>
.safe-area-inset {
    padding-bottom: env(safe-area-inset-bottom);
}

.active\:scale-95:active {
    transform: scale(0.95);
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-5px);
    }

    75% {
        transform: translateX(5px);
    }
}

.animate-shake {
    animation: shake 0.3s ease-in-out;
}

header {
    padding-top: env(safe-area-inset-top);
}
</style>