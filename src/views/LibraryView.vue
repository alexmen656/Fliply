<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <!-- Header -->
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

            <!-- Tab Navigation -->
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

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto pb-20 px-4 py-5">
            <!-- My Sets -->
            <div v-if="activeTab === 'mySets'" class="space-y-3">
                <div v-for="set in mySets" :key="set.id" @click="openSet(set.id)"
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
                        <span>Zuletzt bearbeitet: {{ set.lastEdited }}</span>
                        <button @click.stop="deleteSet(set.id)" class="text-red-500">Löschen</button>
                    </div>
                </div>

                <button
                    class="w-full bg-[#4255FF] text-white font-semibold py-4 rounded-xl active:scale-98 transition mt-4">
                    + Neues Set erstellen
                </button>
            </div>

            <!-- Favorites -->
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

            <!-- Recent -->
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

        <!-- Bottom Navigation -->
        <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset">
            <div class="flex items-center justify-around px-2 py-2">
                <button v-for="item in navItems" :key="item.name" :class="[
                    'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition flex-1',
                    item.active ? 'text-[#4255FF]' : 'text-gray-400'
                ]" @click="navigate(item.name)">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.iconPath" />
                    </svg>
                    <span class="text-xs font-medium">{{ item.label }}</span>
                </button>
            </div>
        </nav>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeTab = ref('mySets')

const tabs = ref([
    { name: 'mySets', label: 'Meine Sets' },
    { name: 'favorites', label: 'Favoriten' },
    { name: 'recent', label: 'Zuletzt verwendet' }
])

const mySets = ref([
    {
        id: 1,
        title: 'Englisch Vokabeln',
        cards: 156,
        icon: '🇬🇧',
        lastEdited: '2 Tage'
    },
    {
        id: 2,
        title: 'Mathematik Formeln',
        cards: 89,
        icon: '🔢',
        lastEdited: '5 Tage'
    },
    {
        id: 3,
        title: 'Geschichte Daten',
        cards: 124,
        icon: '📚',
        lastEdited: '1 Woche'
    }
])

const favorites = ref([
    {
        id: 4,
        title: 'Deutsch B2 Prüfung',
        cards: 200,
        avatar: 'https://i.pravatar.cc/150?img=4',
        author: 'Anna Müller'
    }
])

const recentSets = ref([
    {
        id: 5,
        title: 'Biologie Zellen',
        cards: 67,
        accessedAt: 'Vor 2 Stunden'
    }
])

const navItems = ref([
    {
        name: 'home',
        label: 'Start',
        active: false,
        iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
        name: 'library',
        label: 'Bibliothek',
        active: true,
        iconPath: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
    },
    {
        name: 'add',
        label: 'Erstellen',
        active: false,
        iconPath: 'M12 4v16m8-8H4'
    },
    {
        name: 'profile',
        label: 'Profil',
        active: false,
        iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    }
])

const navigate = (name: string) => {
    if (name === 'home') {
        router.push('/home')
    } else if (name === 'library') {
        router.push('/library')
    } else if (name === 'add') {
        router.push('/create')
    } else if (name === 'profile') {
        router.push('/profile')
    }
}

const openSet = (id: number) => {
    router.push(`/set/${id}`)
}

const deleteSet = (id: number) => {
    console.log('Delete set:', id)
}

const toggleFavorite = (id: number) => {
    console.log('Toggle favorite:', id)
}
</script>

<style scoped>
.safe-area-inset {
    padding-bottom: env(safe-area-inset-bottom);
}

.active\:scale-98:active {
    transform: scale(0.98);
}
</style>
