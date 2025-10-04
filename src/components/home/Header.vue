<template>
    <header class="bg-[#4255FF] px-4 pt-3 pb-4 relative">
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
                <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                </svg>
                <span class="text-white text-xl font-bold">Fliply</span>
            </div>
            <button @click="toggleNotifications" class="text-white p-2 relative">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span v-if="unreadCount > 0"
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {{ unreadCount > 9 ? '9+' : unreadCount }}
                </span>
            </button>
        </div>

        <div class="relative">
            <input v-model="searchQuery" @input="handleSearch" @focus="showSearchResults = true" type="text"
                placeholder="Suche Lernsets, Lehrbücher..."
                class="w-full bg-white rounded-lg px-4 py-3 pr-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300" />
            <svg class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div v-if="showSearchResults && searchQuery.length > 0"
                class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl max-h-96 overflow-y-auto z-50">
                <div v-if="isSearching" class="p-4 text-center text-gray-500">
                    <svg class="animate-spin h-5 w-5 mx-auto mb-2 text-[#4255FF]" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    Suche läuft...
                </div>
                <div v-else-if="searchResults.length > 0" class="py-2">
                    <div v-for="result in searchResults" :key="result.id" @click="selectResult(result)"
                        class="px-4 py-3 hover:bg-gray-50 cursor-pointer active:bg-gray-100 transition border-b border-gray-100 last:border-0">
                        <div class="flex items-start gap-3">
                            <div class="text-2xl">{{ result.icon }}</div>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-semibold text-gray-800 truncate">{{ result.title }}</h4>
                                <p class="text-sm text-gray-500">{{ result.cards }} Karten · {{ result.author }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="p-8 text-center text-gray-500">
                    <svg class="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="font-medium text-gray-700 mb-1">Keine Ergebnisse</p>
                    <p class="text-sm">Versuche es mit anderen Suchbegriffen</p>
                </div>
            </div>
        </div>
        <Transition name="dropdown">
            <div v-if="showNotifications"
                class="absolute top-full left-4 right-4 mt-2 bg-white rounded-xl shadow-2xl z-50 max-h-[500px] overflow-hidden">
                <div class="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 class="font-bold text-gray-800 text-lg">Benachrichtigungen</h3>
                    <button @click="markAllAsRead" class="text-[#4255FF] text-sm font-semibold">
                        Alle lesen
                    </button>
                </div>

                <div class="overflow-y-auto max-h-96">
                    <div v-if="notifications.length === 0" class="p-8 text-center text-gray-500">
                        <svg class="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p class="font-medium text-gray-700">Keine Benachrichtigungen</p>
                    </div>

                    <div v-for="notification in notifications" :key="notification.id"
                        @click="handleNotificationClick(notification)" :class="[
                            'p-4 border-b border-gray-100 last:border-0 cursor-pointer transition',
                            notification.read ? 'bg-white' : 'bg-blue-50',
                            'hover:bg-gray-50 active:bg-gray-100'
                        ]">
                        <div class="flex items-start gap-3">
                            <div class="text-2xl flex-shrink-0">{{ notification.icon }}</div>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-semibold text-gray-800 text-sm mb-1">{{ notification.title }}</h4>
                                <p class="text-sm text-gray-600 mb-1">{{ notification.message }}</p>
                                <p class="text-xs text-gray-400">{{ notification.time }}</p>
                            </div>
                            <div v-if="!notification.read" class="w-2 h-2 bg-[#4255FF] rounded-full flex-shrink-0 mt-2">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

        <div v-if="showNotifications || (showSearchResults && searchQuery.length > 0)" @click="closeDropdowns"
            class="fixed inset-0 z-40"></div>
    </header>
</template>

<script lang="ts">
import { ref, computed, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore, type Notification as NotificationType } from '@/stores/notifications'

interface SearchResult {
    id: number
    title: string
    cards: number
    author: string
    icon: string
}

export default {
    setup() {
        const instance = getCurrentInstance()
        const $axios = instance?.appContext.config.globalProperties.$axios
        const router = useRouter()
        const notificationsStore = useNotificationsStore()

        const searchQuery = ref('')
        const showSearchResults = ref(false)
        const isSearching = ref(false)
        const searchResults = ref<SearchResult[]>([])

        const allSets = ref<SearchResult[]>([])
        $axios.get('/api/expert-sets').then((response: any) => {
            allSets.value = response.data
        })

        const showNotifications = ref(false)
        const notifications = computed(() => notificationsStore.notifications)
        const unreadCount = computed(() => notificationsStore.unreadCount)

        let searchTimeout: ReturnType<typeof setTimeout> | null = null
        const handleSearch = () => {
            if (searchTimeout) clearTimeout(searchTimeout)

            if (searchQuery.value.trim() === '') {
                searchResults.value = []
                return
            }

            isSearching.value = true
            searchTimeout = setTimeout(() => {
                const query = searchQuery.value.toLowerCase()
                searchResults.value = allSets.value.filter(set =>
                    set.title.toLowerCase().includes(query) ||
                    set.author.toLowerCase().includes(query)
                )
                isSearching.value = false
            }, 300)
        }

        const selectResult = (result: SearchResult) => {
            router.push(`/set/${result.id}`)
            searchQuery.value = ''
            searchResults.value = []
            showSearchResults.value = false
        }

        const toggleNotifications = () => {
            showNotifications.value = !showNotifications.value
            if (showNotifications.value) {
                showSearchResults.value = false
            }
        }

        const markAllAsRead = () => {
            notificationsStore.markAllAsRead()
        }

        const handleNotificationClick = (notification: NotificationType) => {
            notificationsStore.markAsRead(notification.id)
            showNotifications.value = false
            if (notification.link) router.push(notification.link)
        }

        const closeDropdowns = () => {
            showNotifications.value = false
            showSearchResults.value = false
        }

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeDropdowns()
        }

        onMounted(() => {
            document.addEventListener('keydown', handleEscape)
        })

        onUnmounted(() => {
            document.removeEventListener('keydown', handleEscape)
            if (searchTimeout) clearTimeout(searchTimeout)
        })

        return {
            searchQuery,
            showSearchResults,
            isSearching,
            searchResults,
            allSets,
            showNotifications,
            notifications,
            unreadCount,
            handleSearch,
            selectResult,
            toggleNotifications,
            markAllAsRead,
            handleNotificationClick,
            closeDropdowns
        }
    }
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease;
}

.dropdown-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
</style>
