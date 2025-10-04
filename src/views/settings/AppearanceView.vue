<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <!-- Header -->
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

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto px-4 py-5">
            <!-- Theme Selection -->
            <div class="mb-6">
                <h3 class="font-bold text-gray-800 mb-3">Farbschema</h3>
                <div class="space-y-3">
                    <button v-for="theme in themes" :key="theme.id" @click="selectTheme(theme.id)"
                        :class="[
                            'w-full flex items-center justify-between p-4 rounded-xl border-2 transition',
                            selectedTheme === theme.id ? 'border-[#4255FF] bg-blue-50' : 'border-gray-200 bg-white'
                        ]">
                        <div class="flex items-center gap-3">
                            <div :class="['w-10 h-10 rounded-full', theme.color]"></div>
                            <div class="text-left">
                                <div class="font-semibold text-gray-800">{{ theme.name }}</div>
                                <div class="text-sm text-gray-500">{{ theme.description }}</div>
                            </div>
                        </div>
                        <svg v-if="selectedTheme === theme.id" class="w-6 h-6 text-[#4255FF]" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Font Size -->
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

            <!-- Animations -->
            <div>
                <h3 class="font-bold text-gray-800 mb-3">Weitere Optionen</h3>
                <div class="bg-white rounded-xl overflow-hidden shadow-sm">
                    <div class="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                        <div>
                            <div class="font-medium text-gray-800">Animationen</div>
                            <div class="text-sm text-gray-500 mt-1">Reduziere Bewegungen</div>
                        </div>
                        <button @click="toggleAnimations" 
                            :class="['w-12 h-7 rounded-full transition', animations ? 'bg-[#4255FF]' : 'bg-gray-300']">
                            <div :class="['w-5 h-5 bg-white rounded-full shadow transition-transform', animations ? 'translate-x-6' : 'translate-x-1']"></div>
                        </button>
                    </div>
                    <div class="flex items-center justify-between px-4 py-4">
                        <div>
                            <div class="font-medium text-gray-800">Kompaktansicht</div>
                            <div class="text-sm text-gray-500 mt-1">Mehr Inhalt auf dem Bildschirm</div>
                        </div>
                        <button @click="toggleCompact" 
                            :class="['w-12 h-7 rounded-full transition', compactMode ? 'bg-[#4255FF]' : 'bg-gray-300']">
                            <div :class="['w-5 h-5 bg-white rounded-full shadow transition-transform', compactMode ? 'translate-x-6' : 'translate-x-1']"></div>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const selectedTheme = ref('default')
const fontSize = ref(1)
const animations = ref(true)
const compactMode = ref(false)

const themes = ref([
    { id: 'default', name: 'Standard', description: 'Blau & Modern', color: 'bg-[#4255FF]' },
    { id: 'green', name: 'Grün', description: 'Frisch & Natürlich', color: 'bg-green-500' },
    { id: 'purple', name: 'Lila', description: 'Kreativ & Elegant', color: 'bg-purple-500' },
    { id: 'orange', name: 'Orange', description: 'Warm & Energisch', color: 'bg-orange-500' }
])

const fontSizeLabel = computed(() => {
    const labels = ['Klein', 'Normal', 'Groß']
    return labels[fontSize.value]
})

const selectTheme = (id: string) => {
    selectedTheme.value = id
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
</style>
