<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <!-- Header with Blue Background -->
        <header class="bg-[#4255FF] px-4 pt-3 pb-4">
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                    <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                    </svg>
                    <span class="text-white text-xl font-bold">Fliply</span>
                </div>
                <button class="text-white p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </button>
            </div>

            <!-- Search Bar -->
            <div class="relative">
                <input type="text" placeholder="Suche Lernsets, Lehrbücher..."
                    class="w-full bg-white rounded-lg px-4 py-3 pr-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                <svg class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto pb-20">
            <!-- Expert Sets Section -->
            <section class="px-4 py-5">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-bold text-gray-800">Expert sets</h2>
                    <button class="text-[#4255FF] text-sm font-semibold">View all</button>
                </div>

                <div class="space-y-3">
                    <div v-for="set in expertSets" :key="set.id" @click="openSet(set.id)"
                        class="bg-white rounded-xl p-4 shadow-sm active:scale-98 transition cursor-pointer">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <h3 class="font-bold text-gray-800 mb-1">{{ set.title }}</h3>
                                <p class="text-sm text-gray-600 mb-2">{{ set.cards }} Karten</p>
                                <div class="flex items-center gap-2">
                                    <img :src="set.avatar" class="w-5 h-5 rounded-full" alt="avatar" />
                                    <span class="text-xs text-gray-500">{{ set.author }}</span>
                                </div>
                            </div>
                            <div
                                class="w-16 h-20 bg-[#4255FF] rounded-lg flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                                {{ set.icon }}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Achievements Section -->
            <section class="px-4 py-5">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-bold text-gray-800">Achievements</h2>
                    <button class="text-[#4255FF] text-sm font-semibold">View all</button>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div v-for="achievement in achievements" :key="achievement.id"
                        class="bg-white rounded-xl p-4 shadow-sm text-center">
                        <div class="text-5xl mb-2">{{ achievement.icon }}</div>
                        <h3 class="font-bold text-gray-800 text-sm mb-1">{{ achievement.title }}</h3>
                        <p class="text-xs text-gray-500">{{ achievement.description }}</p>
                    </div>
                </div>
            </section>
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

const studyStreak = ref(7)

const expertSets = ref([
    {
        id: 1,
        title: 'Exercise 1&2',
        cards: 62,
        author: 'Expert teacher',
        icon: '📚',
        avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
        id: 2,
        title: 'Deutsch Vokabeln A2',
        cards: 124,
        author: 'Maria Schmidt',
        icon: '🇩🇪',
        avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
        id: 3,
        title: 'Geschichte: Mittelalter',
        cards: 89,
        author: 'Prof. Weber',
        icon: '🏰',
        avatar: 'https://i.pravatar.cc/150?img=3'
    }
])

const achievements = ref([
    {
        id: 1,
        icon: '🎖️',
        title: '7-day streak',
        description: 'Du warst 7 Tage am Stück fleißig!'
    },
    {
        id: 2,
        icon: '🎮',
        title: 'Active learner',
        description: '100 Karten diese Woche gemeistert'
    }
])

const navItems = ref([
    {
        name: 'home',
        label: 'Start',
        active: true,
        iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
        name: 'library',
        label: 'Bibliothek',
        active: false,
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
    navItems.value.forEach(item => {
        item.active = item.name === name
    })

    if (name === 'library') {
        router.push('/library')
    } else if (name === 'add') {
        router.push('/create')
    } else if (name === 'profile') {
        router.push('/profile')
    } else {
        router.push('/home')
    }
}

const openSet = (id: number) => {
    router.push(`/set/${id}`)
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
