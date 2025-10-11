<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <main class="flex-1 overflow-y-auto pb-20">
            <Header></Header>
            <section class="px-3 pt-3 pb-4">
                <div class="space-y-2">
                    <div class="grid grid-cols-2 gap-2">
                        <StreakCard></StreakCard>
                        <GoalsCard></GoalsCard>
                    </div>
                    <CoinsCard></CoinsCard>
                </div>
            </section>
            <section class="py-5">
                <div class="flex items-center justify-between mb-4 px-3">
                    <h2 class="text-xl font-bold text-gray-800">{{ $t('library.mySets') }}</h2>
                    <button v-if="setsStore.mySets.length > 0" @click="router.push('/library')"
                        class="text-primary text-sm font-semibold">{{ $t('common.viewAll') }}</button>
                </div>
                <div v-if="setsStore.mySets.length === 0" class="px-3">
                    <div class="bg-white rounded-xl p-6 shadow-sm text-center">
                        <div class="mx-auto w-16 h-16 mb-3 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-full h-full">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                            </svg>
                        </div>
                        <h3 class="font-bold text-gray-800 mb-2">{{ $t('library.noSets') }}</h3>
                        <p class="text-sm text-gray-600 mb-4">{{ $t('library.noSetsDescription') }}</p>
                        <button @click="openCreateView"
                            class="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold active:scale-95 transition">
                            {{ $t('library.createNewSet') }}
                        </button>
                    </div>
                </div>
                <div v-else class="overflow-x-auto scrollbar-hide">
                    <div class="px-3">
                        <div v-for="set in setsStore.mySets" :key="set.id" @click="openSet(set.id)"
                            class="bg-white rounded-xl shadow-sm active:scale-98 transition cursor-pointer overflow-hidden mb-3">
                            <div class="flex items-stretch">
                                <div class="flex-1 p-4">
                                    <h3 class="font-bold text-gray-800 mb-1">{{ set.title }}</h3>
                                    <p class="text-sm text-gray-600 mb-2">{{ set.cards }} {{ $t('common.cards') }}</p>
                                    <div class="flex items-center gap-2">
                                        <div class="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                                            <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <span class="text-xs text-gray-500">{{ set.author }}</span>
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
                        </div>
                    </div>
                </div>
            </section>
            <section class="py-5">
                <div class="flex items-center justify-between mb-4 px-3">
                    <h2 class="text-xl font-bold text-gray-800">{{ $t('home.expertSets') }}</h2>
                    <button @click="router.push('/expert-sets')" class="text-primary text-sm font-semibold">{{
                        $t('common.viewAll') }}</button>
                </div>

                <div class="overflow-x-auto scrollbar-hide">
                    <div class="flex gap-3 px-3 pb-2">
                        <div v-for="set in setsStore.expertSets" :key="set.id" @click="openSet(set.id)"
                            class="bg-white rounded-xl shadow-sm active:scale-98 transition cursor-pointer flex-shrink-0 w-72 overflow-hidden">
                            <div class="flex items-stretch">
                                <div class="flex-1 p-4">
                                    <h3 class="font-bold text-gray-800 mb-1">{{ set.title }}</h3>
                                    <p class="text-sm text-gray-600 mb-2">{{ set.cards }} {{ $t('common.cards') }}</p>
                                    <div class="flex items-center gap-2">
                                        <div class="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                                            <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <span class="text-xs text-gray-500">{{ set.author }}</span>
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
                        </div>
                    </div>
                </div>
            </section>
            <section class="px-3 py-5">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-gray-800">{{ $t('home.achievements') }}</h2>
                    <button @click="router.push('/achievements')" class="text-primary text-sm font-semibold">{{
                        $t('common.viewAll') }}</button>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div v-for="achievement in displayedAchievements" :key="achievement.id" :class="[
                        'rounded-xl p-4 shadow-sm text-center transition',
                        achievement.unlocked
                            ? 'bg-white'
                            : 'bg-gray-100 opacity-60'
                    ]">
                        <div :class="[
                            'text-5xl mb-2 transition',
                            !achievement.unlocked && 'grayscale opacity-40'
                        ]">
                            {{ achievement.icon }}
                        </div>
                        <h3 :class="[
                            'font-bold text-sm mb-1',
                            achievement.unlocked ? 'text-gray-800' : 'text-gray-400'
                        ]">
                            {{ achievement.name }}
                        </h3>
                        <p :class="[
                            'text-xs',
                            achievement.unlocked ? 'text-gray-500' : 'text-gray-400'
                        ]">
                            {{ achievement.description }}
                        </p>
                        <div v-if="achievement.unlocked && achievement.unlockedAt" class="mt-2">
                            <span class="text-xs text-green-600 font-medium">✓ {{ $t('achievements.unlocked') }}</span>
                        </div>
                        <div v-else class="mt-2">
                            <span class="text-xs text-gray-400">{{ $t('achievements.locked') }}</span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        <BottomNavigation />
    </div>
</template>

<script lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavigation from '@/components/BottomNavigation.vue'
import Header from '@/components/home/Header.vue'
import { useSetsStore } from '@/stores/sets'
import { useStreakStore } from '@/stores/streak'
import { useAchievementsStore } from '@/stores/achievements'
import { useGoalsStore } from '@/stores/goals'
import { useUserStore } from '@/stores/user'
import StreakCard from '@/components/cards/StreakCard.vue'
import GoalsCard from '@/components/cards/GoalsCard.vue'
import CoinsCard from '@/components/cards/CoinsCard.vue'

export default {
    name: 'Dashboard',
    components: { BottomNavigation, Header, StreakCard, GoalsCard, CoinsCard },
    setup() {
        const router = useRouter()
        const setsStore = useSetsStore()
        const streakStore = useStreakStore()
        const achievementsStore = useAchievementsStore()
        const goalsStore = useGoalsStore()
        const userStore = useUserStore()

        onMounted(async () => {
            await setsStore.fetchMySets()
            await setsStore.fetchExpertSets()
            await streakStore.checkStreak()
            await goalsStore.loadGoals()
            await userStore.loadFromStorage()
            await achievementsStore.loadFromStorage()
            await achievementsStore.checkAndUnlockAchievements()
        })

        const displayedAchievements = computed(() => {
            const unlocked = achievementsStore.unlockedAchievements.slice(0, 4)
            const locked = achievementsStore.lockedAchievements.slice(0, 4 - unlocked.length)
            return [...unlocked, ...locked]
        })

        const openSet = async (id: string | number | undefined) => {
            if (id) {
                let set = setsStore.mySets.find(s => s.id === id) ||
                    setsStore.expertSets.find(s => s.id === id)

                if (set) {
                    const cardCount = typeof set.cards === 'number' ? set.cards : set.cards.length
                    await setsStore.markAsRecent(id, set.title, cardCount)
                }

                router.push(`/set/${id}`)
            }
        }

        const openCreateView = () => {
            router.push('/create')
        }

        const isUrl = (str: string) => {
            return str && (str.startsWith('http://') || str.startsWith('https://'))
        }

        return {
            router,
            setsStore,
            streakStore,
            achievementsStore,
            goalsStore,
            userStore,
            displayedAchievements,
            openSet,
            openCreateView,
            isUrl,
        }
    }
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

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.grayscale {
    filter: grayscale(100%);
}
</style>
