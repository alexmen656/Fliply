<template>
    <div class="bg-white rounded-xl p-6 shadow-sm text-center">
        <div class="mx-auto w-16 h-16 mb-3 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-full h-full">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
        </div>
        <h3 class="font-bold text-gray-800 mb-2">{{ title }}</h3>
        <p class="text-sm text-gray-600 mb-4">{{ description }}</p>
        <button @click="$emit('action')"
            class="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold active:scale-95 transition">
            {{ actionText }}
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'EmptyState',
    props: {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        actionText: {
            type: String,
            required: true
        }
    },
    emits: ['action']
})
</script>

<style scoped>
.active\:scale-95:active {
    transform: scale(0.95);
}
</style>
