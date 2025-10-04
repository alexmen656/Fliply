<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-gradient-to-br from-[#4255FF] to-indigo-600 px-4 pt-8 pb-12">
            <div class="flex flex-col items-center">
                <button @click="editProfile"
                    class="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl mb-3 shadow-lg relative group">
                    👤
                    <div
                        class="absolute inset-0 bg-black bg-opacity-0 group-active:bg-opacity-10 rounded-full transition">
                    </div>
                </button>
                <h1 class="text-2xl font-bold text-white mb-1">Max Mustermann</h1>
                <p class="text-white opacity-90 text-sm">max@example.com</p>
                <button @click="editProfile" class="mt-2 text-white text-sm underline">Profil bearbeiten</button>
            </div>
        </header>

        <!-- Stats Cards -->
        <div class="px-4 -mt-8 mb-6">
            <div class="bg-white rounded-2xl p-4 shadow-lg">
                <div class="grid grid-cols-3 gap-4">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-[#4255FF]">{{ totalSets }}</div>
                        <div class="text-xs text-gray-600 mt-1">Sets</div>
                    </div>
                    <div class="text-center border-l border-r border-gray-200">
                        <div class="text-2xl font-bold text-green-600">{{ totalCards }}</div>
                        <div class="text-xs text-gray-600 mt-1">Karten</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-orange-600">{{ streakDays }}</div>
                        <div class="text-xs text-gray-600 mt-1">Tage Streak</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto pb-20 px-4">
            <!-- Achievement Section -->
            <section class="mb-6">
                <h2 class="text-lg font-bold text-gray-800 mb-3">Errungenschaften</h2>
                <div class="grid grid-cols-3 gap-3">
                    <div v-for="badge in badges" :key="badge.id" class="bg-white rounded-xl p-3 shadow-sm text-center">
                        <div class="text-3xl mb-1">{{ badge.icon }}</div>
                        <div class="text-xs font-medium text-gray-700">{{ badge.name }}</div>
                    </div>
                </div>
            </section>

            <!-- Settings Section -->
            <section class="mb-6">
                <h2 class="text-lg font-bold text-gray-800 mb-3">Einstellungen</h2>
                <div class="bg-white rounded-xl overflow-hidden shadow-sm">
                    <button v-for="(setting, index) in settings" :key="setting.id" @click="setting.action" :class="[
                        'w-full flex items-center justify-between px-4 py-4 active:bg-gray-50 transition',
                        index !== settings.length - 1 ? 'border-b border-gray-100' : ''
                    ]">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center"
                                :class="setting.iconBg">
                                <svg class="w-5 h-5" :class="setting.iconColor" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        :d="setting.iconPath" />
                                </svg>
                            </div>
                            <span class="font-medium text-gray-800">{{ setting.name }}</span>
                        </div>
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </section>

            <!-- About Section -->
            <section>
                <div class="bg-white rounded-xl p-4 shadow-sm text-center">
                    <p class="text-sm text-gray-600 mb-2">Fliply Version 1.0.0</p>
                    <p class="text-xs text-gray-500">Made with ❤️ for learners</p>
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

const totalSets = ref(12)
const totalCards = ref(347)
const streakDays = ref(7)

const badges = ref([
    { id: 1, icon: '🏆', name: 'Starter' },
    { id: 2, icon: '🔥', name: '7 Tage' },
    { id: 3, icon: '⭐', name: 'Top Lerner' },
    { id: 4, icon: '🎯', name: '100 Karten' },
    { id: 5, icon: '📚', name: 'Bücherw' },
    { id: 6, icon: '💪', name: 'Fleißig' }
])

const settings = ref([
    {
        id: 1,
        name: 'Benachrichtigungen',
        iconPath: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        action: () => router.push('/settings/notifications')
    },
    {
        id: 2,
        name: 'Lernziele',
        iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        action: () => router.push('/settings/goals')
    },
    {
        id: 3,
        name: 'Erscheinungsbild',
        iconPath: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        action: () => router.push('/settings/appearance')
    },
    {
        id: 4,
        name: 'Hilfe & Support',
        iconPath: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        action: () => router.push('/settings/help')
    },
    {
        id: 5,
        name: 'Abmelden',
        iconPath: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        action: () => logout()
    }
])

const editProfile = () => {
    router.push('/edit-profile')
}

const logout = () => {
    if (confirm('Möchtest du dich wirklich abmelden?')) {
        console.log('Logging out...')
        router.push('/home')
    }
}

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
        active: true,
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
</script>

<style scoped>
.safe-area-inset {
    padding-bottom: env(safe-area-inset-bottom);
}

.active\:bg-gray-50:active {
    background-color: rgb(249 250 251);
}
</style>
