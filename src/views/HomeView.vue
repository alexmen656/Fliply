<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <Header></Header>
        <main class="flex-1 overflow-y-auto pb-20">
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

        <BottomNavigation />
    </div>
</template>

<script lang="ts">
import { getCurrentInstance, ref } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavigation from '@/components/BottomNavigation.vue'
import Header from '@/components/home/Header.vue'

export default {
    name: 'Dashboard',
    components: { BottomNavigation, Header },
    setup() {
        const instance = getCurrentInstance()
        const $axios = instance?.appContext.config.globalProperties.$axios
        const router = useRouter()

        const studyStreak = ref(7)
        const expertSets = ref([] as Array<{ id: number; title: string; cards: number; author: string; avatar: string; icon: string }>)

        $axios.get('/api/expert-sets').then((response: any) => {
            expertSets.value = response.data
        })

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

        const openSet = (id: number) => {
            router.push(`/set/${id}`)
        }

        return {
            studyStreak,
            expertSets,
            achievements,
            openSet
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
</style>
