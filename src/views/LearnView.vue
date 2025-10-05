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
                    <div class="text-sm text-gray-600">Lernmodus</div>
                    <div class="text-xs text-gray-500 mt-1">{{ masteredCards }} / {{ cards.length }} gemeistert</div>
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
                    <div class="text-sm text-gray-500 mb-3">Übersetze</div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-8">{{ currentCard.front }}</h2>
                    <div class="mb-4">
                        <input v-model="userAnswer" @keyup.enter="checkAnswer" type="text"
                            placeholder="Deine Antwort..." :disabled="showAnswer"
                            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#4255FF] text-lg"
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
                                <span :class="[
                                    'text-2xl',
                                    isCorrect ? 'text-green-600' : 'text-red-600'
                                ]">
                                    {{ isCorrect ? '✓' : '✗' }}
                                </span>
                                <span :class="[
                                    'font-bold',
                                    isCorrect ? 'text-green-800' : 'text-red-800'
                                ]">
                                    {{ isCorrect ? 'Richtig!' : 'Nicht ganz richtig' }}
                                </span>
                            </div>
                            <div v-if="!isCorrect" class="text-sm text-gray-700">
                                Korrekte Antwort: <span class="font-bold">{{ currentCard.back }}</span>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="text-sm text-gray-600 mb-2">Wie gut kanntest du die Antwort?</div>
                            <div class="grid grid-cols-3 gap-2">
                                <button @click="rateCard(1)"
                                    class="py-3 px-4 rounded-xl font-semibold text-sm bg-red-100 text-red-800 active:scale-95 transition">
                                    😔 Schwer
                                </button>
                                <button @click="rateCard(2)"
                                    class="py-3 px-4 rounded-xl font-semibold text-sm bg-yellow-100 text-yellow-800 active:scale-95 transition">
                                    🙂 Gut
                                </button>
                                <button @click="rateCard(3)"
                                    class="py-3 px-4 rounded-xl font-semibold text-sm bg-green-100 text-green-800 active:scale-95 transition">
                                    😊 Leicht
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
                    <div class="text-6xl mb-4">🎓</div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Lernrunde abgeschlossen!</h2>
                    <p class="text-gray-600 mb-6">Du hast {{ masteredCards }} von {{ cards.length }} Karten gemeistert
                    </p>
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
                            class="flex-1 bg-[#4255FF] text-white py-3 rounded-xl font-semibold active:scale-95 transition">
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
                class="w-full bg-[#4255FF] text-white py-4 rounded-xl font-semibold active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed">
                Antwort prüfen
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Card {
    id: number
    front: string
    back: string
    level: number
}

const cards = ref<Card[]>([
    { id: 1, front: 'Hello', back: 'Hallo', level: 0 },
    { id: 2, front: 'Goodbye', back: 'Auf Wiedersehen', level: 0 },
    { id: 3, front: 'Thank you', back: 'Danke', level: 0 },
    { id: 4, front: 'Please', back: 'Bitte', level: 0 },
    { id: 5, front: 'Good morning', back: 'Guten Morgen', level: 0 },
    { id: 6, front: 'Good night', back: 'Gute Nacht', level: 0 }
])

const currentCardIndex = ref(0)
const userAnswer = ref('')
const showAnswer = ref(false)
const isCorrect = ref(false)
const showResults = ref(false)
const totalAnswers = ref(0)
const correctAnswers = ref(0)

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

const rateCard = (difficulty: number) => {
    // Update card level based on difficulty
    const card = cards.value[currentCardIndex.value]
    if (!card) return

    if (difficulty === 1) {
        card.level = 1
    } else if (difficulty === 2) {
        card.level = Math.min(card.level + 1, 3)
    } else if (difficulty === 3) {
        card.level = 3
    }

    nextCard()
}

const nextCard = () => {
    showAnswer.value = false
    userAnswer.value = ''

    let nextIndex = (currentCardIndex.value + 1) % cards.value.length
    let attempts = 0

    while (cards.value[nextIndex]?.level === 3 && attempts < cards.value.length) {
        nextIndex = (nextIndex + 1) % cards.value.length
        attempts++
    }

    if (attempts === cards.value.length) {
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