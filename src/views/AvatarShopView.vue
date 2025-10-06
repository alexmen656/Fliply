<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between mb-4">
                <button @click="$router.back()" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 class="text-xl font-bold text-gray-800">{{ $t('avatarShop.title') }}</h1>
                <div class="w-6"></div>
            </div>
            <div
                class="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <svg class="w-8 h-8 text-yellow-900" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                    </svg>
                    <div>
                        <div class="text-sm text-yellow-900 font-semibold">{{ $t('avatarShop.yourCoins') }}</div>
                        <div class="text-2xl text-yellow-900 font-bold">{{ userStore.profile.coins }}</div>
                    </div>
                </div>
                <div class="text-xs text-yellow-900">
                    {{ $t('avatarShop.earnMore') }}
                </div>
            </div>
            <div class="flex gap-2 mt-4">
                <button @click="activeTab = 'avatars'" :class="[
                    'flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2',
                    activeTab === 'avatars' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                ]">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{{ $t('avatarShop.avatars') }}</span>
                </button>
                <button @click="activeTab = 'banners'" :class="[
                    'flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2',
                    activeTab === 'banners' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                ]">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <span>{{ $t('avatarShop.banners') }}</span>
                </button>
            </div>
        </header>
        <main class="flex-1 overflow-y-auto px-4 py-5 pb-6">
            <div v-if="activeTab === 'avatars'">
                <div v-if="isLoading" class="text-center py-8">
                    <p class="text-gray-500">{{ $t('common.loading') }}</p>
                </div>
                <div v-else>
                    <section v-if="avatarsStore.getUnlockedAvatars().length > 0" class="mb-6">
                        <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span>{{ $t('avatarShop.yourAvatars') }}</span>
                        </h2>
                        <div class="grid grid-cols-3 gap-3">
                            <button v-for="avatar in avatarsStore.getUnlockedAvatars()" :key="avatar.id"
                                @click="selectAvatar(avatar)" :class="[
                                    'bg-white rounded-xl p-3 shadow-sm active:scale-95 transition relative',
                                    userStore.profile.avatar === avatar.url ? 'ring-4 ring-[#4255FF]' : ''
                                ]">
                                <img :src="avatar.url" alt="Avatar"
                                    class="w-full aspect-square rounded-lg object-cover mb-2" />
                                <div class="text-xs font-medium text-gray-700 text-center">{{ avatar.name }}</div>
                                <div v-if="userStore.profile.avatar === avatar.url"
                                    class="absolute top-1 right-1 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </section>
                    <section v-if="avatarsStore.getLockedAvatars().length > 0">
                        <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span>{{ $t('avatarShop.unlockable') }}</span>
                        </h2>
                        <div class="grid grid-cols-3 gap-3">
                            <button v-for="avatar in avatarsStore.getLockedAvatars()" :key="avatar.id"
                                @click="unlockAvatar(avatar)"
                                class="bg-white rounded-xl p-3 shadow-sm active:scale-95 transition relative">
                                <div class="relative">
                                    <img :src="avatar.url" alt="Avatar"
                                        class="w-full aspect-square rounded-lg object-cover mb-2 opacity-40" />
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <svg class="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="text-xs font-medium text-gray-700 text-center mb-1">{{ avatar.name }}</div>
                                <div
                                    class="bg-yellow-100 text-yellow-800 text-xs font-bold py-1 px-2 rounded-full text-center flex items-center justify-center gap-1">
                                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                                    </svg>
                                    <span>{{ avatar.cost }}</span>
                                </div>
                            </button>
                        </div>
                    </section>
                </div>
            </div>
            <div v-if="activeTab === 'banners'">
                <div v-if="isLoading" class="text-center py-8">
                    <p class="text-gray-500">{{ $t('common.loading') }}</p>
                </div>
                <div v-else>
                    <section v-if="bannersStore.getUnlockedBanners().length > 0" class="mb-6">
                        <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span>{{ $t('avatarShop.yourBanners') }}</span>
                        </h2>
                        <div class="space-y-3">
                            <button v-for="banner in bannersStore.getUnlockedBanners()" :key="banner.id"
                                @click="selectBanner(banner)" :class="[
                                    'w-full rounded-xl p-4 shadow-sm active:scale-98 transition relative',
                                    bannersStore.currentBanner === banner.id ? 'ring-4 ring-[#4255FF]' : ''
                                ]">
                                <div
                                    :class="['h-24 rounded-lg mb-2 flex items-center justify-center', banner.gradient]">
                                    <span class="text-white text-2xl font-bold">{{ banner.name }}</span>
                                </div>
                                <div class="text-sm font-medium text-gray-700">{{ banner.name }}</div>
                                <div class="text-xs text-gray-500">{{ banner.description }}</div>
                                <div v-if="bannersStore.currentBanner === banner.id"
                                    class="absolute top-2 right-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </section>
                    <section v-if="bannersStore.getLockedBanners().length > 0">
                        <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span>Freischaltbar</span>
                        </h2>
                        <div class="space-y-3">
                            <button v-for="banner in bannersStore.getLockedBanners()" :key="banner.id"
                                @click="unlockBanner(banner)"
                                class="w-full bg-white rounded-xl p-4 shadow-sm active:scale-98 transition relative">
                                <div
                                    :class="['h-24 rounded-lg mb-2 flex items-center justify-center opacity-40 relative', banner.gradient]">
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="text-sm font-medium text-gray-700">{{ banner.name }}</div>
                                <div class="text-xs text-gray-500 mb-2">{{ banner.description }}</div>
                                <div
                                    class="bg-yellow-100 text-yellow-800 text-xs font-bold py-2 px-3 rounded-lg inline-flex items-center gap-2">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                                    </svg>
                                    <span>{{ banner.cost }} Münzen</span>
                                </div>
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useAvatarsStore } from '@/stores/avatars'
import { useBannersStore } from '@/stores/banners'
import type { Avatar } from '@/stores/avatars'
import type { Banner } from '@/stores/banners'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const avatarsStore = useAvatarsStore()
const bannersStore = useBannersStore()
const isLoading = ref(true)
const activeTab = ref<'avatars' | 'banners'>('avatars')

onMounted(async () => {
    isLoading.value = true
    await userStore.loadFromStorage()
    await avatarsStore.loadFromStorage()
    await bannersStore.loadFromStorage()
    isLoading.value = false
})

const selectAvatar = async (avatar: Avatar) => {
    await userStore.setAvatar(avatar.url)
}

const unlockAvatar = async (avatar: Avatar) => {
    if (userStore.profile.coins >= avatar.cost) {
        const confirmed = confirm(t('avatarShop.confirmUnlock', { name: avatar.name, cost: avatar.cost }))
        if (confirmed) {
            const success = await userStore.spendCoins(avatar.cost, `Avatar "${avatar.name}" ${t('avatarShop.purchased')}`)
            if (success) {
                await avatarsStore.unlockAvatar(avatar.id)
                await userStore.setAvatar(avatar.url)
            }
        }
    } else {
        const needed = avatar.cost - userStore.profile.coins
        alert(t('avatarShop.notEnoughCoins', { needed }))
    }
}

const selectBanner = async (banner: Banner) => {
    await bannersStore.setBanner(banner.id)
}

const unlockBanner = async (banner: Banner) => {
    if (userStore.profile.coins >= banner.cost) {
        const confirmed = confirm(t('avatarShop.confirmUnlock', { name: banner.name, cost: banner.cost }))
        if (confirmed) {
            const success = await userStore.spendCoins(banner.cost, `Banner "${banner.name}" ${t('avatarShop.purchased')}`)
            if (success) {
                await bannersStore.unlockBanner(banner.id)
                await bannersStore.setBanner(banner.id)
            }
        }
    } else {
        const needed = banner.cost - userStore.profile.coins
        alert(t('avatarShop.notEnoughCoins', { needed }))
    }
}
</script>

<style scoped>
.active\:scale-95:active {
    transform: scale(0.95);
}

.active\:scale-98:active {
    transform: scale(0.98);
}

header {
    padding-top: env(safe-area-inset-top);
}
</style>
