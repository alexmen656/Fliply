<template>
    <div class="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <!-- Header -->
        <header class="bg-white shadow-md px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div
                    class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-xl font-bold text-gray-800">Fliply</h1>
                    <p class="text-xs text-gray-500">Deine Karteikarten</p>
                </div>
            </div>
            <button
                class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 active:scale-95 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </button>
        </header>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto px-6 py-6 pb-24">
            <!-- Stats Overview -->
            <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-white rounded-2xl p-4 shadow-sm">
                    <div class="text-3xl font-bold text-blue-600">{{ totalCards }}</div>
                    <div class="text-sm text-gray-600 mt-1">Karten gesamt</div>
                </div>
                <div class="bg-white rounded-2xl p-4 shadow-sm">
                    <div class="text-3xl font-bold text-green-600">{{ studiedToday }}</div>
                    <div class="text-sm text-gray-600 mt-1">Heute gelernt</div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-3">Schnellzugriff</h2>
                <div class="grid grid-cols-2 gap-3">
                    <button
                        class="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg active:scale-95 transition flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span class="font-semibold">Neue Karte</span>
                    </button>
                    <button
                        class="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl p-6 shadow-lg active:scale-95 transition flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span class="font-semibold">Lernen</span>
                    </button>
                </div>
            </div>

            <!-- Recent Decks -->
            <div>
                <h2 class="text-lg font-semibold text-gray-800 mb-3">Deine Stapel</h2>
                <div class="space-y-3">
                    <div v-for="deck in recentDecks" :key="deck.id"
                        class="bg-white rounded-2xl p-4 shadow-sm active:scale-98 transition cursor-pointer">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                    :style="{ backgroundColor: deck.color + '20' }">
                                    {{ deck.emoji }}
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-800">{{ deck.name }}</h3>
                                    <p class="text-sm text-gray-500">{{ deck.cards }} Karten</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-sm font-medium text-blue-600">{{ deck.progress }}%</div>
                                <div class="w-16 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                                    <div class="h-full bg-blue-500 rounded-full transition-all"
                                        :style="{ width: deck.progress + '%' }"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Bottom Navigation Bar -->
        <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 safe-area-inset-bottom">
            <div class="flex items-center justify-around">
                <button v-for="item in navItems" :key="item.name" :class="[
                    'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition',
                    item.active ? 'text-blue-600' : 'text-gray-400'
                ]" @click="setActive(item.name)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                        :fill="item.active ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
                    </svg>
                    <span class="text-xs font-medium">{{ item.label }}</span>
                </button>
            </div>
        </nav>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Stats
const totalCards = ref(247)
const studiedToday = ref(32)

// Decks data
const recentDecks = ref([
    {
        id: 1,
        name: 'Englisch Vokabeln',
        emoji: '🇬🇧',
        cards: 156,
        progress: 68,
        color: '#3B82F6'
    },
    {
        id: 2,
        name: 'Mathematik',
        emoji: '🔢',
        cards: 89,
        progress: 45,
        color: '#10B981'
    },
    {
        id: 3,
        name: 'Geschichte',
        emoji: '📚',
        cards: 124,
        progress: 82,
        color: '#F59E0B'
    },
    {
        id: 4,
        name: 'Biologie',
        emoji: '🧬',
        cards: 67,
        progress: 34,
        color: '#8B5CF6'
    }
])

// Navigation items
const navItems = ref([
    {
        name: 'home',
        label: 'Start',
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        active: true
    },
    {
        name: 'decks',
        label: 'Stapel',
        icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
        active: false
    },
    {
        name: 'stats',
        label: 'Statistik',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        active: false
    },
    {
        name: 'settings',
        label: 'Mehr',
        icon: 'M4 6h16M4 12h16M4 18h16',
        active: false
    }
])

const setActive = (name: string) => {
    navItems.value.forEach(item => {
        item.active = item.name === name
    })
}
</script>

<style scoped>
.safe-area-inset-bottom {
    padding-bottom: env(safe-area-inset-bottom);
}

.active\:scale-98:active {
    transform: scale(0.98);
}

.active\:scale-95:active {
    transform: scale(0.95);
}
</style>
