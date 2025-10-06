<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between mb-4">
                <h1 class="text-2xl font-bold text-gray-800">Bibliothek</h1>
                <!--<button class="text-primary p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                </button>-->
            </div>
            <div class="flex gap-4 border-b border-gray-200">
                <button v-for="tab in tabs" :key="tab.name" @click="activeTab = tab.name" :class="[
                    'pb-2 px-1 text-sm font-medium transition',
                    activeTab === tab.name
                        ? 'text-primary border-b-2 border-primary'
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
                    <div class="mx-auto w-16 h-16 mb-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-full h-full">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                        </svg>
                    </div>
                    <h3 class="font-bold text-gray-800 mb-2">Noch keine eigenen Sets</h3>
                    <p class="text-sm text-gray-600 mb-4">Erstelle dein erstes Lernset!</p>
                </div>

                <div v-else v-for="set in setsStore.mySets" :key="set.id" @click="openSet(set.id)"
                    class="bg-white rounded-xl shadow-sm active:scale-98 transition cursor-pointer overflow-hidden">
                    <div class="flex items-stretch">
                        <div class="flex-1 p-4">
                            <h3 class="font-bold text-gray-800 mb-1">{{ set.title }}</h3>
                            <p class="text-sm text-gray-600 mb-2">{{ set.cards }} Karten</p>
                            <div class="text-xs text-gray-500">
                                Erstellt: {{ new Date(set.createdAt || '').toLocaleDateString('de-DE') }}
                            </div>
                        </div>
                        <div v-if="set.icon && !isUrl(set.icon)"
                            class="w-20 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                            {{ set.icon }}
                        </div>
                        <div v-else-if="set.icon" class="w-20 flex-shrink-0">
                            <img :src="set.icon" alt="Set Icon" class="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div class="px-4 py-2 border-t border-gray-100">
                        <button @click.stop="deleteSet(set.id)"
                            class="text-red-500 hover:text-red-700 text-xs font-medium">
                            Löschen
                        </button>
                    </div>
                </div>

                <button @click="createNewSet"
                    class="w-full bg-primary text-white font-semibold py-4 rounded-xl active:scale-98 transition mt-4">
                    + Neues Set erstellen
                </button>
            </div>
            <div v-if="activeTab === 'favorites'" class="space-y-3">
                <div v-if="setsStore.isLoading" class="text-center py-8">
                    <p class="text-gray-500">Lade Favoriten...</p>
                </div>

                <div v-else-if="setsStore.favoriteSets.length === 0" class="text-center py-8">
                    <div class="mx-auto w-16 h-16 mb-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-full h-full">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                    </div>
                    <h3 class="font-bold text-gray-800 mb-2">Noch keine Favoriten</h3>
                    <p class="text-sm text-gray-600 mb-4">Markiere Sets als Favoriten!</p>
                </div>

                <div v-else v-for="fav in setsStore.favoriteSets" :key="fav.id" @click="openSet(fav.id)"
                    class="bg-white rounded-xl shadow-sm active:scale-98 transition cursor-pointer overflow-hidden">
                    <div class="flex items-stretch">
                        <div class="flex-1 p-4">
                            <h3 class="font-bold text-gray-800 mb-1">{{ fav.title }}</h3>
                            <p class="text-sm text-gray-600 mb-2">{{ fav.cards }} Karten</p>
                            <div class="flex items-center gap-2">
                                <div class="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                                    <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span class="text-xs text-gray-500">{{ fav.author }}</span>
                            </div>
                        </div>
                        <div class="flex items-center pr-4">
                            <button @click.stop="toggleFavorite(fav.id!)" class="text-yellow-500 text-2xl">
                                ⭐
                            </button>
                        </div>
                        <div v-if="fav.icon && !isUrl(fav.icon)"
                            class="w-20 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                            {{ fav.icon }}
                        </div>
                        <div v-else-if="fav.icon" class="w-20 flex-shrink-0">
                            <img :src="fav.icon" alt="Set Icon" class="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="activeTab === 'recent'" class="space-y-3">
                <div v-if="setsStore.isLoading" class="text-center py-8">
                    <p class="text-gray-500">Lade zuletzt verwendet...</p>
                </div>

                <div v-else-if="recentSetsWithDetails.length === 0" class="text-center py-8">
                    <div class="mx-auto w-16 h-16 mb-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-full h-full">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <h3 class="font-bold text-gray-800 mb-2">Noch keine Sets verwendet</h3>
                    <p class="text-sm text-gray-600 mb-4">Starte ein Set, um es hier zu sehen!</p>
                </div>

                <div v-else v-for="recent in recentSetsWithDetails" :key="recent.id" @click="openSet(recent.id)"
                    class="bg-white rounded-xl shadow-sm active:scale-98 transition cursor-pointer overflow-hidden">
                    <div class="flex items-stretch">
                        <div class="flex-1 p-4">
                            <h3 class="font-bold text-gray-800 mb-1">{{ recent.title }}</h3>
                            <p class="text-sm text-gray-600 mb-2">{{ recent.cards }} Karten</p>
                            <span class="text-xs text-gray-500">{{ formatDate(recent.accessedAt) }}</span>
                        </div>
                        <div v-if="recent.icon && !isUrl(recent.icon)"
                            class="w-20 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                            {{ recent.icon }}
                        </div>
                        <div v-else-if="recent.icon" class="w-20 flex-shrink-0">
                            <img :src="recent.icon" alt="Set Icon" class="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <BottomNavigation />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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

const recentSetsWithDetails = ref<any[]>([])

onMounted(async () => {
    await setsStore.fetchMySets()
    await setsStore.loadFavorites()
    await loadRecentSets()
})

const loadRecentSets = async () => {
    recentSetsWithDetails.value = await setsStore.getRecentSetsWithDetails()
}

const openSet = async (id: string | number | undefined) => {
    if (id) {
        // Hole Set-Details für markAsRecent
        let set = setsStore.mySets.find(s => s.id === id) ||
            setsStore.favoriteSets.find(s => s.id === id)

        if (!set) {
            set = await setsStore.getSetById(id)
        }

        if (set) {
            const cardCount = Array.isArray(set.cards) ? set.cards.length : (set.cards || 0)
            await setsStore.markAsRecent(id, set.title, cardCount)
        }

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

const toggleFavorite = async (id: number | string) => {
    await setsStore.toggleFavorite(id)
}

const isFavorite = (id: number | string) => {
    return setsStore.isFavorite(id)
}

const createNewSet = () => {
    router.push('/create')
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) {
        return 'Gerade eben'
    } else if (diffInMinutes < 60) {
        return `vor ${diffInMinutes} Min.`
    } else if (diffInHours < 24) {
        return `vor ${diffInHours} Std.`
    } else if (diffInDays === 1) {
        return 'Gestern'
    } else if (diffInDays < 7) {
        return `vor ${diffInDays} Tagen`
    } else {
        return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }
}

const isUrl = (str: string) => {
    return str && (str.startsWith('http://') || str.startsWith('https://'))
}
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