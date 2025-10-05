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
                    <div class="text-sm font-semibold text-gray-800">Match</div>
                    <div class="text-xs text-gray-500 mt-1">{{ matchedPairs }} / {{ totalPairs }} Paare</div>
                </div>
                <div class="text-right">
                    <div class="text-sm font-bold text-[#4255FF]">{{ formatTime(elapsedTime) }}</div>
                </div>
            </div>
        </header>
        <main v-if="!showResults" class="flex-1 overflow-y-auto px-4 py-6">
            <div class="max-w-2xl mx-auto">
                <div class="text-center mb-6">
                    <p class="text-gray-600 text-sm">Ordne die Begriffe ihren Übersetzungen zu</p>
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
                    <div class="text-6xl mb-4">⚡</div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Perfekt!</h2>
                    <p class="text-gray-600 mb-6">Du hast alle Paare gefunden</p>
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-blue-50 rounded-xl p-4">
                            <div class="text-2xl font-bold text-blue-600">{{ formatTime(finalTime) }}</div>
                            <div class="text-xs text-gray-600">Zeit</div>
                        </div>
                        <div class="bg-green-50 rounded-xl p-4">
                            <div class="text-2xl font-bold text-green-600">{{ totalPairs }}</div>
                            <div class="text-xs text-gray-600">Paare</div>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <button @click="restartMatch"
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
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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

const pairs = [
    { term: 'Hello', definition: 'Hallo' },
    { term: 'Goodbye', definition: 'Auf Wiedersehen' },
    { term: 'Thank you', definition: 'Danke' },
    { term: 'Please', definition: 'Bitte' },
    { term: 'Good morning', definition: 'Guten Morgen' },
    { term: 'Good night', definition: 'Gute Nacht' }
]

const initializeGame = () => {
    totalPairs.value = pairs.length

    const leftItemsTemp = pairs.map((pair, index) => ({
        id: index * 2,
        text: pair.term,
        pairId: index,
        matched: false
    }))

    const rightItemsTemp = pairs.map((pair, index) => ({
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
        return 'bg-[#4255FF] border-2 border-[#4255FF] text-white'
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

const finishGame = () => {
    finalTime.value = elapsedTime.value
    stopTimer()
    setTimeout(() => {
        showResults.value = true
    }, 1000)
}

const restartMatch = () => {
    matchedPairs.value = 0
    showResults.value = false
    selectedLeft.value = null
    selectedRight.value = null
    stopTimer()
    initializeGame()
}

const exitMatch = () => {
    if (matchedPairs.value > 0 && !showResults.value) {
        if (confirm('Möchtest du das Spiel wirklich beenden?')) {
            stopTimer()
            router.back()
        }
    } else {
        stopTimer()
        router.back()
    }
}

onMounted(() => {
    initializeGame()
})

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