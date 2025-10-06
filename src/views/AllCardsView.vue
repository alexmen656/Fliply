<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between mb-4">
                <button @click="$router.back()" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 class="text-lg font-bold text-gray-800">Alle Karten</h1>
                <button @click="toggleSearchMode" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>
            <div v-if="searchMode" class="mb-4 animate-slide-down">
                <input v-model="searchQuery" type="text" placeholder="Karten durchsuchen..."
                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
            </div>
            <div class="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                <button v-for="filter in filters" :key="filter.id" @click="activeFilter = filter.id" :class="[
                    'px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all',
                    activeFilter === filter.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600'
                ]">
                    {{ filter.label }}
                    <span v-if="filter.count !== undefined" class="ml-1">({{ filter.count }})</span>
                </button>
            </div>
        </header>
        <main class="flex-1 overflow-y-auto px-4 py-4">
            <div v-if="isLoading" class="text-center py-12">
                <p class="text-gray-500">Lade Karten...</p>
            </div>

            <div v-else class="max-w-2xl mx-auto space-y-3">
                <div v-if="filteredCards.length === 0" class="text-center py-12">
                    <div class="mx-auto w-16 h-16 mb-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-full h-full">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                    <p class="text-gray-600">Keine Karten gefunden</p>
                </div>

                <div v-for="(card, index) in filteredCards" :key="card.id"
                    class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="p-4">
                        <div class="flex items-start justify-between mb-3">
                            <span class="text-xs font-semibold text-gray-500">Karte {{ getCardNumber(index) }}</span>
                            <button @click="toggleStar(card)" class="text-2xl">
                                {{ card.starred ? '⭐' : '☆' }}
                            </button>
                        </div>
                        <div class="mb-3">
                            <div class="text-xs text-gray-500 mb-1">Vorderseite</div>
                            <div class="text-gray-800 font-medium">{{ card.front }}</div>
                        </div>
                        <div class="border-t border-gray-200 my-3"></div>
                        <div>
                            <div class="text-xs text-gray-500 mb-1">Rückseite</div>
                            <div class="text-sm text-gray-600">{{ card.back }}</div>
                        </div>
                        <div class="flex gap-2 mt-4">
                            <button @click="editCard(card)"
                                class="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium active:scale-95 transition flex items-center justify-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Bearbeiten
                            </button>
                            <button @click="deleteCard(card)"
                                class="py-2 px-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium active:scale-95 transition">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div v-if="card.progress !== undefined" class="bg-gray-50 px-4 py-2 flex items-center gap-2">
                        <div class="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full bg-primary rounded-full transition-all"
                                :style="{ width: card.progress + '%' }">
                            </div>
                        </div>
                        <span class="text-xs text-gray-600">{{ card.progress }}%</span>
                    </div>
                </div>
            </div>
        </main>
        <button @click="addCard"
            class="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg active:scale-95 transition flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSetsStore } from '@/stores/sets'

const router = useRouter()
const route = useRoute()
const setsStore = useSetsStore()

interface Card {
    id?: number
    front: string
    back: string
    order: number
    starred?: boolean
    progress?: number
}

const searchMode = ref(false)
const searchQuery = ref('')
const activeFilter = ref('all')
const isLoading = ref(true)
const setTitle = ref('')

const filters = ref([
    { id: 'all', label: 'Alle', count: undefined },
    { id: 'starred', label: 'Markiert' },
    { id: 'not-learned', label: 'Noch nicht gelernt' },
    { id: 'learning', label: 'Am Lernen' },
    { id: 'mastered', label: 'Gemeistert' }
])

const cards = ref<Card[]>([])

onMounted(async () => {
    await loadCards()
})

const loadCards = async () => {
    const setId = route.params.id
    if (!setId || Array.isArray(setId)) return

    isLoading.value = true
    try {
        const setData = await setsStore.getSetById(setId)
        if (setData) {
            setTitle.value = setData.title
            if (Array.isArray(setData.cards)) {
                cards.value = setData.cards.map((card: any, index: number) => ({
                    id: index,
                    front: card.front,
                    back: card.back,
                    order: card.order || index,
                    starred: false,
                    progress: 0
                }))
            }
        }
    } catch (error) {
        console.error('Error loading cards:', error)
    } finally {
        isLoading.value = false
    }
}

const filteredCards = computed(() => {
    let result = cards.value

    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(card =>
            card.front.toLowerCase().includes(query) ||
            card.back.toLowerCase().includes(query)
        )
    }

    if (activeFilter.value === 'starred') {
        result = result.filter(card => card.starred)
    } else if (activeFilter.value === 'not-learned') {
        result = result.filter(card => card.progress === 0)
    } else if (activeFilter.value === 'learning') {
        result = result.filter(card => card.progress && card.progress > 0 && card.progress < 100)
    } else if (activeFilter.value === 'mastered') {
        result = result.filter(card => card.progress === 100)
    }

    return result
})

const toggleSearchMode = () => {
    searchMode.value = !searchMode.value
    if (!searchMode.value) {
        searchQuery.value = ''
    }
}

const toggleStar = (card: Card) => {
    card.starred = !card.starred
}

const getCardNumber = (index: number) => {
    const card = filteredCards.value[index]
    if (!card) return index + 1
    const originalIndex = cards.value.findIndex(c => c.id === card.id)
    return originalIndex + 1
}

const editCard = (card: Card) => {
    console.log('Edit card:', card.id)
}

const deleteCard = (card: Card) => {
    if (confirm('Möchtest du diese Karte wirklich löschen?')) {
        const index = cards.value.findIndex(c => c.id === card.id)
        if (index > -1) {
            cards.value.splice(index, 1)
        }
    }
}

const addCard = () => {
    console.log('Add new card')
    const setId = route.params.id
    router.push(`/edit-set/${setId}`)
}
</script>

<style scoped>
.safe-area-inset {
    padding-bottom: env(safe-area-inset-bottom);
}

.active\:scale-95:active {
    transform: scale(0.95);
}

.hide-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

@keyframes slide-down {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-down {
    animation: slide-down 0.2s ease-out;
}

header {
    padding-top: env(safe-area-inset-top);
}
</style>
