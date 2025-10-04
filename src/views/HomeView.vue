<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <Header></Header>
        <main class="flex-1 overflow-y-auto pb-20">
            <section class="py-5">
                <div class="flex items-center justify-between mb-4 px-4">
                    <h2 class="text-lg font-bold text-gray-800">My sets</h2>
                    <button v-if="setsStore.mySets.length > 0" class="text-[#4255FF] text-sm font-semibold">View
                        all</button>
                </div>
                <div v-if="setsStore.mySets.length === 0" class="px-4">
                    <div class="bg-white rounded-xl p-6 shadow-sm text-center">
                        <div class="text-6xl mb-3">📚</div>
                        <h3 class="font-bold text-gray-800 mb-2">Noch keine eigenen Sets</h3>
                        <p class="text-sm text-gray-600 mb-4">Erstelle dein erstes Lernset und beginne zu lernen!</p>
                        <button @click="openCreateView"
                            class="bg-[#4255FF] text-white px-6 py-2.5 rounded-lg font-semibold active:scale-95 transition">
                            Erstes Set erstellen
                        </button>
                    </div>
                </div>
                <div v-else class="overflow-x-auto scrollbar-hide">
                    <div class="flex gap-3 px-4">
                        <div v-for="set in setsStore.mySets" :key="set.id" @click="openSet(set.id)"
                            class="bg-white rounded-xl p-4 shadow-sm active:scale-98 transition cursor-pointer flex-shrink-0 w-72">
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
                </div>
            </section>
            <section class="py-5">
                <div class="flex items-center justify-between mb-4 px-4">
                    <h2 class="text-lg font-bold text-gray-800">Expert sets</h2>
                    <button class="text-[#4255FF] text-sm font-semibold">View all</button>
                </div>

                <div class="overflow-x-auto scrollbar-hide">
                    <div class="flex gap-3 px-4 pb-2">
                        <div v-for="set in setsStore.expertSets" :key="set.id" @click="openSet(set.id)"
                            class="bg-white rounded-xl p-4 shadow-sm active:scale-98 transition cursor-pointer flex-shrink-0 w-72">
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
                </div>
                <div class="overflow-x-auto scrollbar-hide">
                    <div class="flex gap-3 px-4">
                        <div v-for="set in setsStore.expertSets" :key="set.id" @click="openSet(set.id)"
                            class="bg-white rounded-xl p-4 shadow-sm active:scale-98 transition cursor-pointer flex-shrink-0 w-72">
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
                </div>
            </section>
            <section class="px-4 py-5">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-bold text-gray-800">Achievements</h2>
                    <button class="text-[#4255FF] text-sm font-semibold">View all</button>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-white rounded-xl p-4 shadow-sm text-center">
                        <div class="text-5xl mb-2">🎖️</div>
                        <h3 class="font-bold text-gray-800 text-sm mb-1">{{ streakStore.currentStreak }}-day streak</h3>
                        <p class="text-xs text-gray-500">
                            {{ streakStore.currentStreak > 0
                                ? `Du warst ${streakStore.currentStreak} Tage am Stück fleißig!`
                                : 'Starte deine Lernreihe heute!' }}
                        </p>
                    </div>
                    <div class="bg-white rounded-xl p-4 shadow-sm text-center">
                        <div class="text-5xl mb-2">🎮</div>
                        <h3 class="font-bold text-gray-800 text-sm mb-1">Active learner</h3>
                        <p class="text-xs text-gray-500">100 Karten diese Woche gemeistert</p>
                    </div>
                </div>
            </section>
        </main>

        <BottomNavigation />
    </div>
</template>

<script lang="ts">
import { getCurrentInstance, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavigation from '@/components/BottomNavigation.vue'
import Header from '@/components/home/Header.vue'
import { useSetsStore } from '@/stores/sets'
import { useStreakStore } from '@/stores/streak'

export default {
    name: 'Dashboard',
    components: { BottomNavigation, Header },
    setup() {
        const instance = getCurrentInstance()
        const $axios = instance?.appContext.config.globalProperties.$axios
        const router = useRouter()
        const setsStore = useSetsStore()
        const streakStore = useStreakStore()

        const studyStreak = ref(7)
        const expertSets = ref([] as Array<{ id: number; title: string; cards: number; author: string; avatar: string; icon: string }>)

        onMounted(() => {
            setsStore.fetchMySets($axios)
            setsStore.fetchExpertSets($axios)
            streakStore.checkStreak()
        })

        const openSet = (id: number) => {
            router.push(`/set/${id}`)
        }

        const openCreateView = () => {
            router.push('/create')
        }

        return {
            studyStreak,
            expertSets,
            setsStore,
            streakStore,
            openSet,
            openCreateView,
            router
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
</style>
