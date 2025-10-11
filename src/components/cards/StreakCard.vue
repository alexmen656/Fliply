<template>
    <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div class="flex items-center gap-2 mb-2">
            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
            <span class="text-sm font-medium">Streak</span>
        </div>
        <div class="text-3xl font-bold text-gray-800">{{ streakStore.currentStreak }}</div>
        <div class="text-xs opacity-90 mt-1">{{ $t('home.streak') }}</div>
    </div>
</template>
<script setup lang="ts">
import { useStreakStore } from '@/stores/streak'
const streakStore = useStreakStore()
</script>