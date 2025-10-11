<template>
    <div class="bg-white rounded-xl shadow-sm active:scale-98 transition overflow-hidden mb-3">
        <div @click="$emit('click', set.id)" class="flex items-stretch cursor-pointer">
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
                <div v-if="showDate && set.accessedAt" class="mt-2">
                    <span class="text-xs text-gray-400">{{ formatDate(set.accessedAt) }}</span>
                </div>
                <div v-if="set.createdAt && !showDate" class="text-xs text-gray-500 mt-1">
                    {{ $t('library.created') }}: {{ new Date(set.createdAt).toLocaleDateString('de-DE') }}
                </div>
            </div>
            <div v-if="showFavorite" class="flex items-center pr-4" @click.stop>
                <button @click="$emit('toggle-favorite', set.id)" class="transition-transform active:scale-90"
                    :class="isFavorite ? 'text-yellow-500' : 'text-gray-300'">
                    <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
            </div>
            <div v-if="set.icon && !isUrl(set.icon)"
                class="w-20 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                {{ set.icon }}
            </div>
            <div v-else-if="set.icon" class="w-20 flex-shrink-0">
                <img :src="set.icon" alt="Set Icon" class="w-full h-full object-cover" />
            </div>
        </div>
        <div v-if="showDelete" class="px-4 py-2 border-t border-gray-100">
            <button @click.stop="$emit('delete', set.id)" class="text-red-500 hover:text-red-700 text-xs font-medium">
                {{ $t('common.delete') }}
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'

interface Set {
    id?: string | number
    title: string
    cards: number | Array<{ front: string; back: string; order: number }>
    author: string
    icon?: string
    createdAt?: string
    accessedAt?: string
}

export default defineComponent({
    name: 'SetCard',
    props: {
        set: {
            type: Object as PropType<Set>,
            required: true
        },
        showDelete: {
            type: Boolean,
            default: false
        },
        showFavorite: {
            type: Boolean,
            default: false
        },
        isFavorite: {
            type: Boolean,
            default: false
        },
        showDate: {
            type: Boolean,
            default: false
        }
    },
    emits: ['click', 'delete', 'toggle-favorite'],
    setup() {
        const { t } = useI18n()

        const isUrl = (str: string) => {
            return str && (str.startsWith('http://') || str.startsWith('https://'))
        }

        const formatDate = (dateString: string) => {
            const date = new Date(dateString)
            const now = new Date()
            const diffInMs = now.getTime() - date.getTime()
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

            if (diffInMinutes < 1) {
                return t('library.justNow')
            } else if (diffInMinutes < 60) {
                return t('library.minutesAgo', { count: diffInMinutes })
            } else if (diffInHours < 24) {
                return t('library.hoursAgo', { count: diffInHours })
            } else if (diffInDays === 1) {
                return t('library.yesterday')
            } else if (diffInDays < 7) {
                return t('library.daysAgo', { count: diffInDays })
            } else {
                return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
            }
        }

        return {
            isUrl,
            formatDate
        }
    }
})
</script>

<style scoped>
.active\:scale-98:active {
    transform: scale(0.98);
}
</style>
