<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between mb-4">
                <h1 class="text-2xl font-bold text-gray-800">Bibliothek</h1>
                <button class="text-[#4255FF] p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                </button>
            </div>
            <div class="flex gap-4 border-b border-gray-200">
                <button v-for="tab in tabs" :key="tab.name" @click="activeTab = tab.name" :class="[
                    'pb-2 px-1 text-sm font-medium transition',
                    activeTab === tab.name
                        ? 'text-[#4255FF] border-b-2 border-[#4255FF]'
                        : 'text-gray-500'
                ]">
                    {{ tab.label }}
                </button>
            </div>
        </header>
        <main class="flex-1 overflow-y-auto pb-20 px-4 py-5">
            <div v-if="activeTab === 'mySets'" class="space-y-3">
                <div v-if="setsStore.isLoading" class="text-center py-8">
                    <p class="text-gray-500">Lade Sets...</p>
                </div>

                <div v-else-if="setsStore.mySets.length === 0" class="text-center py-8">
                    <div class="text-6xl mb-3">📚</div>
                    <h3 class="font-bold text-gray-800 mb-2">Noch keine eigenen Sets</h3>
                    <p class="text-sm text-gray-600 mb-4">Erstelle dein erstes Lernset!</p>
                </div>

                <div v-else v-for="set in setsStore.mySets" :key="set.id" @click="openSet(set.id)"
                    class="bg-white rounded-xl p-4 shadow-sm active:scale-98 transition cursor-pointer">
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex-1">
                            <h3 class="font-bold text-gray-800 mb-1">{{ set.title }}</h3>
                            <p class="text-sm text-gray-600">{{ set.cards }} Karten</p>
                        </div>
                        <div
                            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xl">
                            {{ set.icon }}
                        </div>
                    </div>
                    <div class="flex items-center justify-between text-xs text-gray-500">
                        <span>Erstellt: {{ new Date(set.createdAt || '').toLocaleDateString('de-DE') }}</span>
                        <button @click.stop="deleteSet(set.id)" class="text-red-500 hover:text-red-700">Löschen</button>
                    </div>
                </div>

                <button @click="createNewSet"
                    class="w-full bg-[#4255FF] text-white font-semibold py-4 rounded-xl active:scale-98 transition mt-4">
                    + Neues Set erstellen
                </button>
            </div>
            <div v-if="activeTab === 'favorites'" class="space-y-3">
                <div v-for="fav in favorites" :key="fav.id" @click="openSet(fav.id)"
                    class="bg-white rounded-xl p-4 shadow-sm active:scale-98 transition cursor-pointer">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <h3 class="font-bold text-gray-800 mb-1">{{ fav.title }}</h3>
                            <p class="text-sm text-gray-600 mb-2">{{ fav.cards }} Karten</p>
                            <div class="flex items-center gap-2">
                                <img :src="fav.avatar" class="w-5 h-5 rounded-full" alt="avatar" />
                                <span class="text-xs text-gray-500">{{ fav.author }}</span>
                            </div>
                        </div>
                        <button @click.stop="toggleFavorite(fav.id)" class="text-yellow-500">
                            ⭐
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="activeTab === 'recent'" class="space-y-3">
                <div v-for="recent in recentSets" :key="recent.id" @click="openSet(recent.id)"
                    class="bg-white rounded-xl p-4 shadow-sm active:scale-98 transition cursor-pointer">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <h3 class="font-bold text-gray-800 mb-1">{{ recent.title }}</h3>
                            <p class="text-sm text-gray-600 mb-2">{{ recent.cards }} Karten</p>
                            <span class="text-xs text-gray-500">{{ recent.accessedAt }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <BottomNavigation />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavigation from '@/components/BottomNavigation.vue'
import { useSetsStore } from '@/stores/sets'

const router = useRouter()
const setsStore = useSetsStore()
const activeTab = ref('mySets')

const tabs = ref([
    { name: 'mySets', label: 'Meine Sets' },
    { name: 'favorites', label: 'Favoriten' },
    { name: 'recent', label: 'Zuletzt verwendet' }
])

onMounted(async () => {
    await setsStore.fetchMySets()
})

const openSet = (id: string | number | undefined) => {
    if (id) {
        router.push(`/set/${id}`)
    }
}

const deleteSet = async (id: string | number | undefined) => {
    if (!id) return

    if (confirm('Möchtest du dieses Set wirklich löschen?')) {
        const success = await setsStore.deleteSet(id)
        if (success) {
            // Refresh the list
            await setsStore.fetchMySets(true)
        }
    }
}

const toggleFavorite = (id: number | string) => {
    console.log('Toggle favorite:', id)
}

const createNewSet = () => {
    router.push('/create')
}

interface FavoriteSet {
    id: number | string
    title: string
    cards: number
    avatar: string
    author: string
}

interface RecentSet {
    id: number | string
    title: string
    cards: number
    accessedAt: string
}

const favorites = ref<FavoriteSet[]>([])
const recentSets = ref<RecentSet[]>([])
</script>

<style scoped>
.safe-area-inset {
    padding-bottom: env(safe-area-inset-bottom);
}

.active\:scale-98:active {
    transform: scale(0.98);
}

header {
    padding-top: env(safe-area-inset-top);
}
</style>