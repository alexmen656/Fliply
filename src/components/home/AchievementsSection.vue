<template>
    <section class="px-3 py-5">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-800">{{ $t('home.achievements') }}</h2>
            <button @click="$emit('viewAll')" class="text-primary text-sm font-semibold">
                {{ $t('common.viewAll') }}
            </button>
        </div>

        <div class="grid grid-cols-2 gap-3">
            <AchievementCard v-for="achievement in achievements" :key="achievement.id" :achievement="achievement" />
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AchievementCard from '@/components/home/AchievementCard.vue'

interface Achievement {
    id: string | number
    icon: string
    name: string
    description: string
    unlocked: boolean
    unlockedAt?: string
}

export default defineComponent({
    name: 'AchievementsSection',
    components: { AchievementCard },
    props: {
        achievements: {
            type: Array as PropType<Achievement[]>,
            required: true
        }
    },
    emits: ['viewAll']
})
</script>
