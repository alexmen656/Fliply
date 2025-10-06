<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between mb-4">
                <button @click="$router.back()" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div class="flex items-center gap-3">
                    <button @click="toggleFavorite" class="text-2xl">
                        {{ isFavorite ? '⭐' : '☆' }}
                    </button>
                    <button @click="editSet" class="text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div v-if="isLoading" class="text-center py-8">
                <p class="text-gray-500">Lade Set...</p>
            </div>
            <div v-else class="mb-4">
                <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ setTitle }}</h1>
                <div class="flex items-center gap-3 text-sm text-gray-600">
                    <span>{{ totalCards }} Karten</span>
                    <span>•</span>
                    <div class="flex items-center gap-2">
                        <div class="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <span>{{ authorName }}</span>
                    </div>
                </div>
            </div>
            <div v-if="!isLoading" class="mb-4">
                <div class="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>Fortschritt</span>
                    <span>{{ progress }}%</span>
                </div>
                <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-primary rounded-full transition-all" :style="{ width: progress + '%' }">
                    </div>
                </div>
            </div>
        </header>
        <main class="flex-1 overflow-y-auto pb-6 px-4 py-5">
            <section v-if="!isLoading" class="mb-6">
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
                        class="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl p-6 shadow-lg active:scale-95 transition flex flex-col items-center justify-center relative">
                        <div
                            class="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span>{{ totalCards * 10 }}</span>
                        </div>
                        <svg class="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="font-semibold">Quiz</span>
                    </button>
                    <button @click="startMode('match')"
                        class="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg active:scale-95 transition flex flex-col items-center justify-center relative">
                        <div
                            class="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span>{{ totalCards * 7 }}</span>
                        </div>
                        <svg class="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span class="font-semibold">Match</span>
                    </button>
                    <button @click="startMode('learn')"
                        class="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl p-6 shadow-lg active:scale-95 transition flex flex-col items-center justify-center relative">
                        <div
                            class="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span>{{ totalCards * 5 }}</span>
                        </div>
                        <svg class="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span class="font-semibold">Lernen</span>
                    </button>
                </div>
            </section>
            <section v-if="!isLoading && cards.length > 0">
                <div class="flex items-center justify-between mb-3">
                    <h2 class="text-lg font-bold text-gray-800">Karten ({{ cards.length }})</h2>
                    <button @click="viewAllCards" class="text-primary text-sm font-semibold">Alle anzeigen</button>
                </div>
                <div class="space-y-3">
                    <div v-for="(card, index) in cards.slice(0, 5)" :key="index"
                        class="bg-white rounded-xl p-4 shadow-sm">
                        <div class="flex items-start justify-between mb-2">
                            <span class="text-xs font-semibold text-gray-500">Karte {{ index + 1 }}</span>
                        </div>
                        <div class="space-y-2">
                            <div class="text-gray-800 font-medium">{{ card.front }}</div>
                            <div class="text-sm text-gray-600">{{ card.back }}</div>
                        </div>
                    </div>
                </div>
            </section>
            <section v-if="!isLoading && cards.length === 0" class="text-center py-8">
                <p class="text-gray-500">Keine Karten in diesem Set</p>
            </section>
        </main>
        <div v-if="!isLoading"
            class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 safe-area-inset">
            <button @click="startMode('flashcards')"
                class="w-full bg-primary text-white font-bold py-4 rounded-xl active:scale-98 transition flex items-center justify-center gap-2">
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSetsStore } from '@/stores/sets'

const router = useRouter()
const route = useRoute()
const setsStore = useSetsStore()

const setTitle = ref('')
const authorName = ref('')
const authorAvatar = ref('')
const totalCards = ref(0)
const progress = ref(0)
const cards = ref<any[]>([])
const setIcon = ref('📚')
const isLoading = ref(true)
const isFavorite = ref(false)

onMounted(async () => {
    await loadSetData()
})

const loadSetData = async () => {
    const setId = route.params.id
    if (!setId || Array.isArray(setId)) return

    isLoading.value = true
    try {
        const setData = await setsStore.getSetById(setId)
        if (setData) {
            setTitle.value = setData.title
            authorName.value = setData.author || 'Unbekannt'
            authorAvatar.value = setData.avatar || ''
            setIcon.value = setData.icon || '📚'

            // Karten verarbeiten
            if (Array.isArray(setData.cards)) {
                cards.value = setData.cards.map((card: any, index: number) => ({
                    front: card.front,
                    back: card.back,
                    order: card.order || index,
                    starred: false
                }))
                totalCards.value = cards.value.length
            } else {
                totalCards.value = 0
                cards.value = []
            }

            // Fortschritt berechnen (TODO: später aus Preferences laden)
            progress.value = 0

            // Favoriten-Status prüfen
            isFavorite.value = setsStore.isFavorite(setId)

            // Als "zuletzt verwendet" markieren
            await setsStore.markAsRecent(setId, setTitle.value, totalCards.value)
        }
    } catch (error) {
        console.error('Error loading set data:', error)
    } finally {
        isLoading.value = false
    }
}

const toggleFavorite = async () => {
    const setId = route.params.id
    if (setId && !Array.isArray(setId)) {
        await setsStore.toggleFavorite(setId)
        isFavorite.value = setsStore.isFavorite(setId)
    }
}

const startMode = (mode: string) => {
    const setId = route.params.id
    if (mode === 'flashcards') {
        router.push(`/flashcards/${setId}`)
    } else if (mode === 'quiz') {
        router.push(`/quiz/${setId}`)
    } else if (mode === 'match') {
        router.push(`/match/${setId}`)
    } else if (mode === 'learn') {
        router.push(`/learn/${setId}`)
    } else {
        console.log('Starting mode:', mode)
    }
}

const editSet = () => {
    const setId = route.params.id
    router.push(`/edit-set/${setId}`)
}

const viewAllCards = () => {
    const setId = route.params.id
    router.push(`/set/${setId}/cards`)
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

header {
    padding-top: env(safe-area-inset-top);
}
</style>
