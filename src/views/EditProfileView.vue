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
                <h1 class="text-xl font-bold text-gray-800">Profil bearbeiten</h1>
                <button @click="saveProfile" class="text-[#4255FF] font-semibold">Fertig</button>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto px-4 py-6">
            <!-- Avatar -->
            <div class="flex flex-col items-center mb-8">
                <div class="relative">
                    <div class="w-24 h-24 bg-gradient-to-br from-[#4255FF] to-indigo-600 rounded-full flex items-center justify-center text-4xl text-white shadow-lg">
                        {{ userEmoji }}
                    </div>
                    <button class="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                </div>
                <button @click="changeEmoji" class="mt-3 text-sm text-[#4255FF] font-semibold">Emoji ändern</button>
            </div>

            <!-- Form Fields -->
            <div class="space-y-4">
                <div>
                    <label class="text-sm font-medium text-gray-700 mb-2 block">Name</label>
                    <input v-model="userName" type="text" 
                        class="w-full text-gray-800 bg-white rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-[#4255FF] focus:outline-none" />
                </div>

                <div>
                    <label class="text-sm font-medium text-gray-700 mb-2 block">E-Mail</label>
                    <input v-model="userEmail" type="email" 
                        class="w-full text-gray-800 bg-white rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-[#4255FF] focus:outline-none" />
                </div>

                <div>
                    <label class="text-sm font-medium text-gray-700 mb-2 block">Bio</label>
                    <textarea v-model="userBio" rows="4" placeholder="Erzähle etwas über dich..."
                        class="w-full text-gray-800 bg-white rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-[#4255FF] focus:outline-none resize-none"></textarea>
                </div>

                <div>
                    <label class="text-sm font-medium text-gray-700 mb-2 block">Lernziel (Karten pro Tag)</label>
                    <input v-model.number="dailyGoal" type="number" min="1" max="100"
                        class="w-full text-gray-800 bg-white rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-[#4255FF] focus:outline-none" />
                </div>
            </div>

            <!-- Emoji Picker -->
            <div v-if="showEmojiPicker" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showEmojiPicker = false">
                <div class="bg-white rounded-2xl p-6 m-4 max-w-sm w-full" @click.stop>
                    <h3 class="text-lg font-bold text-gray-800 mb-4">Wähle ein Emoji</h3>
                    <div class="grid grid-cols-5 gap-3">
                        <button v-for="emoji in emojiList" :key="emoji" 
                            @click="selectEmoji(emoji)"
                            class="text-4xl p-3 hover:bg-gray-100 rounded-xl active:scale-95 transition">
                            {{ emoji }}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const userName = ref('Max Mustermann')
const userEmail = ref('max@example.com')
const userBio = ref('Lerne fleißig für meine Prüfungen 📚')
const dailyGoal = ref(20)
const userEmoji = ref('👤')
const showEmojiPicker = ref(false)

const emojiList = ['👤', '😀', '🎓', '📚', '🚀', '⭐', '💪', '🎯', '🔥', '✨', '🌟', '💡', '🎨', '🎮', '🏆']

const changeEmoji = () => {
    showEmojiPicker.value = true
}

const selectEmoji = (emoji: string) => {
    userEmoji.value = emoji
    showEmojiPicker.value = false
}

const saveProfile = () => {
    console.log('Saving profile:', {
        name: userName.value,
        email: userEmail.value,
        bio: userBio.value,
        dailyGoal: dailyGoal.value,
        emoji: userEmoji.value
    })
    router.back()
}
</script>

<style scoped>
.active\:scale-95:active {
    transform: scale(0.95);
}
</style>
