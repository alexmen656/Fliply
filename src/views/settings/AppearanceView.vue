<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between">
                <button @click="$router.back()" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 class="text-xl font-bold text-gray-800">Erscheinungsbild</h1>
                <div class="w-6"></div>
            </div>
        </header>
        <main class="flex-1 overflow-y-auto px-4 py-5">
            <div class="mb-6">
                <div class="bg-yellow-100 rounded-xl p-3 flex items-center gap-2 mb-4">
                    <svg class="w-8 h-8 text-yellow-900" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                    </svg>
                    <div>
                        <div class="text-xs text-yellow-900 font-semibold">Deine Münzen</div>
                        <div class="text-lg text-yellow-900 font-bold">{{ userStore.profile.coins }}</div>
                    </div>
                </div>
                <h3 class="font-bold text-gray-800 mb-3">Farbschema</h3>
                <div class="space-y-3">
                    <button v-for="theme in themesStore.themes" :key="theme.id" @click="selectTheme(theme)" :class="[
                        'w-full flex items-center justify-between p-4 rounded-xl border-2 transition',
                        themesStore.currentTheme === theme.id ? 'border-primary bg-blue-50' : 'border-gray-200 bg-white',
                        !theme.unlocked && 'opacity-60'
                    ]">
                        <div class="flex items-center gap-3">
                            <div :class="['w-10 h-10 rounded-full', theme.color]"></div>
                            <div class="text-left">
                                <div class="font-semibold text-gray-800 flex items-center gap-2">
                                    {{ theme.name }}
                                    <svg v-if="!theme.unlocked" class="w-4 h-4 text-gray-400" fill="currentColor"
                                        viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div class="text-sm text-gray-500">{{ theme.description }}</div>
                                <div v-if="!theme.unlocked"
                                    class="text-xs text-yellow-700 font-semibold mt-1 flex items-center gap-1">
                                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                                    </svg>
                                    <span>{{ theme.cost }} Münzen</span>
                                </div>
                            </div>
                        </div>
                        <svg v-if="themesStore.currentTheme === theme.id && theme.unlocked"
                            class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            <!---
            <div class="mb-6">
                <h3 class="font-bold text-gray-800 mb-3">Schriftgröße</h3>
                <div class="bg-white rounded-xl p-5 shadow-sm">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-gray-600">Größe</span>
                        <span class="font-semibold text-gray-800">{{ fontSizeLabel }}</span>
                    </div>
                    <input v-model.number="fontSize" type="range" min="0" max="2" step="1"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                    <div class="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Klein</span>
                        <span>Normal</span>
                        <span>Groß</span>
                    </div>
                </div>
            </div>
            <div>
                <h3 class="font-bold text-gray-800 mb-3">Weitere Optionen</h3>
                <div class="bg-white rounded-xl overflow-hidden shadow-sm">
                    <div class="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                        <div>
                            <div class="font-medium text-gray-800">Animationen</div>
                            <div class="text-sm text-gray-500 mt-1">Reduziere Bewegungen</div>
                        </div>
                        <button @click="toggleAnimations"
                            :class="['w-12 h-7 rounded-full transition', animations ? 'bg-primary' : 'bg-gray-300']">
                            <div
                                :class="['w-5 h-5 bg-white rounded-full shadow transition-transform', animations ? 'translate-x-6' : 'translate-x-1']">
                            </div>
                        </button>
                    </div>
                    <div class="flex items-center justify-between px-4 py-4">
                        <div>
                            <div class="font-medium text-gray-800">Kompaktansicht</div>
                            <div class="text-sm text-gray-500 mt-1">Mehr Inhalt auf dem Bildschirm</div>
                        </div>
                        <button @click="toggleCompact"
                            :class="['w-12 h-7 rounded-full transition', compactMode ? 'bg-primary' : 'bg-gray-300']">
                            <div
                                :class="['w-5 h-5 bg-white rounded-full shadow transition-transform', compactMode ? 'translate-x-6' : 'translate-x-1']">
                            </div>
                        </button>
                    </div>
                </div>
            </div>-->

        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemesStore } from '@/stores/themes'
import { useUserStore } from '@/stores/user'
import type { Theme } from '@/stores/themes'

const themesStore = useThemesStore()
const userStore = useUserStore()
const fontSize = ref(1)
const animations = ref(true)
const compactMode = ref(false)

onMounted(async () => {
    await themesStore.loadFromStorage()
    await userStore.loadFromStorage()
})

const fontSizeLabel = computed(() => {
    const labels = ['Klein', 'Normal', 'Groß']
    return labels[fontSize.value]
})

const selectTheme = async (theme: Theme) => {
    if (theme.unlocked) {
        await themesStore.setTheme(theme.id)
    } else {
        if (userStore.profile.coins >= theme.cost) {
            const confirmed = confirm(`Möchtest du "${theme.name}" für ${theme.cost} Münzen freischalten?`)
            if (confirmed) {
                const success = await userStore.spendCoins(theme.cost, `Theme "${theme.name}" gekauft`)
                if (success) {
                    await themesStore.unlockTheme(theme.id)
                    await themesStore.setTheme(theme.id)
                }
            }
        } else {
            const needed = theme.cost - userStore.profile.coins
            alert(`Du brauchst noch ${needed} Münzen mehr! Lerne weiter, um Münzen zu verdienen. 🎓`)
        }
    }
}

const toggleAnimations = () => {
    animations.value = !animations.value
}

const toggleCompact = () => {
    compactMode.value = !compactMode.value
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
