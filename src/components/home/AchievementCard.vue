<template>
    <div :class="[
        'rounded-xl p-4 shadow-sm text-center transition',
        achievement.unlocked
            ? 'bg-white'
            : 'bg-gray-100 opacity-60'
    ]">
        <div :class="[
            'text-5xl mb-2 transition',
            !achievement.unlocked && 'grayscale opacity-40'
        ]">
            {{ achievement.icon }}
        </div>
        <h3 :class="[
            'font-bold text-sm mb-1',
            achievement.unlocked ? 'text-gray-800' : 'text-gray-400'
        ]">
            {{ achievement.name }}
        </h3>
        <p :class="[
            'text-xs',
            achievement.unlocked ? 'text-gray-500' : 'text-gray-400'
        ]">
            {{ achievement.description }}
        </p>
        <div v-if="achievement.unlocked && achievement.unlockedAt" class="mt-2">
            <span class="text-xs text-green-600 font-medium">✓ {{ $t('achievements.unlocked') }}</span>
        </div>
        <div v-else class="mt-2">
            <span class="text-xs text-gray-400">{{ $t('achievements.locked') }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

interface Achievement {
    id: string | number
    icon: string
    name: string
    description: string
    unlocked: boolean
    unlockedAt?: string
}

export default defineComponent({
    name: 'AchievementCard',
    props: {
        achievement: {
            type: Object as PropType<Achievement>,
            required: true
        }
    }
})
</script>

<style scoped>
.grayscale {
    filter: grayscale(100%);
}
</style>