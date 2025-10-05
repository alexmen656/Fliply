<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between">
                <button @click="$router.back()" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 class="text-xl font-bold text-gray-800">Hilfe & Support</h1>
                <div class="w-6"></div>
            </div>
        </header>
        <main class="flex-1 overflow-y-auto px-4 py-5">
            <div class="mb-6">
                <h3 class="font-bold text-gray-800 mb-3">Häufige Fragen</h3>
                <div class="space-y-2">
                    <button v-for="faq in faqs" :key="faq.id" @click="toggleFaq(faq.id)"
                        class="w-full bg-white rounded-xl p-4 shadow-sm text-left">
                        <div class="flex items-center justify-between">
                            <span class="font-semibold text-gray-800">{{ faq.question }}</span>
                            <svg :class="['w-5 h-5 text-gray-400 transition-transform', expandedFaq === faq.id ? 'rotate-180' : '']"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        <div v-if="expandedFaq === faq.id" class="mt-3 text-sm text-gray-600">
                            {{ faq.answer }}
                        </div>
                    </button>
                </div>
            </div>
            <div class="mb-6">
                <h3 class="font-bold text-gray-800 mb-3">Kontakt</h3>
                <div class="space-y-3">
                    <a href="mailto:support@fliply.app"
                        class="w-full bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 active:bg-gray-50">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <div class="font-semibold text-gray-800">E-Mail Support</div>
                            <div class="text-sm text-gray-500">support.fliply@control-center.eu</div>
                        </div>
                    </a>
                </div>
            </div>
            <div>
                <h3 class="font-bold text-gray-800 mb-3">App-Info</h3>
                <div class="bg-white rounded-xl p-4 shadow-sm space-y-3">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Version</span>
                        <span class="font-semibold text-gray-800">1.0.0</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Build</span>
                        <span class="font-semibold text-gray-800">2025.10.04</span>
                    </div>
                    <div class="pt-3 border-t border-gray-100">
                        <a href="#" class="text-[#4255FF] text-sm font-semibold">Nutzungsbedingungen</a>
                        <span class="text-gray-400 mx-2">•</span>
                        <a href="#" class="text-[#4255FF] text-sm font-semibold">Datenschutz</a>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const expandedFaq = ref<number | null>(null)

const faqs = ref([
    {
        id: 1,
        question: 'Wie erstelle ich ein neues Lernset?',
        answer: 'Tippe auf das "+" Icon in der unteren Navigation und füge deine Karteikarten hinzu.'
    },
    {
        id: 2,
        question: 'Wie funktioniert der Lernmodus?',
        answer: 'Wähle ein Set aus und tippe auf "Karteikarten". Tippe auf eine Karte zum Umdrehen.'
    },
    {
        id: 3,
        question: 'Kann ich meine Sets teilen?',
        answer: 'Ja! Öffne ein Set und tippe auf das Teilen-Symbol in der oberen rechten Ecke.'
    },
    {
        id: 4,
        question: 'Wie ändere ich mein Lernziel?',
        answer: 'Gehe zu Einstellungen → Lernziele und passe die Anzahl der Karten pro Tag an.'
    }
])

const toggleFaq = (id: number) => {
    expandedFaq.value = expandedFaq.value === id ? null : id
}

const openChat = () => {
    console.log('Opening chat...')
}
</script>

<style scoped>
.active\:bg-gray-50:active {
    background-color: rgb(249 250 251);
}

header {
    padding-top: env(safe-area-inset-top);
}
</style>
