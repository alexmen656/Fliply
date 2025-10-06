<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between">
                <button @click="$router.back()" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 class="text-xl font-bold text-gray-800">{{ $t('coinHistory.title') }}</h1>
                <div class="w-6"></div>
            </div>
        </header>
        <main class="flex-1 overflow-y-auto px-4 py-5 pb-6">
            <div class="grid grid-cols-3 gap-3 mb-6">
                <div class="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl p-4 text-center">
                    <div class="text-2xl font-bold text-white mb-1">{{ userStore.profile.coins }}</div>
                    <div class="text-xs text-white opacity-90">{{ $t('coinHistory.current') }}</div>
                </div>
                <div class="bg-gradient-to-br from-green-400 to-green-500 rounded-xl p-4 text-center">
                    <div class="text-2xl font-bold text-white mb-1">{{ coinHistoryStore.getTotalEarned() }}</div>
                    <div class="text-xs text-white opacity-90">{{ $t('coinHistory.earned') }}</div>
                </div>
                <div class="bg-gradient-to-br from-red-400 to-red-500 rounded-xl p-4 text-center">
                    <div class="text-2xl font-bold text-white mb-1">{{ coinHistoryStore.getTotalSpent() }}</div>
                    <div class="text-xs text-white opacity-90">{{ $t('coinHistory.spent') }}</div>
                </div>
            </div>
            <div v-if="coinHistoryStore.transactions.length === 0" class="text-center py-12">
                <div class="text-6xl mb-4">💰</div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">{{ $t('coinHistory.noTransactions') }}</h3>
                <p class="text-gray-500">{{ $t('coinHistory.startLearning') }}</p>
            </div>
            <div v-else class="space-y-3">
                <div v-for="transaction in coinHistoryStore.transactions" :key="transaction.id"
                    class="bg-white rounded-xl p-4 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div :class="[
                                'w-12 h-12 rounded-full flex items-center justify-center',
                                transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                            ]">
                                <svg v-if="transaction.type === 'earned'" class="w-6 h-6 text-green-600" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4v16m0 0l-4-4m4 4l4-4" />
                                </svg>
                                <svg v-else class="w-6 h-6 text-red-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 20V4m0 0l4 4m-4-4l-4 4" />
                                </svg>
                            </div>
                            <div>
                                <div class="font-semibold text-gray-800">{{ transaction.reason }}</div>
                                <div class="text-xs text-gray-500">{{ formatDate(transaction.timestamp) }}</div>
                            </div>
                        </div>
                        <div :class="[
                            'text-lg font-bold',
                            transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                        ]">
                            {{ transaction.type === 'earned' ? '+' : '-' }}{{ transaction.amount }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-blue-50 rounded-xl p-4 mt-6">
                <div class="flex gap-3">
                    <svg class="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h3 class="font-semibold text-blue-900 mb-1">So verdienst du Münzen</h3>
                        <ul class="text-sm text-blue-800 space-y-1">
                            <li>• Lernsets abschließen</li>
                            <li>• Tägliche Streak aufrechterhalten</li>
                            <li>• Errungenschaften freischalten</li>
                            <li>• Quiz & Tests bestehen</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCoinHistoryStore } from '@/stores/coinHistory'

const userStore = useUserStore()
const coinHistoryStore = useCoinHistoryStore()

onMounted(async () => {
    await userStore.loadFromStorage()
    await coinHistoryStore.loadFromStorage()
})

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `Heute um ${hours}:${minutes}`
    }
    if (diffDays === 1) return 'Gestern'
    if (diffDays < 7) return `vor ${diffDays} Tagen`
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<style scoped>
header {
    padding-top: env(safe-area-inset-top);
}
</style>
