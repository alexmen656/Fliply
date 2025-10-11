<template>
    <div @click="router.push('/avatar-shop')"
        class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm cursor-pointer active:scale-95 transition">
        <div class="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                stroke-width="1.5" class="w-5 h-5 text-primary size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span class="text-sm font-medium">{{ $t('profile.coins') }}</span>
        </div>
        <div class="text-3xl font-bold text-gray-800">{{ userStore.profile.coins }}</div>
        <!--  <div class="text-xs opacity-90 mt-1">{{ $t('avatarShop.title') }}</div> -->
    </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
</script>