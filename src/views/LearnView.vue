<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between">
                <button @click="exitLearn" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div class="text-center">
                    <div class="text-sm text-gray-600">{{ $t('setDetail.learn') }}</div>
                    <div class="text-xs text-gray-500 mt-1">{{ masteredCards }} / {{ cards.length }} {{
                        $t('learn.studied') }}</div>
                </div>
                <div class="w-6"></div>
            </div>
            <div class="mt-4">
                <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-orange-500 rounded-full transition-all"
                        :style="{ width: (masteredCards / cards.length * 100) + '%' }">
                    </div>
                </div>
            </div>
        </header>
        <main v-if="!showResults && currentCard" class="flex-1 overflow-y-auto px-6 py-8">
            <div class="max-w-2xl mx-auto">
                <div class="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div class="text-sm text-gray-500 mb-3">{{ $t('learn.question') }}</div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-8">{{ currentCard.front }}</h2>
                    <div class="mb-4">
                        <input v-model="userAnswer" @keyup.enter="checkAnswer" type="text"
                            :placeholder="$t('learn.yourAnswer')" :disabled="showAnswer"
                            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary text-lg"
                            :class="{
                                'border-green-500 bg-green-50': showAnswer && isCorrect,
                                'border-red-500 bg-red-50': showAnswer && !isCorrect
                            }" />
                    </div>
                    <div v-if="showAnswer" class="animate-fade-in">
                        <div :class="[
                            'rounded-xl p-4 mb-4',
                            isCorrect ? 'bg-green-50' : 'bg-red-50'
                        ]">
                            <div class="flex items-center gap-2 mb-2">
                                <svg :class="['w-6 h-6', isCorrect ? 'text-green-600' : 'text-red-600']" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path v-if="isCorrect" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span :class="[
                                    'font-bold',
                                    isCorrect ? 'text-green-800' : 'text-red-800'
                                ]">
                                    {{ isCorrect ? $t('learn.correct') : $t('learn.incorrect') }}
                                </span>
                            </div>
                            <div v-if="!isCorrect" class="text-sm text-gray-700">
                                {{ $t('learn.correctAnswer') }}: <span class="font-bold">{{ currentCard.back }}</span>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="text-sm text-gray-600 mb-2">Wie gut kanntest du die Antwort?</div>
                            <div class="grid grid-cols-3 gap-2">
                                <button @click="rateCard(1)"
                                    class="py-3 px-4 rounded-xl font-semibold text-sm bg-red-100 text-red-800 active:scale-95 transition flex flex-col items-center gap-1">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Schwer</span>
                                </button>
                                <button @click="rateCard(2)"
                                    class="py-3 px-4 rounded-xl font-semibold text-sm bg-yellow-100 text-yellow-800 active:scale-95 transition flex flex-col items-center gap-1">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>Gut</span>
                                </button>
                                <button @click="rateCard(3)"
                                    class="py-3 px-4 rounded-xl font-semibold text-sm bg-green-100 text-green-800 active:scale-95 transition flex flex-col items-center gap-1">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Leicht</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="!showAnswer" class="bg-blue-50 rounded-xl p-4 text-sm text-gray-600">
                    <div class="flex items-start gap-2">
                        <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <div class="font-semibold text-blue-800 mb-1">Tipp</div>
                            <div>Die Antwort hat {{ currentCard.back.length }} Buchstaben</div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-3 mt-6">
                    <div class="bg-white rounded-xl p-4 text-center">
                        <div class="text-2xl font-bold text-green-600">{{ stats.mastered }}</div>
                        <div class="text-xs text-gray-600">Gemeistert</div>
                    </div>
                    <div class="bg-white rounded-xl p-4 text-center">
                        <div class="text-2xl font-bold text-yellow-600">{{ stats.learning }}</div>
                        <div class="text-xs text-gray-600">Am Lernen</div>
                    </div>
                    <div class="bg-white rounded-xl p-4 text-center">
                        <div class="text-2xl font-bold text-gray-600">{{ stats.notSeen }}</div>
                        <div class="text-xs text-gray-600">Noch nicht</div>
                    </div>
                </div>
            </div>
        </main>
        <main v-else class="flex-1 overflow-y-auto px-6 py-8">
            <div class="max-w-2xl mx-auto text-center">
                <div class="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div class="mb-4">
                        <svg class="w-24 h-24 mx-auto text-orange-500" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Lernrunde abgeschlossen!</h2>
                    <p class="text-gray-600 mb-6">Du hast {{ masteredCards }} von {{ cards.length }} Karten gemeistert
                    </p>
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
                                <div class="text-lg font-bold text-yellow-800">+{{ coinsEarned }} Münzen verdient!</div>
                                <div class="text-sm text-yellow-700">Gesamt: {{ userStore.profile.coins }} Münzen</div>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-4 mb-6">
                        <div class="bg-green-50 rounded-xl p-4">
                            <div class="text-2xl font-bold text-green-600">{{ stats.mastered }}</div>
                            <div class="text-xs text-gray-600">Gemeistert</div>
                        </div>
                        <div class="bg-yellow-50 rounded-xl p-4">
                            <div class="text-2xl font-bold text-yellow-600">{{ stats.learning }}</div>
                            <div class="text-xs text-gray-600">Am Lernen</div>
                        </div>
                        <div class="bg-blue-50 rounded-xl p-4">
                            <div class="text-2xl font-bold text-blue-600">{{ getAccuracy() }}%</div>
                            <div class="text-xs text-gray-600">Genauigkeit</div>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <button @click="restartLearn"
                            class="flex-1 bg-primary text-white py-3 rounded-xl font-semibold active:scale-95 transition">
                            Nochmal
                        </button>
                        <button @click="$router.back()"
                            class="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold active:scale-95 transition">
                            Zurück
                        </button>
                    </div>
                </div>
            </div>
        </main>
        <div v-if="!showAnswer && !showResults"
            class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 safe-area-inset">
            <button @click="checkAnswer" :disabled="!userAnswer.trim()"
                class="w-full bg-primary text-white py-4 rounded-xl font-semibold active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed">
                Antwort prüfen
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useSetsStore } from '@/stores/sets'
import { useProgressStore } from '@/stores/progress'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const setsStore = useSetsStore()
const progressStore = useProgressStore()

interface Card {
    id: number
    front: string
    back: string
    level: number
}

const cards = ref<Card[]>([])
const currentCardIndex = ref(0)
const userAnswer = ref('')
const showAnswer = ref(false)
const isCorrect = ref(false)
const showResults = ref(false)
const totalAnswers = ref(0)
const correctAnswers = ref(0)
const coinsEarned = ref(0)
const isLoading = ref(true)

onMounted(async () => {
    await progressStore.loadProgress()
    const setId = route.params.id
    if (setId && !Array.isArray(setId)) {
        isLoading.value = true
        try {
            const setData = await setsStore.getSetById(setId)
            if (setData && Array.isArray(setData.cards)) {
                const progress = progressStore.getSetProgress(setId)

                cards.value = setData.cards.map((card: any, index: number) => ({
                    id: index,
                    front: card.front,
                    back: card.back,
                    level: progress?.cards[index]?.level || 0
                }))

                progressStore.initSetProgress(setId, cards.value.length)
            }
        } catch (error) {
            console.error('Error loading cards:', error)
        } finally {
            isLoading.value = false
        }
    }
})

const currentCard = computed(() => cards.value[currentCardIndex.value])
const masteredCards = computed(() => cards.value.filter(c => c.level === 3).length)

const stats = computed(() => ({
    mastered: cards.value.filter(c => c.level === 3).length,
    learning: cards.value.filter(c => c.level > 0 && c.level < 3).length,
    notSeen: cards.value.filter(c => c.level === 0).length
}))

const checkAnswer = () => {
    if (!userAnswer.value.trim() || !currentCard.value) return

    totalAnswers.value++
    const normalizedAnswer = userAnswer.value.trim().toLowerCase()
    const normalizedCorrect = currentCard.value.back.toLowerCase()

    isCorrect.value = normalizedAnswer === normalizedCorrect
    showAnswer.value = true

    if (isCorrect.value) {
        correctAnswers.value++
    }
}

const rateCard = async (difficulty: number) => {
    const card = cards.value[currentCardIndex.value]
    if (!card) return

    const setId = route.params.id
    if (!setId || Array.isArray(setId)) return

    let newLevel = card.level

    if (difficulty === 1) {
        newLevel = 1
    } else if (difficulty === 2) {
        newLevel = Math.min(card.level + 1, 3)
    } else if (difficulty === 3) {
        newLevel = 3
    }

    card.level = newLevel
    await progressStore.updateCardLevel(setId, currentCardIndex.value, newLevel, isCorrect.value)
    nextCard()
}

const nextCard = async () => {
    showAnswer.value = false
    userAnswer.value = ''

    let nextIndex = (currentCardIndex.value + 1) % cards.value.length
    let attempts = 0

    while (cards.value[nextIndex]?.level === 3 && attempts < cards.value.length) {
        nextIndex = (nextIndex + 1) % cards.value.length
        attempts++
    }

    if (attempts === cards.value.length) {
        const setId = route.params.id
        if (setId && !Array.isArray(setId)) {
            await progressStore.completeSession(setId, 'learn')
        }

        coinsEarned.value = masteredCards.value * 5
        userStore.earnCoins(coinsEarned.value)
        showResults.value = true
    } else {
        currentCardIndex.value = nextIndex
    }
}

const restartLearn = () => {
    cards.value.forEach(card => card.level = 0)
    currentCardIndex.value = 0
    userAnswer.value = ''
    showAnswer.value = false
    showResults.value = false
    totalAnswers.value = 0
    correctAnswers.value = 0
    coinsEarned.value = 0
}

const exitLearn = () => {
    if (totalAnswers.value > 0 && !showResults.value) {
        if (confirm('Möchtest du den Lernmodus wirklich beenden?')) {
            router.back()
        }
    } else {
        router.back()
    }
}

const getAccuracy = () => {
    if (totalAnswers.value === 0) return 0
    return Math.round((correctAnswers.value / totalAnswers.value) * 100)
}
</script>

<style scoped>
.safe-area-inset {
    padding-bottom: env(safe-area-inset-bottom);
}

.active\:scale-95:active {
    transform: scale(0.95);
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out;
}

header {
    padding-top: env(safe-area-inset-top);
}
</style>