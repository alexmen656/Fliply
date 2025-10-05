<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between mb-4">
                <button @click="$router.back()" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 class="text-xl font-bold text-gray-800">Avatar Shop</h1>
                <div class="w-6"></div>
            </div>
            <div
                class="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="text-2xl">🪙</span>
                    <div>
                        <div class="text-sm text-yellow-900 font-semibold">Deine Münzen</div>
                        <div class="text-2xl text-yellow-900 font-bold">{{ userStore.profile.coins }}</div>
                    </div>
                </div>
                <div class="text-xs text-yellow-900">
                    Verdiene mehr durch Lernen!
                </div>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto px-4 py-5 pb-6">
            <div v-if="isLoading" class="text-center py-8">
                <p class="text-gray-500">Lade Avatare...</p>
            </div>

            <div v-else>
                <!-- Unlocked Avatars -->
                <section v-if="avatarsStore.getUnlockedAvatars().length > 0" class="mb-6">
                    <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span>✅</span>
                        <span>Deine Avatare</span>
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
                                class="absolute top-1 right-1 bg-[#4255FF] text-white rounded-full w-6 h-6 flex items-center justify-center">
                                ✓
                            </div>
                        </button>
                    </div>
                </section>

                <!-- Locked Avatars -->
                <section v-if="avatarsStore.getLockedAvatars().length > 0">
                    <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span>🔒</span>
                        <span>Freischaltbar</span>
                    </h2>
                    <div class="grid grid-cols-3 gap-3">
                        <button v-for="avatar in avatarsStore.getLockedAvatars()" :key="avatar.id"
                            @click="unlockAvatar(avatar)"
                            class="bg-white rounded-xl p-3 shadow-sm active:scale-95 transition relative">
                            <div class="relative">
                                <img :src="avatar.url" alt="Avatar"
                                    class="w-full aspect-square rounded-lg object-cover mb-2 opacity-40" />
                                <div class="absolute inset-0 flex items-center justify-center text-3xl">
                                    🔒
                                </div>
                            </div>
                            <div class="text-xs font-medium text-gray-700 text-center mb-1">{{ avatar.name }}</div>
                            <div
                                class="bg-yellow-100 text-yellow-800 text-xs font-bold py-1 px-2 rounded-full text-center flex items-center justify-center gap-1">
                                <span>🪙</span>
                                <span>{{ avatar.cost }}</span>
                            </div>
                        </button>
                    </div>
                </section>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAvatarsStore } from '@/stores/avatars'
import type { Avatar } from '@/stores/avatars'

const router = useRouter()
const userStore = useUserStore()
const avatarsStore = useAvatarsStore()
const isLoading = ref(true)

onMounted(async () => {
    isLoading.value = true
    await userStore.loadFromStorage()
    await avatarsStore.loadFromStorage()
    isLoading.value = false
})

const selectAvatar = async (avatar: Avatar) => {
    await userStore.setAvatar(avatar.url)
}

const unlockAvatar = async (avatar: Avatar) => {
    if (userStore.profile.coins >= avatar.cost) {
        const confirmed = confirm(`Möchtest du "${avatar.name}" für ${avatar.cost} Münzen freischalten?`)
        if (confirmed) {
            const success = await userStore.spendCoins(avatar.cost)
            if (success) {
                await avatarsStore.unlockAvatar(avatar.id)
                await userStore.setAvatar(avatar.url)
            }
        }
    } else {
        const needed = avatar.cost - userStore.profile.coins
        alert(`Du brauchst noch ${needed} Münzen mehr! Lerne weiter, um Münzen zu verdienen. 🎓`)
    }
}
</script>

<style scoped>
.active\:scale-95:active {
    transform: scale(0.95);
}

header {
    padding-top: env(safe-area-inset-top);
}
</style>
