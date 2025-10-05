<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between mb-4">
                <button @click="$router.back()" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 class="text-xl font-bold text-gray-800">Expert Sets</h1>
                <div class="w-6"></div>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto pb-20 px-4 py-5">
            <div v-if="setsStore.isLoading" class="text-center py-8">
                <p class="text-gray-500">Lade Expert Sets...</p>
            </div>

            <div v-else-if="setsStore.expertSets.length === 0" class="text-center py-8">
                <div class="mx-auto w-16 h-16 mb-3 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-full h-full">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                    </svg>
                </div>
                <h3 class="font-bold text-gray-800 mb-2">Keine Expert Sets verfügbar</h3>
                <p class="text-sm text-gray-600 mb-4">Schau später wieder vorbei!</p>
            </div>

            <div v-else class="space-y-3">
                <div v-for="set in setsStore.expertSets" :key="set.id" @click="openSet(set.id)"
                    class="bg-white rounded-xl shadow-sm active:scale-98 transition cursor-pointer overflow-hidden">
                    <div class="flex items-stretch">
                        <div class="flex-1 p-4">
                            <h3 class="font-bold text-gray-800 mb-1">{{ set.title }}</h3>
                            <p class="text-sm text-gray-600 mb-2">{{ set.cards }} Karten</p>
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
        </main>

        <BottomNavigation />
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavigation from '@/components/BottomNavigation.vue'
import { useSetsStore } from '@/stores/sets'

const router = useRouter()
const setsStore = useSetsStore()

onMounted(async () => {
    await setsStore.fetchExpertSets()
})

const isUrl = (str: string) => {
    return str.startsWith('http://') || str.startsWith('https://')
}

const openSet = async (id: string | number | undefined) => {
    if (id) {
        const set = setsStore.expertSets.find(s => s.id === id)
        if (set) {
            const cardCount = typeof set.cards === 'number' ? set.cards : set.cards.length
            await setsStore.markAsRecent(id, set.title, cardCount)
        }
        router.push(`/set/${id}`)
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

header {
    padding-top: env(safe-area-inset-top);
}
</style>
