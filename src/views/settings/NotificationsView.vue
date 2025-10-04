<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between">
                <button @click="$router.back()" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 class="text-xl font-bold text-gray-800">Benachrichtigungen</h1>
                <div class="w-6"></div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto px-4 py-5">
            <div class="bg-white rounded-xl overflow-hidden shadow-sm">
                <div v-for="(item, index) in notifications" :key="item.id"
                    :class="['flex items-center justify-between px-4 py-4', index !== notifications.length - 1 ? 'border-b border-gray-100' : '']">
                    <div>
                        <div class="font-medium text-gray-800">{{ item.title }}</div>
                        <div class="text-sm text-gray-500 mt-1">{{ item.description }}</div>
                    </div>
                    <button @click="toggleNotification(item.id)" 
                        :class="['w-12 h-7 rounded-full transition', item.enabled ? 'bg-[#4255FF]' : 'bg-gray-300']">
                        <div :class="['w-5 h-5 bg-white rounded-full shadow transition-transform', item.enabled ? 'translate-x-6' : 'translate-x-1']"></div>
                    </button>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const notifications = ref([
    { id: 1, title: 'Tägliche Erinnerung', description: 'Erinnere mich ans Lernen', enabled: true },
    { id: 2, title: 'Lernziel erreicht', description: 'Benachrichtigung bei Zielerreichung', enabled: true },
    { id: 3, title: 'Neue Achievements', description: 'Zeige neue Erfolge an', enabled: false },
    { id: 4, title: 'Wochenübersicht', description: 'Zusammenfassung am Sonntag', enabled: true }
])

const toggleNotification = (id: number) => {
    const item = notifications.value.find(n => n.id === id)
    if (item) item.enabled = !item.enabled
}
</script>
