<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between mb-4">
                <button @click="$router.back()" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button @click="editSet" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
            </div>

            <div class="mb-4">
                <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ setTitle }}</h1>
                <div class="flex items-center gap-3 text-sm text-gray-600">
                    <span>{{ totalCards }} Karten</span>
                    <span>•</span>
                    <div class="flex items-center gap-2">
                        <img :src="authorAvatar" class="w-5 h-5 rounded-full" alt="avatar" />
                        <span>{{ authorName }}</span>
                    </div>
                </div>
            </div>

            <!-- Progress Bar -->
            <div class="mb-4">
                <div class="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>Fortschritt</span>
                    <span>{{ progress }}%</span>
                </div>
                <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-[#4255FF] rounded-full transition-all" :style="{ width: progress + '%' }">
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto pb-6 px-4 py-5">
            <!-- Study Options -->
            <section class="mb-6">
                <h2 class="text-lg font-bold text-gray-800 mb-3">Lernmodi</h2>
                <div class="grid grid-cols-2 gap-3">
                    <button @click="startMode('flashcards')"
                        class="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg active:scale-95 transition flex flex-col items-center justify-center">
                        <svg class="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span class="font-semibold">Karteikarten</span>
                    </button>

                    <button @click="startMode('quiz')"
                        class="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl p-6 shadow-lg active:scale-95 transition flex flex-col items-center justify-center">
                        <svg class="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="font-semibold">Quiz</span>
                    </button>

                    <button @click="startMode('match')"
                        class="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg active:scale-95 transition flex flex-col items-center justify-center">
                        <svg class="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span class="font-semibold">Match</span>
                    </button>

                    <button @click="startMode('learn')"
                        class="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl p-6 shadow-lg active:scale-95 transition flex flex-col items-center justify-center">
                        <svg class="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span class="font-semibold">Lernen</span>
                    </button>
                </div>
            </section>

            <!-- Cards Preview -->
            <section>
                <div class="flex items-center justify-between mb-3">
                    <h2 class="text-lg font-bold text-gray-800">Karten ({{ cards.length }})</h2>
                    <button class="text-[#4255FF] text-sm font-semibold">Alle anzeigen</button>
                </div>

                <div class="space-y-3">
                    <div v-for="(card, index) in cards.slice(0, 5)" :key="index"
                        class="bg-white rounded-xl p-4 shadow-sm">
                        <div class="flex items-start justify-between mb-2">
                            <span class="text-xs font-semibold text-gray-500">Karte {{ index + 1 }}</span>
                            <button class="text-yellow-500 text-lg">
                                {{ card.starred ? '⭐' : '☆' }}
                            </button>
                        </div>
                        <div class="space-y-2">
                            <div class="text-gray-800 font-medium">{{ card.front }}</div>
                            <div class="text-sm text-gray-600">{{ card.back }}</div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <!-- Bottom Action -->
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 safe-area-inset">
            <button @click="startMode('flashcards')"
                class="w-full bg-[#4255FF] text-white font-bold py-4 rounded-xl active:scale-98 transition flex items-center justify-center gap-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Jetzt lernen
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const setTitle = ref('Exercise 1&2')
const authorName = ref('Expert teacher')
const authorAvatar = ref('https://i.pravatar.cc/150?img=1')
const totalCards = ref(62)
const progress = ref(45)

const cards = ref([
    { front: 'What is Vue.js?', back: 'A progressive JavaScript framework for building user interfaces', starred: true },
    { front: 'What is TypeScript?', back: 'A typed superset of JavaScript that compiles to plain JavaScript', starred: false },
    { front: 'What is Tailwind CSS?', back: 'A utility-first CSS framework', starred: true },
    { front: 'What is Capacitor?', back: 'A cross-platform app runtime', starred: false },
    { front: 'What is a component?', back: 'A reusable piece of UI with its own logic and styling', starred: false }
])

const startMode = (mode: string) => {
    const setId = route.params.id
    if (mode === 'flashcards') {
        router.push(`/flashcards/${setId}`)
    } else {
        console.log('Starting mode:', mode)
        // Andere Modi können später implementiert werden
    }
}

const editSet = () => {
    const setId = route.params.id
    router.push(`/edit-set/${setId}`)
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
</style>
