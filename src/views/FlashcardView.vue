<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between">
                <button @click="exitFlashcards" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div class="text-center">
                    <div class="text-sm text-gray-600">{{ currentCardIndex + 1 }} / {{ cards.length }}</div>
                </div>
                <button @click="shuffleCards" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>
            <div class="mt-4">
                <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-primary rounded-full transition-all"
                        :style="{ width: ((currentCardIndex + 1) / cards.length * 100) + '%' }">
                    </div>
                </div>
            </div>
        </header>
        <main v-if="isLoading" class="flex-1 flex items-center justify-center px-6 py-8">
            <div class="text-center">
                <div class="text-gray-500 mb-2">{{ $t('common.loading') }}</div>
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
        </main>
        <main v-else-if="!currentCard" class="flex-1 flex items-center justify-center px-6 py-8">
            <div class="text-center text-gray-500">
                <p>{{ $t('allCards.noCards') }}</p>
            </div>
        </main>
        <main v-else class="flex-1 flex items-center justify-center px-6 py-8">
            <div class="w-full max-w-md">
                <div @click="flipCard" class="flashcard-container" :class="{ 'flipped': isFlipped }">
                    <div
                        class="flashcard bg-white rounded-3xl shadow-2xl p-8 min-h-[400px] flex items-center justify-center cursor-pointer">
                        <div class="flashcard-front" v-show="!isFlipped">
                            <div v-show="!isReallyFlipped" class="text-center">
                                <div class="text-sm text-gray-500 mb-4">{{ $t('create.term') }}</div>
                                <div class="text-2xl font-bold text-gray-800">{{ currentCard.front }}</div>
                            </div>
                        </div>
                        <div class="flashcard-back" v-show="isFlipped">
                            <div v-show="isReallyFlipped" class="text-center">
                                <div class="text-sm text-gray-500 mb-4">{{ $t('create.definition') }}</div>
                                <div class="text-xl text-gray-800">{{ currentCard.back }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-6 text-sm text-gray-500">
                    {{ $t('flashcards.showAnswer') }}
                </div>
            </div>
        </main>
        <div v-if="!isLoading && currentCard"
            class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 safe-area-inset">
            <div class="flex items-center justify-between gap-4">
                <button @click="previousCard" :disabled="currentCardIndex === 0" :class="[
                    'flex-1 py-4 rounded-xl font-semibold transition',
                    currentCardIndex === 0
                        ? 'bg-gray-200 text-gray-400'
                        : 'bg-gray-100 text-gray-800 active:scale-95'
                ]">
                    ← {{ $t('flashcards.previousCard') }}
                </button>
                <button v-if="currentCardIndex < cards.length - 1" @click="nextCard"
                    class="flex-1 bg-primary text-white py-4 rounded-xl font-semibold active:scale-95 transition">
                    {{ $t('flashcards.nextCard') }} →
                </button>
                <button v-else @click="finishSession"
                    class="flex-1 bg-green-500 text-white py-4 rounded-xl font-semibold active:scale-95 transition">
                    ✓ {{ $t('common.done') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStreakStore } from '@/stores/streak'
import { useUserStore } from '@/stores/user'
import { useSetsStore } from '@/stores/sets'
import { useProgressStore } from '@/stores/progress'
import { useGoalsStore } from '@/stores/goals'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const streakStore = useStreakStore()
const setsStore = useSetsStore()
const progressStore = useProgressStore()
const goalsStore = useGoalsStore()

const currentCardIndex = ref(0)
const isFlipped = ref(false)
const isReallyFlipped = ref(false)
const isLoading = ref(true)
const viewedCards = ref<Set<number>>(new Set())

interface Card {
    id: number
    front: string
    back: string
    level: number
}

const cards = ref<Card[]>([])

onMounted(async () => {
    await progressStore.loadProgress()
    const setId = route.params.id
    if (setId && !Array.isArray(setId)) {
        isLoading.value = true
        try {
            const setData = await setsStore.getSetById(setId)
            if (setData && Array.isArray(setData.cards)) {
                cards.value = setData.cards.map((card: any, index: number) => ({
                    id: index,
                    front: card.front,
                    back: card.back,
                    level: 0
                }))
            }
        } catch (error) {
            console.error('Error loading cards:', error)
        } finally {
            isLoading.value = false
        }
    }
})


const currentCard = computed(() => cards.value[currentCardIndex.value] as { front: string; back: string })

const flipCard = () => {
    isFlipped.value = !isFlipped.value

    if (isFlipped.value) {
        viewedCards.value.add(currentCardIndex.value)
    }

    setTimeout(() => {
        isReallyFlipped.value = !isReallyFlipped.value
    }, 160)
}

const nextCard = () => {
    if (currentCardIndex.value < cards.value.length - 1) {
        currentCardIndex.value++
        isFlipped.value = false
        isReallyFlipped.value = false
    }
}

const previousCard = () => {
    if (currentCardIndex.value > 0) {
        currentCardIndex.value--
        isFlipped.value = false
        isReallyFlipped.value = false
    }
}

const shuffleCards = () => {
    cards.value = cards.value.sort(() => Math.random() - 0.5)
    currentCardIndex.value = 0
    isFlipped.value = false
    isReallyFlipped.value = false
}

const finishSession = async () => {
    const setId = route.params.id
    if (setId && !Array.isArray(setId)) {
        const cardResults = Array.from(viewedCards.value).map(cardIndex => ({
            cardIndex,
            isCorrect: true
        }))

        await progressStore.completeSession(setId, 'flashcards', cardResults)
        await goalsStore.updateTodayProgress(viewedCards.value.size)
    }

    streakStore.recordStudySession()
    router.push('/home')
}

const exitFlashcards = async () => {
    if (viewedCards.value.size > 0) {
        if (confirm(t('flashcards.confirmExit'))) {
            await goalsStore.updateTodayProgress(viewedCards.value.size)
            router.back()
        }
    } else {
        router.back()
    }
}
</script>

<style scoped>
.safe-area-inset {
    padding-bottom: env(safe-area-inset-bottom);
}

.flashcard-container {
    perspective: 1000px;
}

.flashcard {
    transform-style: preserve-3d;
    transition: transform 0.6s;
}

.flashcard-container.flipped .flashcard {
    transform: rotateY(180deg);
}

.flashcard-back {
    transform: rotateY(180deg);
}

.active\:scale-95:active {
    transform: scale(0.95);
}

header {
    padding-top: env(safe-area-inset-top);
}
</style>