<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between">
                <button @click="exitQuiz" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div class="text-center">
                    <div class="text-sm text-gray-600">{{ $t('quiz.question') }} {{ currentQuestionIndex + 1 }} / {{
                        questions.length }}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">{{ $t('quiz.score') }}: {{ score }} / {{ questions.length }}
                    </div>
                </div>
                <div class="w-6"></div>
            </div>
            <div class="mt-4">
                <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-purple-500 rounded-full transition-all"
                        :style="{ width: ((currentQuestionIndex + 1) / questions.length * 100) + '%' }">
                    </div>
                </div>
            </div>
        </header>
        <main v-if="!showResults && currentQuestion" class="flex-1 overflow-y-auto px-6 py-8">
            <div class="max-w-2xl mx-auto">
                <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div class="text-sm text-gray-500 mb-3">{{ $t('quiz.question') }} {{ currentQuestionIndex + 1 }}
                    </div>
                    <h2 class="text-xl font-bold text-gray-800 mb-6">{{ currentQuestion.question }}</h2>
                    <div class="space-y-3">
                        <button v-for="(option, index) in currentQuestion.options" :key="index"
                            @click="selectAnswer(option)" :disabled="selectedAnswer !== null" :class="[
                                'w-full text-left p-4 rounded-xl font-medium transition-all',
                                getOptionClass(option)
                            ]">
                            <div class="flex items-center justify-between">
                                <span>{{ option }}</span>
                                <span v-if="selectedAnswer === option && option === currentQuestion.correct"
                                    class="text-green-600">✓</span>
                                <span v-if="selectedAnswer === option && option !== currentQuestion.correct"
                                    class="text-red-600">✗</span>
                                <span
                                    v-if="selectedAnswer && selectedAnswer !== option && option === currentQuestion.correct"
                                    class="text-green-600">✓</span>
                            </div>
                        </button>
                    </div>
                </div>
                <div v-if="selectedAnswer && currentQuestion"
                    class="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
                    <div class="flex items-start gap-3">
                        <div :class="[
                            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                            selectedAnswer === currentQuestion.correct ? 'bg-green-100' : 'bg-red-100'
                        ]">
                            <span :class="[
                                'text-2xl',
                                selectedAnswer === currentQuestion.correct ? 'text-green-600' : 'text-red-600'
                            ]">
                                {{ selectedAnswer === currentQuestion.correct ? '✓' : '✗' }}
                            </span>
                        </div>
                        <div class="flex-1">
                            <h3 :class="[
                                'font-bold text-lg mb-2',
                                selectedAnswer === currentQuestion.correct ? 'text-green-600' : 'text-red-600'
                            ]">
                                {{ selectedAnswer === currentQuestion.correct ? 'Richtig!' : 'Leider falsch' }}
                            </h3>
                            <p class="text-gray-600 text-sm">
                                {{ currentQuestion.explanation }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <main v-else-if="showResults" class="flex-1 overflow-y-auto px-6 py-8">
            <div class="max-w-2xl mx-auto text-center">
                <div class="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div class="text-6xl mb-4">
                        <svg class="w-24 h-24 mx-auto" :class="getResultColor()" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                :d="getResultIcon()" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ $t('quiz.completedTitle') }}</h2>
                    <p class="text-gray-600 mb-6">{{ $t('quiz.completedMessage') }}</p>

                    <div v-if="coinsEarned > 0" class="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-6">
                        <div class="flex items-center justify-center gap-2">
                            <span class="text-3xl">🪙</span>
                            <div>
                                <div class="text-lg font-bold text-yellow-800">+{{ coinsEarned }} {{ $t('profile.coins')
                                    }}</div>
                                <div class="text-sm text-yellow-700">{{ $t('coinHistory.balance') }}: {{
                                    userStore.profile.coins }} {{ $t('profile.coins') }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-4 mb-6">
                        <div class="bg-green-50 rounded-xl p-4">
                            <div class="text-2xl font-bold text-green-600">{{ score }}</div>
                            <div class="text-xs text-gray-600">{{ $t('quiz.correct') }}</div>
                        </div>
                        <div class="bg-red-50 rounded-xl p-4">
                            <div class="text-2xl font-bold text-red-600">{{ questions.length - score }}</div>
                            <div class="text-xs text-gray-600">{{ $t('quiz.incorrect') }}</div>
                        </div>
                        <div class="bg-blue-50 rounded-xl p-4">
                            <div class="text-2xl font-bold text-blue-600">{{ getPercentage() }}%</div>
                            <div class="text-xs text-gray-600">{{ $t('learn.accuracy') }}</div>
                        </div>
                    </div>

                    <div class="flex gap-3">
                        <button @click="restartQuiz"
                            class="flex-1 bg-primary text-white py-3 rounded-xl font-semibold active:scale-95 transition">
                            {{ $t('quiz.tryAgain') }}
                        </button>
                        <button @click="$router.back()"
                            class="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold active:scale-95 transition">
                            {{ $t('common.back') }}
                        </button>
                    </div>
                </div>
            </div>
        </main>
        <div v-if="selectedAnswer && !showResults"
            class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 safe-area-inset">
            <button @click="nextQuestion"
                class="w-full bg-primary text-white py-4 rounded-xl font-semibold active:scale-95 transition">
                {{ currentQuestionIndex < questions.length - 1 ? 'Weiter →' : 'Ergebnisse anzeigen' }} </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useSetsStore } from '@/stores/sets'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const setsStore = useSetsStore()

const currentQuestionIndex = ref(0)
const selectedAnswer = ref<string | null>(null)
const score = ref(0)
const showResults = ref(false)
const coinsEarned = ref(0)
const isLoading = ref(true)

interface QuizQuestion {
    question: string
    options: string[]
    correct: string
    explanation: string
}

const questions = ref<QuizQuestion[]>([])

onMounted(async () => {
    const setId = route.params.id
    if (setId && !Array.isArray(setId)) {
        isLoading.value = true
        try {
            const setData = await setsStore.getSetById(setId)
            if (setData && Array.isArray(setData.cards)) {
                // Generate quiz questions from cards
                questions.value = setData.cards.map((card: any) => {
                    // Generate wrong answers from other cards
                    const wrongAnswers = setData.cards
                        .filter((c: any) => c.back !== card.back)
                        .map((c: any) => c.back)
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 3)

                    const allOptions = [card.back, ...wrongAnswers].sort(() => Math.random() - 0.5)

                    return {
                        question: `Was bedeutet "${card.front}"?`,
                        options: allOptions,
                        correct: card.back,
                        explanation: `"${card.front}" bedeutet "${card.back}".`
                    }
                })
            }
        } catch (error) {
            console.error('Error loading quiz questions:', error)
        } finally {
            isLoading.value = false
        }
    }
})

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

const selectAnswer = (option: string) => {
    if (selectedAnswer.value !== null) return
    if (!currentQuestion.value) return

    selectedAnswer.value = option
    if (option === currentQuestion.value.correct) {
        score.value++
    }
}

const getOptionClass = (option: string) => {
    if (selectedAnswer.value === null || !currentQuestion.value) {
        return 'bg-gray-50 border-2 border-gray-200 text-gray-800 active:scale-98 hover:bg-gray-100'
    }

    if (option === currentQuestion.value.correct) {
        return 'bg-green-50 border-2 border-green-500 text-green-800'
    }

    if (selectedAnswer.value === option && option !== currentQuestion.value.correct) {
        return 'bg-red-50 border-2 border-red-500 text-red-800'
    }

    return 'bg-gray-50 border-2 border-gray-200 text-gray-500'
}

const nextQuestion = () => {
    if (currentQuestionIndex.value < questions.value.length - 1) {
        currentQuestionIndex.value++
        selectedAnswer.value = null
    } else {
        // Calculate coins earned (10 coins per correct answer)
        coinsEarned.value = score.value * 10
        userStore.earnCoins(coinsEarned.value)
        showResults.value = true
    }
}

const restartQuiz = () => {
    currentQuestionIndex.value = 0
    selectedAnswer.value = null
    score.value = 0
    showResults.value = false
    coinsEarned.value = 0
}

const exitQuiz = () => {
    if (confirm('Möchtest du das Quiz wirklich beenden?')) {
        router.back()
    }
}

const getPercentage = () => {
    return Math.round((score.value / questions.value.length) * 100)
}

const getResultIcon = () => {
    const percentage = getPercentage()
    if (percentage >= 90) return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' // Check circle
    if (percentage >= 70) return 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' // Happy
    if (percentage >= 50) return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' // Document
    return 'M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' // Sad
}

const getResultColor = () => {
    const percentage = getPercentage()
    if (percentage >= 90) return 'text-green-500'
    if (percentage >= 70) return 'text-blue-500'
    if (percentage >= 50) return 'text-yellow-500'
    return 'text-red-500'
}
</script>

<style scoped>
.safe-area-inset {
    padding-bottom: env(safe-area-inset-bottom);
}

.active\:scale-95:active {
    transform: scale(0.95);
}

.active\:scale-98:active {
    transform: scale(0.98);
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