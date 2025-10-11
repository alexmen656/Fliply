<template>
    <div @click="$emit('click', set.id)"
        class="bg-white rounded-xl shadow-sm active:scale-98 transition cursor-pointer overflow-hidden mb-3">
        <div class="flex items-stretch">
            <div class="flex-1 p-4">
                <h3 class="font-bold text-gray-800 mb-1">{{ set.title }}</h3>
                <p class="text-sm text-gray-600 mb-2">
                    {{ typeof set.cards === 'number' ? set.cards : set.cards.length }} {{ $t('common.cards') }}
                </p>
                <div class="flex items-center gap-2">
                    <div class="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <span class="text-xs text-gray-500">{{ set.author }}</span>
                </div>
            </div>
            <div v-if="set.icon && !isUrl(set.icon)"
                class="w-20 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                {{ set.icon }}
            </div>
            <div v-else-if="set.icon" class="w-20 flex-shrink-0">
                <img :src="set.icon" alt="Set Icon" class="w-full h-full object-cover" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

interface Set {
    id?: string | number
    title: string
    cards: number | Array<{ front: string; back: string; order: number }>
    author: string
    icon?: string
}

export default defineComponent({
    name: 'SetCard',
    props: {
        set: {
            type: Object as PropType<Set>,
            required: true
        }
    },
    emits: ['click'],
    setup(props) {
        const isUrl = (str: string) => {
            return str && (str.startsWith('http://') || str.startsWith('https://'))
        }

        return {
            isUrl
        }
    }
})
</script>

<style scoped>
.active\:scale-98:active {
    transform: scale(0.98);
}
</style>
