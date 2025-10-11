<template>
    <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div class="flex items-center gap-2 mb-2">
            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span class="text-sm font-medium">{{ $t('profile.goals') }}</span>
        </div>
        <div class="text-3xl font-bold text-gray-800">{{ goalsStore.todayProgress }}/{{
            goalsStore.dailyGoal }}</div>
        <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div class="bg-primary rounded-full h-1.5 transition-all"
                :style="{ width: goalsStore.getDailyProgressPercentage() + '%' }"></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useGoalsStore } from '@/stores/goals'
const goalsStore = useGoalsStore()
</script>