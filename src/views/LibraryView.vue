<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-3 py-4">
            <div class="flex items-center justify-between mb-4">
                <h1 class="text-2xl font-bold text-gray-800">{{ $t('library.title') }}</h1>
            </div>
            <div class="relative mb-4">
                <input ref="searchInput" v-model="searchQuery" @input="handleSearch" type="text"
                    :placeholder="$t('home.searchPlaceholder')"
                    class="w-full bg-gray-50 rounded-lg px-4 py-3 pr-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                <svg v-if="searchQuery.length === 0"
                    class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <button v-else @click="clearSearch"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
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
        <main class="flex-1 overflow-y-auto pb-20 px-3 py-5">
            <div v-if="searchQuery.length > 0" class="space-y-3 mb-6">
                <div class="flex items-center justify-between mb-3">
                    <h2 class="text-lg font-semibold text-gray-800">
                        {{ $t('library.searchResults') }} ({{ filteredResults.length }})
                    </h2>
                </div>
                <div v-if="isSearching" class="text-center py-8">
                    <p class="text-gray-500">{{ $t('common.loading') }}</p>
                </div>
                <div v-else-if="filteredResults.length === 0" class="text-center py-8">
                    <div class="mx-auto w-16 h-16 mb-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-full h-full">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                    <h3 class="font-bold text-gray-800 mb-2">{{ $t('allCards.noCards') }}</h3>
                    <p class="text-sm text-gray-600">{{ $t('library.tryDifferentSearch') }}</p>
                </div>
                <SetCard v-else v-for="set in filteredResults" :key="set.id" :set="set" @click="openSet" />
            </div>
            <div v-else-if="activeTab === 'mySets'" class="space-y-3">
                <div v-if="setsStore.isLoading" class="text-center py-8">
                    <p class="text-gray-500">{{ $t('common.loading') }}</p>
                </div>
                <div v-else-if="setsStore.mySets.length === 0" class="text-center py-8">
                    <div class="mx-auto w-16 h-16 mb-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-full h-full">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                        </svg>
                    </div>
                    <h3 class="font-bold text-gray-800 mb-2">{{ $t('library.noSets') }}</h3>
                    <p class="text-sm text-gray-600 mb-4">{{ $t('library.noSetsDescription') }}</p>
                </div>
                <div v-else>
                    <SetCard v-for="set in setsStore.mySets" :key="set.id" :set="set" :show-delete="true"
                        @click="openSet" @delete="deleteSet" />

                    <button @click="createNewSet"
                        class="w-full bg-primary text-white font-semibold py-4 rounded-xl active:scale-98 transition mt-4">
                        + {{ $t('library.createNewSet') }}
                    </button>
                </div>
            </div>
            <div v-else-if="activeTab === 'expertSets'" class="space-y-3">
                <div v-if="setsStore.isLoading" class="text-center py-8">
                    <p class="text-gray-500">{{ $t('common.loading') }}</p>
                </div>
                <div v-else-if="setsStore.expertSets.length === 0" class="text-center py-8">
                    <div class="mx-auto w-16 h-16 mb-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-full h-full">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                    </div>
                    <h3 class="font-bold text-gray-800 mb-2">{{ $t('home.noExpertSets') }}</h3>
                    <p class="text-sm text-gray-600">{{ $t('home.checkBackLater') }}</p>
                </div>
                <SetCard v-else v-for="set in setsStore.expertSets" :key="set.id" :set="set" @click="openSet" />
            </div>
            <div v-else-if="activeTab === 'favorites'" class="space-y-3">
                <div v-if="setsStore.isLoading" class="text-center py-8">
                    <p class="text-gray-500">{{ $t('common.loading') }}</p>
                </div>
                <div v-else-if="setsStore.favoriteSets.length === 0" class="text-center py-8">
                    <div class="mx-auto w-16 h-16 mb-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-full h-full">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                    </div>
                    <h3 class="font-bold text-gray-800 mb-2">{{ $t('library.noFavorites') }}</h3>
                    <p class="text-sm text-gray-600 mb-4">{{ $t('library.noFavoritesDescription') }}</p>
                </div>
                <SetCard v-else v-for="fav in setsStore.favoriteSets" :key="fav.id" :set="fav" :show-favorite="true"
                    :is-favorite="true" @click="openSet" @toggle-favorite="toggleFavorite" />
            </div>
            <div v-else-if="activeTab === 'recent'" class="space-y-3">
                <div v-if="setsStore.isLoading" class="text-center py-8">
                    <p class="text-gray-500">{{ $t('common.loading') }}</p>
                </div>
                <div v-else-if="recentSetsWithDetails.length === 0" class="text-center py-8">
                    <div class="mx-auto w-16 h-16 mb-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-full h-full">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <h3 class="font-bold text-gray-800 mb-2">{{ $t('library.noRecent') }}</h3>
                    <p class="text-sm text-gray-600 mb-4">{{ $t('library.noRecentDescription') }}</p>
                </div>
                <SetCard v-else v-for="recent in recentSetsWithDetails" :key="recent.id" :set="recent" :show-date="true"
                    @click="openSet" />
            </div>
        </main>
        <BottomNavigation />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BottomNavigation from '@/components/BottomNavigation.vue'
import SetCard from '@/components/cards/SetCard.vue'
import { useSetsStore } from '@/stores/sets'

const { t } = useI18n()
const router = useRouter()
const setsStore = useSetsStore()
const activeTab = ref('mySets')
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const isSearching = ref(false)
const recentSetsWithDetails = ref<any[]>([])

const tabs = computed(() => [
    { name: 'mySets', label: t('library.mySets') },
    { name: 'expertSets', label: t('home.expertSets') },
    { name: 'favorites', label: t('library.favorites') },
    { name: 'recent', label: t('library.recentlyViewed') }
])

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const allSets = computed(() => {
    return [
        ...setsStore.mySets.map(set => ({
            id: set.id!,
            title: set.title,
            cards: typeof set.cards === 'number' ? set.cards : set.cards.length,
            author: set.author,
            icon: set.icon
        })),
        ...setsStore.expertSets.map(set => ({
            id: set.id!,
            title: set.title,
            cards: typeof set.cards === 'number' ? set.cards : set.cards.length,
            author: set.author,
            icon: set.icon
        }))
    ]
})

const filteredResults = computed(() => {
    if (!searchQuery.value.trim()) return []

    const query = searchQuery.value.toLowerCase()
    return allSets.value.filter(set =>
        set.title.toLowerCase().includes(query) ||
        set.author.toLowerCase().includes(query)
    )
})

const handleSearch = () => {
    if (searchTimeout) clearTimeout(searchTimeout)

    isSearching.value = true
    searchTimeout = setTimeout(() => {
        isSearching.value = false
    }, 300)
}

const clearSearch = () => {
    searchQuery.value = ''
}

onMounted(async () => {
    await setsStore.fetchMySets()
    await setsStore.fetchExpertSets()
    await setsStore.loadFavorites()
    await loadRecentSets()
})

const loadRecentSets = async () => {
    recentSetsWithDetails.value = await setsStore.getRecentSetsWithDetails()
}

const openSet = async (id: string | number | undefined) => {
    if (id) {
        let set = setsStore.mySets.find(s => s.id === id) ||
            setsStore.expertSets.find(s => s.id === id) ||
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

    if (confirm(t('library.confirmDelete'))) {
        const success = await setsStore.deleteSet(id)
        if (success) {
            await setsStore.fetchMySets(true)
        }
    }
}

const toggleFavorite = async (id: number | string) => {
    await setsStore.toggleFavorite(id)
}

const createNewSet = () => {
    router.push('/create')
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