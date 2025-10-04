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
                <h1 class="text-xl font-bold text-gray-800">Set bearbeiten</h1>
                <button @click="saveChanges" class="text-[#4255FF] font-semibold">Speichern</button>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto pb-20 px-4 py-5">
            <!-- Set Info -->
            <div class="mb-6">
                <label class="text-sm font-medium text-gray-700 mb-2 block">Set-Titel</label>
                <input v-model="setTitle" type="text"
                    class="w-full text-xl font-bold text-gray-800 bg-white rounded-xl px-4 py-4 border-2 border-gray-200 focus:border-[#4255FF] focus:outline-none" />
            </div>

            <div class="mb-6">
                <label class="text-sm font-medium text-gray-700 mb-2 block">Beschreibung</label>
                <textarea v-model="setDescription" rows="3"
                    class="w-full text-gray-700 bg-white rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-[#4255FF] focus:outline-none resize-none"></textarea>
            </div>

            <!-- Cards -->
            <div class="mb-4">
                <div class="flex items-center justify-between mb-3">
                    <h2 class="text-lg font-bold text-gray-800">Karten ({{ cards.length }})</h2>
                    <button @click="addCard" class="text-[#4255FF] font-semibold text-sm">+ Hinzufügen</button>
                </div>

                <div class="space-y-4">
                    <div v-for="(card, index) in cards" :key="index" class="bg-white rounded-xl p-4 shadow-sm">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-sm font-semibold text-gray-500">Karte {{ index + 1 }}</span>
                            <button @click="removeCard(index)" class="text-red-500 text-sm">Löschen</button>
                        </div>

                        <div class="space-y-3">
                            <div>
                                <label class="text-xs font-medium text-gray-600 mb-1 block">Vorderseite</label>
                                <input v-model="card.front" type="text" placeholder="Begriff oder Frage"
                                    class="w-full text-gray-800 bg-gray-50 rounded-lg px-3 py-3 border border-gray-200 focus:border-[#4255FF] focus:outline-none" />
                            </div>

                            <div>
                                <label class="text-xs font-medium text-gray-600 mb-1 block">Rückseite</label>
                                <textarea v-model="card.back" placeholder="Definition oder Antwort" rows="3"
                                    class="w-full text-gray-800 bg-gray-50 rounded-lg px-3 py-3 border border-gray-200 focus:border-[#4255FF] focus:outline-none resize-none"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Bottom Action Bar -->
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 safe-area-inset">
            <button @click="deleteSet"
                class="w-full bg-red-500 text-white font-bold py-4 rounded-xl active:scale-98 transition">
                Set löschen
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const setTitle = ref('Deutsch Vokabeln A2')
const setDescription = ref('Grundwortschatz für A2 Niveau')

interface Card {
    front: string
    back: string
}

const cards = ref<Card[]>([
    { front: 'Hallo', back: 'Hello' },
    { front: 'Danke', back: 'Thank you' },
    { front: 'Bitte', back: 'Please' }
])

const addCard = () => {
    cards.value.push({ front: '', back: '' })
}

const removeCard = (index: number) => {
    if (cards.value.length > 1) {
        cards.value.splice(index, 1)
    }
}

const saveChanges = () => {
    console.log('Saving changes:', { setTitle: setTitle.value, setDescription: setDescription.value, cards: cards.value })
    router.back()
}

const deleteSet = () => {
    if (confirm('Möchtest du dieses Set wirklich löschen?')) {
        router.push('/library')
    }
}
</script>

<style scoped>
.safe-area-inset {
    padding-bottom: env(safe-area-inset-bottom);
}

.active\:scale-98:active {
    transform: scale(0.98);
}
</style>
