<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header :class="['px-4 py-8 flex-shrink-0', currentBannerGradient]">
            <div class="flex items-start gap-4 mb-4">
                <button @click="editProfile"
                    class="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg relative group overflow-hidden flex-shrink-0">
                    <img v-if="userStore.profile.avatar" :src="userStore.profile.avatar" alt="Avatar"
                        class="w-full h-full object-cover rounded-full"
                        @error="(e) => (e.target as HTMLImageElement).style.display = 'none'" />
                    <div class="absolute inset-0 group-active:bg-opacity-10 rounded-full transition">
                    </div>
                </button>
                <div class="flex-1 pt-2">
                    <h1 class="text-2xl font-bold text-white mb-1">{{ userStore.profile.name || $t('profile.title') }}
                    </h1>
                    <p class="text-white opacity-90 text-sm">{{ userStore.profile.email || 'keine E-Mail' }}</p>
                </div>
            </div>
            <div class="flex gap-2">
                <button @click="openCoinHistory"
                    class="flex-1 bg-white text-primary px-4 py-3 rounded-xl font-semibold text-sm active:scale-95 transition flex items-center justify-center gap-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ userStore.profile.coins }}</span>
                </button>
                <button @click="openAvatarShop"
                    class="flex-1 bg-white text-primary px-4 py-3 rounded-xl font-semibold text-sm active:scale-95 transition flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>{{ $t('avatarShop.title') }}</span>
                </button>
            </div>
        </header>
        <div class="px-4 -mt-6 mb-6 flex-shrink-0">
            <div class="bg-white rounded-2xl p-4 shadow-lg">
                <div v-if="isLoadingStats" class="text-center py-4">
                    <p class="text-gray-500 text-sm">{{ $t('common.loading') }}</p>
                </div>
                <div v-else class="grid grid-cols-3 gap-4">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-primary">{{ totalSets }}</div>
                        <div class="text-xs text-gray-600 mt-1">Sets</div>
                    </div>
                    <div class="text-center border-l border-r border-gray-200">
                        <div class="text-2xl font-bold text-green-600">{{ totalCards }}</div>
                        <div class="text-xs text-gray-600 mt-1">{{ $t('common.cards') }}</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-orange-600">{{ streakDays }}</div>
                        <div class="text-xs text-gray-600 mt-1">{{ $t('home.streak') }}</div>
                    </div>
                </div>
            </div>
        </div>
        <main class="flex-1 overflow-y-auto pb-20 px-4">
            <section class="mb-6">
                <div class="flex items-center justify-between mb-3">
                    <h2 class="text-lg font-bold text-gray-800">{{ $t('profile.achievements') }}</h2>
                    <button @click="viewAllAchievements" class="text-primary text-sm font-semibold">
                        {{ $t('common.viewAll') }}
                    </button>
                </div>
                <div v-if="displayedAchievements.length === 0" class="bg-white rounded-xl p-6 text-center shadow-sm">
                    <p class="text-gray-500 text-sm">Noch keine Errungenschaften freigeschaltet.</p>
                    <p class="text-gray-400 text-xs mt-1 flex items-center justify-center gap-1">
                        <span>Lerne weiter, um Erfolge zu sammeln!</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </p>
                </div>
                <div v-else class="grid grid-cols-3 gap-3">
                    <div v-for="badge in displayedAchievements" :key="badge.id" :class="[
                        'rounded-xl p-3 shadow-sm text-center transition',
                        badge.unlocked
                            ? 'bg-white'
                            : 'bg-gray-100 opacity-60'
                    ]">
                        <div :class="[
                            'text-3xl mb-1',
                            !badge.unlocked && 'grayscale opacity-40'
                        ]">
                            {{ badge.icon }}
                        </div>
                        <div :class="[
                            'text-xs font-medium',
                            badge.unlocked ? 'text-gray-700' : 'text-gray-400'
                        ]">
                            {{ badge.name }}
                        </div>
                        <div v-if="badge.unlocked" class="mt-1">
                            <svg class="w-3 h-3 mx-auto text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div v-else class="mt-1">
                            <svg class="w-3 h-3 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>
            <section class="mb-6">
                <h2 class="text-lg font-bold text-gray-800 mb-3">{{ $t('profile.settings') }}</h2>
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
            <section>
                <div class="bg-white rounded-xl p-4 shadow-sm text-center">
                    <p class="text-sm text-gray-600 mb-2" @click="handleVersionClick">Fliply Version 1.0.0</p>
                    <p class="text-xs text-gray-500">Made with ❤️ for learners</p>
                </div>
            </section>
        </main>

        <BottomNavigation />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BottomNavigation from '@/components/BottomNavigation.vue'
import { useUserStore } from '@/stores/user'
import { useSetsStore } from '@/stores/sets'
import { useAchievementsStore } from '@/stores/achievements'
import { useBannersStore } from '@/stores/banners'
import { Preferences } from '@capacitor/preferences'
import axios from '@/axios'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const setsStore = useSetsStore()
const achievementsStore = useAchievementsStore()
const bannersStore = useBannersStore()

const versionClickCount = ref(0)
const versionClickTimer = ref<number | null>(null)

const currentBannerGradient = computed(() => {
    const banner = bannersStore.getCurrentBanner()
    return banner ? banner.gradient : 'bg-gradient-to-br from-[#4255FF] to-indigo-600'
})

const totalSets = computed(() => setsStore.mySets.length)
const totalCards = ref(0)
const streakDays = ref(0)
const isLoadingStats = ref(true)
const avatarLoaded = ref(false)

// Nur freigeschaltete und gesperrte Achievements anzeigen (max 3 pro Zeile)
const displayedAchievements = computed(() => {
    const unlocked = achievementsStore.unlockedAchievements
    const locked = achievementsStore.lockedAchievements

    // Berechne wie viele gesperrte wir brauchen um auf ein Vielfaches von 3 zu kommen
    const unlockedCount = unlocked.length
    const remainder = unlockedCount % 3
    const lockedNeeded = remainder === 0 ? 0 : 3 - remainder

    return [...unlocked, ...locked.slice(0, lockedNeeded)]
})

onMounted(async () => {
    isLoadingStats.value = true

    await userStore.loadFromStorage()
    await setsStore.fetchMySets()
    await bannersStore.loadFromStorage()

    try {
        const { value } = await Preferences.get({ key: 'fliply_total_cards' })
        if (value) {
            totalCards.value = parseInt(value, 10)
        } else {
            let cardCount = 0
            for (const set of setsStore.mySets) {
                cardCount += typeof set.cards === 'number' ? set.cards : (set.cards as any[]).length
            }
            totalCards.value = cardCount
            await Preferences.set({ key: 'fliply_total_cards', value: cardCount.toString() })
        }
    } catch (error) {
        console.error('Error loading total cards:', error)
    }

    if (userStore.profile.id) {
        try {
            const response = await axios.get(`/api/users/${userStore.profile.id}`)
            if (response.data.success) {
                streakDays.value = response.data.data.currentStreak || 0
            }
        } catch (error) {
            console.error('Error loading streak from API:', error)
            try {
                const { value } = await Preferences.get({ key: 'fliply_streak' })
                if (value) {
                    const streakData = JSON.parse(value)
                    streakDays.value = streakData.currentStreak || 0
                }
            } catch (e) {
                console.error('Error loading streak from preferences:', e)
            }
        }
    }

    await achievementsStore.loadFromStorage()
    await achievementsStore.checkAndUnlockAchievements()

    isLoadingStats.value = false
})

const updateTotalCards = async (count: number) => {
    totalCards.value = count
    await Preferences.set({ key: 'fliply_total_cards', value: count.toString() })
}

const viewAllAchievements = () => {
    router.push('/achievements')
}

const openCoinHistory = () => {
    router.push('/coin-history')
}

const handleVersionClick = () => {
    versionClickCount.value++

    // Reset nach 2 Sekunden
    if (versionClickTimer.value) {
        clearTimeout(versionClickTimer.value)
    }
    versionClickTimer.value = window.setTimeout(() => {
        versionClickCount.value = 0
    }, 2000)

    // Nach 5 Klicks -> 10000 Coins
    if (versionClickCount.value === 5) {
        userStore.earnCoins(10000)
        versionClickCount.value = 0
        // Visuelle Bestätigung
        alert('🎉 Debug Mode aktiviert! +10,000 Münzen!')
    }
}

const badges_old = ref([
    { id: 1, icon: '🏆', name: 'Starter' },
    { id: 2, icon: '🔥', name: '7 Tage' },
    { id: 3, icon: '⭐', name: 'Top Lerner' },
    { id: 4, icon: '🎯', name: '100 Karten' },
    { id: 5, icon: '📚', name: 'Bücher' },
    { id: 6, icon: '💪', name: 'Fleißig' }
])

const settings = ref([
    /*{
        id: 1,
        name: 'Benachrichtigungen',
        iconPath: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        action: () => router.push('/settings/notifications')
    },*/
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

const openAvatarShop = () => {
    router.push('/avatar-shop')
}

const logout = () => {
    if (confirm('Möchtest du dich wirklich abmelden?')) {
        console.log('Logging out...')
        router.push('/home')
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

header {
    padding-top: env(safe-area-inset-top);
}

.grayscale {
    filter: grayscale(100%);
}
</style>