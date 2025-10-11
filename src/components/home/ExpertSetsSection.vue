<template>
    <section class="py-5">
        <div class="flex items-center justify-between mb-4 px-3">
            <h2 class="text-xl font-bold text-gray-800">{{ $t('home.expertSets') }}</h2>
            <button @click="$emit('viewAll')" class="text-primary text-sm font-semibold">
                {{ $t('common.viewAll') }}
            </button>
        </div>

        <div class="overflow-x-auto scrollbar-hide">
            <div class="flex gap-3 px-3 pb-2">
                <ExpertSetCard v-for="set in sets" :key="set.id" :set="set" @click="$emit('openSet', set.id)" />
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import ExpertSetCard from '@/components/cards/ExpertSetCard.vue'

interface Set {
    id?: string | number
    title: string
    cards: number | Array<{ front: string; back: string; order: number }>
    author: string
    icon?: string
}

export default defineComponent({
    name: 'ExpertSetsSection',
    components: { ExpertSetCard },
    props: {
        sets: {
            type: Array as PropType<Set[]>,
            required: true
        }
    },
    emits: ['viewAll', 'openSet']
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
