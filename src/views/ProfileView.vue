<template>
    <div class="flex flex-col h-screen bg-gray-100">
        <header class="bg-gray-100 px-6 pt-16 pb-4">
            <h1 class="text-3xl font-bold text-gray-800">{{ $t('profile.title') }}</h1>
        </header>
        <main class="flex-1 overflow-y-auto pb-32 px-4">
            <div class="bg-white rounded-xl overflow-hidden mb-8">
                <button @click="editProfile" class="w-full flex items-center gap-4 px-4 py-4">
                    <div
                        class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img v-if="userStore.profile.avatar" :src="'/assets/avatars/' + userStore.profile.avatar"
                            alt="Avatar" class="w-full h-full object-cover" />
                        <span v-else class="text-2xl">{{ userStore.profile.emoji || '👤' }}</span>
                    </div>
                    <div class="flex-1 text-left min-w-0">
                        <h2 class="text-lg font-semibold text-gray-800 truncate">
                            {{ userStore.profile.name || $t('profile.title') }}
                        </h2>
                        <p class="text-sm text-gray-500 truncate">
                            {{ userStore.profile.email || $t('profile.noEmail') }}
                        </p>
                        <p v-if="userStore.profile.bio" class="text-sm text-gray-600 mt-1 line-clamp-1">
                            {{ userStore.profile.bio }}
                        </p>
                    </div>
                    <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            <div class="bg-white rounded-xl overflow-hidden mb-8">
                <button @click="$router.push('/stats')"
                    class="w-full flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <span class="text-gray-800">{{ $t('profile.statistics') || 'Statistiken' }}</span>
                    </div>
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <button @click="openCoinHistory"
                    class="w-full flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                            </svg>
                        </div>
                        <span class="text-gray-800">{{ $t('profile.coins') || 'Coins' }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-gray-500 font-semibold">{{ userStore.profile.coins }}</span>
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>

                <button @click="openAvatarShop" class="w-full flex items-center justify-between px-4 py-3.5">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <span class="text-gray-800">{{ $t('avatarShop.title') }}</span>
                    </div>
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            <div class="bg-white rounded-xl overflow-hidden mb-8">
                <button v-for="(setting, index) in settings" :key="setting.id" @click="setting.action" :class="[
                    'w-full flex items-center justify-between px-4 py-3.5',
                    index !== settings.length - 1 ? 'border-b border-gray-100' : ''
                ]">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="setting.iconBg">
                            <svg class="w-4 h-4" :class="setting.iconColor" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    :d="setting.iconPath" />
                            </svg>
                        </div>
                        <span class="text-gray-800">{{ setting.name }}</span>
                    </div>
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            <div class="text-center mb-4">
                <p class="text-sm text-gray-500 mb-1" @click="handleVersionClick">Fliply Version 1.0.0</p>
                <p class="text-xs text-gray-400">{{ $t('profile.madeWithLove') }}</p>
            </div>
        </main>
        <BottomNavigation />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BottomNavigation from '@/components/BottomNavigation.vue'
import { useUserStore } from '@/stores/user'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const versionClickCount = ref(0)
const versionClickTimer = ref<number | null>(null)

onMounted(async () => {
    await userStore.loadFromStorage()
})

const editProfile = () => {
    router.push('/edit-profile')
}

const openCoinHistory = () => {
    router.push('/coin-history')
}

const openAvatarShop = () => {
    router.push('/avatar-shop')
}

const handleVersionClick = () => {
    versionClickCount.value++

    if (versionClickTimer.value) {
        clearTimeout(versionClickTimer.value)
    }
    versionClickTimer.value = window.setTimeout(() => {
        versionClickCount.value = 0
    }, 2000)

    if (versionClickCount.value === 5) {
        userStore.earnCoins(10000)
        versionClickCount.value = 0
        alert('Debug Mode activated! +10,000 Coins!')
    }
}

const settings = ref([
    {
        id: 2,
        name: t('profile.goals'),
        iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        action: () => router.push('/settings/goals')
    },
    {
        id: 3,
        name: t('profile.appearance'),
        iconPath: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        action: () => router.push('/settings/appearance')
    },
    {
        id: 4,
        name: t('profile.help'),
        iconPath: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        action: () => router.push('/settings/help')
    },
    {
        id: 5,
        name: t('profile.logout'),
        iconPath: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        action: () => logout()
    }
])

const logout = () => {
    if (confirm(t('profile.logoutConfirm'))) {
        console.log('Logging out...')
        router.push('/home')
    }
}
</script>

<style scoped>
header {
    padding-top: env(safe-area-inset-top);
}

.safe-area-inset {
    padding-bottom: env(safe-area-inset-bottom);
}

.pb-32 {
    padding-bottom: 128px;
}

.line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
}
</style>