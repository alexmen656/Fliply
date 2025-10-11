<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <main class="flex-1 overflow-y-auto pb-20">
            <Header />
            <StatsSection />
            <MySetsSection :sets="setsStore.mySets" @viewAll="router.push('/library')" @createNew="openCreateView"
                @openSet="openSet" />
            <ExpertSetsSection :sets="setsStore.expertSets" @viewAll="router.push('/expert-sets')" @openSet="openSet" />
            <AchievementsSection :achievements="displayedAchievements" @viewAll="router.push('/achievements')" />
        </main>
        <BottomNavigation />
    </div>
</template>

<script lang="ts">
import BottomNavigation from '@/components/BottomNavigation.vue'
import Header from '@/components/home/Header.vue'
import StatsSection from '@/components/home/StatsSection.vue'
import MySetsSection from '@/components/home/MySetsSection.vue'
import ExpertSetsSection from '@/components/home/ExpertSetsSection.vue'
import AchievementsSection from '@/components/home/AchievementsSection.vue'
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSetsStore } from '@/stores/sets'
import { useStreakStore } from '@/stores/streak'
import { useAchievementsStore } from '@/stores/achievements'
import { useGoalsStore } from '@/stores/goals'
import { useUserStore } from '@/stores/user'

export default {
    name: 'Dashboard',
    components: {
        BottomNavigation,
        Header,
        StatsSection,
        MySetsSection,
        ExpertSetsSection,
        AchievementsSection
    },
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
        }
    }
}
</script>

<style scoped>
.safe-area-inset {
    padding-bottom: env(safe-area-inset-bottom);
}
</style>