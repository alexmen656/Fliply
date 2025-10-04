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
                <h1 class="text-xl font-bold text-gray-800">Neues Set</h1>
                <button @click="saveSet" class="text-[#4255FF] font-semibold">Fertig</button>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto pb-20 px-4 py-5">
            <!-- Set Title -->
            <div class="mb-6">
                <input v-model="setTitle" type="text" placeholder="Titel des Sets eingeben"
                    class="w-full text-xl font-bold text-gray-800 bg-white rounded-xl px-4 py-4 border-2 border-gray-200 focus:border-[#4255FF] focus:outline-none" />
            </div>

            <!-- Set Description -->
            <div class="mb-6">
                <textarea v-model="setDescription" placeholder="Beschreibung (optional)" rows="3"
                    class="w-full text-gray-700 bg-white rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-[#4255FF] focus:outline-none resize-none"></textarea>
            </div>

            <!-- Cards -->
            <div class="space-y-4">
                <div v-for="(card, index) in cards" :key="index" class="bg-white rounded-xl p-4 shadow-sm">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-sm font-semibold text-gray-500">Karte {{ index + 1 }}</span>
                        <button v-if="cards.length > 1" @click="removeCard(index)" class="text-red-500 text-sm">
                            Löschen
                        </button>
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

                <!-- Add Card Button -->
                <button @click="addCard"
                    class="w-full bg-white border-2 border-dashed border-gray-300 text-gray-600 font-semibold py-4 rounded-xl active:scale-98 transition flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Karte hinzufügen
                </button>
            </div>
        </main>

        <!-- Bottom Action Bar -->
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 safe-area-inset">
            <button @click="saveSet"
                class="w-full bg-[#4255FF] text-white font-bold py-4 rounded-xl active:scale-98 transition">
                Set speichern ({{ cards.length }} Karten)
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const setTitle = ref('')
const setDescription = ref('')

interface Card {
    front: string
    back: string
}

const cards = ref<Card[]>([
    { front: '', back: '' },
    { front: '', back: '' }
])

const addCard = () => {
    cards.value.push({ front: '', back: '' })
}

const removeCard = (index: number) => {
    if (cards.value.length > 1) {
        cards.value.splice(index, 1)
    }
}

const saveSet = () => {
    if (!setTitle.value.trim()) {
        alert('Bitte gib einen Titel für das Set ein')
        return
    }

    const validCards = cards.value.filter(card => card.front.trim() && card.back.trim())

    if (validCards.length === 0) {
        alert('Bitte füge mindestens eine vollständige Karte hinzu')
        return
    }

    console.log('Saving set:', {
        title: setTitle.value,
        description: setDescription.value,
        cards: validCards
    })

    router.push('/library')
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
