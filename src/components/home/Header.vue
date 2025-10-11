<template>
    <header class="px-4 pt-3 relative">
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
                <div>
                    <span class="text-black text-3xl font-bold">Fliply</span>
                    <p v-if="userStore.profile.name" class="text-black text-lg">
                        {{ $t('onboarding.welcome').split(' ')[0] }}, {{ userStore.profile.name }}!
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <!--<button @click="toggleNotifications" class="text-white p-2 relative">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span v-if="unreadCount > 0"
                        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {{ unreadCount > 9 ? '9+' : unreadCount }}
                    </span>
                </button>-->
            </div>
        </div>

        <Transition name="dropdown">
            <div v-if="showNotifications"
                class="absolute top-full left-4 right-4 mt-2 bg-white rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden">
                <div class="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 class="font-bold text-gray-800">{{ $t('profile.notifications') }}</h3>
                    <button @click="markAllAsRead" class="text-primary text-sm font-semibold">
                        {{ $t('common.done') }}
                    </button>
                </div>

                <div class="overflow-y-auto max-h-80">
                    <div v-if="notifications.length === 0" class="p-8 text-center text-gray-500">
                        <p class="font-medium text-gray-700">{{ $t('profile.notifications') }}</p>
                    </div>

                    <div v-for="notification in notifications" :key="notification.id"
                        @click="handleNotificationClick(notification)" :class="[
                            'p-4 border-b border-gray-100 last:border-0 cursor-pointer',
                            notification.read ? 'bg-white' : 'bg-blue-50'
                        ]">
                        <div class="flex items-start gap-3">
                            <div class="text-2xl">{{ notification.icon }}</div>
                            <div class="flex-1">
                                <h4 class="font-semibold text-gray-800 text-sm mb-1">{{ notification.title }}</h4>
                                <p class="text-sm text-gray-600 mb-1">{{ notification.message }}</p>
                                <p class="text-xs text-gray-400">{{ notification.time }}</p>
                            </div>
                            <div v-if="!notification.read" class="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

        <div v-if="showNotifications" @click="closeDropdowns"
            class="fixed inset-0 z-40"></div>
    </header>
</template>

<script lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore, type Notification as NotificationType } from '@/stores/notifications'
import { useUserStore } from '@/stores/user'

export default {
    setup() {
        const router = useRouter()
        const notificationsStore = useNotificationsStore()
        const userStore = useUserStore()

        userStore.loadFromStorage()

        const showNotifications = ref(false)
        const notifications = computed(() => notificationsStore.notifications)
        const unreadCount = computed(() => notificationsStore.unreadCount)

        const toggleNotifications = () => {
            showNotifications.value = !showNotifications.value
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
        }

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeDropdowns()
            }
        }

        onMounted(() => {
            document.addEventListener('keydown', handleEscape)
        })

        onUnmounted(() => {
            document.removeEventListener('keydown', handleEscape)
        })

        return {
            showNotifications,
            notifications,
            unreadCount,
            userStore,
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
.dropdown-leave-active,
.search-enter-active,
.search-leave-active {
    transition: all 0.2s ease;
}

.dropdown-enter-from,
.search-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.dropdown-leave-to,
.search-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

header {
    padding-top: max(44px, env(safe-area-inset-top, 44px)) !important;
}
</style>