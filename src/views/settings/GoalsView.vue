<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between">
                <button @click="$router.back()" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 class="text-xl font-bold text-gray-800">Lernziele</h1>
                <button @click="saveGoals" class="text-primary font-semibold">Speichern</button>
            </div>
        </header>
        <main class="flex-1 overflow-y-auto px-4 py-5">
            <div class="bg-white rounded-xl p-5 shadow-sm mb-4">
                <h3 class="font-bold text-gray-800 mb-3">Tägliches Ziel</h3>
                <div class="flex items-center justify-between mb-3">
                    <span class="text-gray-600">Karten pro Tag</span>
                    <span class="text-2xl font-bold text-primary">{{ dailyGoal }}</span>
                </div>
                <input v-model.number="dailyGoal" type="range" min="5" max="100" step="5"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                <div class="flex justify-between text-xs text-gray-500 mt-2">
                    <span>5</span>
                    <span>100</span>
                </div>
            </div>
            <div class="bg-white rounded-xl p-5 shadow-sm mb-4">
                <h3 class="font-bold text-gray-800 mb-3">Wöchentliches Ziel</h3>
                <div class="flex items-center justify-between mb-3">
                    <span class="text-gray-600">Lerntage pro Woche</span>
                    <span class="text-2xl font-bold text-green-600">{{ weeklyGoal }}</span>
                </div>
                <input v-model.number="weeklyGoal" type="range" min="1" max="7" step="1"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                <div class="flex justify-between text-xs text-gray-500 mt-2">
                    <span>1</span>
                    <span>7</span>
                </div>
            </div>
            <div class="bg-white rounded-xl p-5 shadow-sm">
                <h3 class="font-bold text-gray-800 mb-3">Bevorzugte Lernzeit</h3>
                <select v-model="studyTime"
                    class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary">
                    <option value="morning">Morgens (6-12 Uhr)</option>
                    <option value="afternoon">Nachmittags (12-18 Uhr)</option>
                    <option value="evening">Abends (18-24 Uhr)</option>
                    <option value="anytime">Keine Präferenz</option>
                </select>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGoalsStore } from '@/stores/goals'

const router = useRouter()
const goalsStore = useGoalsStore()

const dailyGoal = ref(20)
const weeklyGoal = ref(5)
const studyTime = ref('evening')

onMounted(async () => {
    await goalsStore.loadGoals()
    dailyGoal.value = goalsStore.dailyGoal
    weeklyGoal.value = goalsStore.weeklyGoal
    studyTime.value = goalsStore.studyTime
})

const saveGoals = async () => {
    goalsStore.dailyGoal = dailyGoal.value
    goalsStore.weeklyGoal = weeklyGoal.value
    goalsStore.studyTime = studyTime.value
    await goalsStore.saveGoals()
    router.back()
}
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: #4255FF;
    cursor: pointer;
    border-radius: 50%;
}

input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #4255FF;
    cursor: pointer;
    border-radius: 50%;
}

header {
    padding-top: env(safe-area-inset-top);
}
</style>
