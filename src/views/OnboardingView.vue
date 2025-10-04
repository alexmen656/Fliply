<template>
    <div class="flex flex-col h-screen bg-gradient-to-br from-[#4255FF] to-[#3142CC]">
        <div v-if="currentStep === 0" class="flex-1 flex flex-col items-center justify-center px-6 text-white">
            <div class="w-full max-w-md">
                <div class="text-center mb-8">
                    <div class="text-7xl mb-6">👋</div>
                    <h1 class="text-4xl font-bold mb-4">Willkommen bei Fliply!</h1>
                    <p class="text-lg text-blue-100">Lass uns dich kennenlernen</p>
                </div>

                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
                    <label class="block text-sm font-semibold mb-3">Wie sollen wir dich nennen?</label>
                    <input v-model="userName" type="text" placeholder="Dein Name"
                        class="w-full bg-white text-gray-800 rounded-xl px-4 py-4 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                        @keyup.enter="nextStep" />
                </div>

                <button @click="nextStep" :disabled="!userName.trim()" :class="[
                    'w-full py-4 rounded-xl font-bold text-lg transition',
                    userName.trim()
                        ? 'bg-white text-[#4255FF] active:scale-95'
                        : 'bg-white/30 text-white/50 cursor-not-allowed'
                ]">
                    Weiter
                </button>
            </div>
        </div>
        <div v-if="currentStep === 1" class="flex-1 flex flex-col items-center justify-center px-6 text-white">
            <div class="w-full max-w-md">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold mb-2">Profil einrichten</h2>
                    <p class="text-blue-100">Optional: Personalisiere dein Profil</p>
                </div>
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-4">
                    <label class="block text-sm font-semibold mb-3">Wähle dein Profilbild</label>
                    <div class="grid grid-cols-6 gap-3">
                        <button v-for="emoji in emojis" :key="emoji" @click="selectedEmoji = emoji" :class="[
                            'text-4xl p-3 rounded-xl transition',
                            selectedEmoji === emoji
                                ? 'bg-white/30 scale-110'
                                : 'bg-white/10 hover:bg-white/20'
                        ]">
                            {{ emoji }}
                        </button>
                    </div>
                </div>
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
                    <label class="block text-sm font-semibold mb-3">E-Mail (optional)</label>
                    <input v-model="userEmail" type="email" placeholder="deine@email.de"
                        class="w-full bg-white text-gray-800 rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50" />
                    <p class="text-xs text-blue-100 mt-2">Für Fortschrittssicherung und Erinnerungen</p>
                </div>

                <div class="space-y-3">
                    <button @click="saveProfile"
                        class="w-full bg-white text-[#4255FF] py-4 rounded-xl font-bold text-lg active:scale-95 transition">
                        Profil speichern
                    </button>
                    <button @click="skipProfile"
                        class="w-full bg-white/20 text-white py-3 rounded-xl font-semibold active:scale-95 transition">
                        Überspringen
                    </button>
                </div>
            </div>
        </div>
        <div v-if="currentStep === 2" class="flex-1 flex flex-col">
            <div class="flex-1 flex flex-col items-center justify-center px-6 text-white">
                <div class="w-full max-w-md text-center">
                    <div class="text-7xl mb-6">🏠</div>
                    <h2 class="text-3xl font-bold mb-4">Deine Startseite</h2>
                    <p class="text-lg text-blue-100 mb-8">
                        Hier findest du deine eigenen Lernsets und von Experten erstellte Sets.
                        Scrolle horizontal, um alle Sets zu sehen!
                    </p>
                    <div class="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-left">
                        <div class="flex items-start gap-3 mb-3">
                            <div class="text-2xl">📚</div>
                            <div>
                                <h4 class="font-semibold">My Sets</h4>
                                <p class="text-sm text-blue-100">Deine selbst erstellten Lernsets</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div class="text-2xl">⭐</div>
                            <div>
                                <h4 class="font-semibold">Expert Sets</h4>
                                <p class="text-sm text-blue-100">Professionell erstellte Inhalte</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-6 pb-8">
                <button @click="nextStep"
                    class="w-full bg-white text-[#4255FF] py-4 rounded-xl font-bold text-lg active:scale-95 transition">
                    Weiter
                </button>
            </div>
        </div>
        <div v-if="currentStep === 3" class="flex-1 flex flex-col">
            <div class="flex-1 flex flex-col items-center justify-center px-6 text-white">
                <div class="w-full max-w-md text-center">
                    <div class="text-7xl mb-6">➕</div>
                    <h2 class="text-3xl font-bold mb-4">Sets erstellen</h2>
                    <p class="text-lg text-blue-100 mb-8">
                        Erstelle deine eigenen Flashcard-Sets! Füge Karten mit Frage und Antwort hinzu.
                    </p>
                    <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-left space-y-4">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">1
                            </div>
                            <p class="text-sm">Titel für dein Set eingeben</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">2
                            </div>
                            <p class="text-sm">Karten hinzufügen (Vorder- & Rückseite)</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">3
                            </div>
                            <p class="text-sm">Set speichern und mit dem Lernen beginnen!</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-6 pb-8">
                <button @click="nextStep"
                    class="w-full bg-white text-[#4255FF] py-4 rounded-xl font-bold text-lg active:scale-95 transition">
                    Weiter
                </button>
            </div>
        </div>
        <div v-if="currentStep === 4" class="flex-1 flex flex-col">
            <div class="flex-1 flex flex-col items-center justify-center px-6 text-white">
                <div class="w-full max-w-md text-center">
                    <div class="text-7xl mb-6">🎯</div>
                    <h2 class="text-3xl font-bold mb-4">Lernen & Streak</h2>
                    <p class="text-lg text-blue-100 mb-8">
                        Übe täglich und baue deinen Streak auf! Je länger du am Ball bleibst, desto besser.
                    </p>
                    <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6 space-y-4">
                        <div class="flex items-start gap-3 text-left">
                            <div class="text-2xl">🔥</div>
                            <div>
                                <h4 class="font-semibold">Täglicher Streak</h4>
                                <p class="text-sm text-blue-100">Übe jeden Tag und erhalte Belohnungen</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3 text-left">
                            <div class="text-2xl">🎴</div>
                            <div>
                                <h4 class="font-semibold">Flashcards</h4>
                                <p class="text-sm text-blue-100">Tippe auf Karten zum Umdrehen</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3 text-left">
                            <div class="text-2xl">🏆</div>
                            <div>
                                <h4 class="font-semibold">Achievements</h4>
                                <p class="text-sm text-blue-100">Sammle Erfolge und sieh deinen Fortschritt</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-6 pb-8">
                <button @click="finishOnboarding"
                    class="w-full bg-white text-[#4255FF] py-4 rounded-xl font-bold text-lg active:scale-95 transition">
                    Los geht's! 🚀
                </button>
            </div>
        </div>
        <div v-if="currentStep > 0" class="fixed bottom-8 left-0 right-0 flex justify-center gap-2 px-6">
            <div v-for="i in 4" :key="i" :class="[
                'h-2 rounded-full transition-all',
                currentStep === i ? 'w-8 bg-white' : 'w-2 bg-white/30'
            ]"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const currentStep = ref(0)
const userName = ref('')
const userEmail = ref('')
const selectedEmoji = ref('😊')

const emojis = ['😊', '😎', '🤓', '🥳', '🚀', '⭐', '🎯', '💪', '🔥', '🌟', '🎨', '🎮']

const nextStep = () => {
    if (currentStep.value === 0 && userName.value.trim()) {
        userStore.setName(userName.value.trim())
        currentStep.value++
        userStore.setOnboardingStep(currentStep.value)
    } else if (currentStep.value > 0) {
        currentStep.value++
        userStore.setOnboardingStep(currentStep.value)
    }
}

const saveProfile = () => {
    userStore.updateProfile({
        emoji: selectedEmoji.value,
        email: userEmail.value || undefined
    })
    nextStep()
}

const skipProfile = () => {
    nextStep()
}

const finishOnboarding = () => {
    userStore.completeOnboarding()
    router.push('/home')
}
</script>

<style scoped>
.active\:scale-95:active {
    transform: scale(0.95);
}
</style>
