<template>
    <section class="px-3 pt-3 pb-4">
        <div class="space-y-2">
            <div class="grid grid-cols-2 gap-2">
                <StreakCard />
                <GoalsCard />
            </div>
            <CoinsCard />
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import StreakCard from '@/components/cards/StreakCard.vue'
import GoalsCard from '@/components/cards/GoalsCard.vue'
import CoinsCard from '@/components/cards/CoinsCard.vue'

export default defineComponent({
    name: 'StatsSection',
    components: {
        StreakCard,
        GoalsCard,
        CoinsCard
    }
})
</script>
