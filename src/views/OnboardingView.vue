<template>
    <div class="flex flex-col h-screen bg-gradient-to-br from-[#4255FF] to-[#3142CC]">
        <div v-if="currentStep === 0" class="flex-1 flex flex-col items-center justify-center px-6 text-white">
            <div class="w-full max-w-md">
                <div class="text-center mb-8">
                    <svg class="w-24 h-24 mx-auto mb-6 text-white" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                    </svg>
                    <h1 class="text-4xl font-bold mb-4">{{ $t('onboarding.welcome') }}</h1>
                    <p class="text-lg text-blue-100">{{ $t('onboarding.getToKnow') }}</p>
                </div>

                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
                    <label class="block text-sm font-semibold mb-3">{{ $t('onboarding.whatToCallYou') }}</label>
                    <input v-model="userName" type="text" :placeholder="$t('onboarding.yourName')"
                        class="w-full bg-white text-gray-800 rounded-xl px-4 py-4 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                        @keyup.enter="nextStep" />
                </div>

                <button @click="nextStep" :disabled="!userName.trim()" :class="[
                    'w-full py-4 rounded-xl font-bold text-lg transition',
                    userName.trim()
                        ? 'bg-white text-primary active:scale-95'
                        : 'bg-white/30 text-white/50 cursor-not-allowed'
                ]">
                    {{ $t('onboarding.continue') }}
                </button>
            </div>
        </div>
        <div v-if="currentStep === 1" class="flex-1 flex flex-col items-center justify-center px-6 text-white">
            <div class="w-full max-w-md">
                <div class="text-center mb-8">
                    <svg class="w-24 h-24 mx-auto mb-6 text-white" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h2 class="text-3xl font-bold mb-2">{{ $t('onboarding.setupProfile') }}</h2>
                    <p class="text-blue-100">{{ $t('onboarding.addEmailOptional') }}</p>
                </div>
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
                    <label class="block text-sm font-semibold mb-3">{{ $t('onboarding.emailOptional') }}</label>
                    <input v-model="userEmail" type="email" :placeholder="$t('onboarding.yourEmail')"
                        class="w-full bg-white text-gray-800 rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50" />
                    <p class="text-xs text-blue-100 mt-2">{{ $t('onboarding.emailReason') }}</p>
                </div>

                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
                    <div class="flex items-start gap-3 text-left">
                        <svg class="w-8 h-8 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        <div>
                            <h4 class="font-semibold">{{ $t('onboarding.avatarsTitle') }}</h4>
                            <p class="text-sm text-blue-100">{{ $t('onboarding.avatarsDescription') }}</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-3">
                    <button @click="saveProfile"
                        class="w-full bg-white text-primary py-4 rounded-xl font-bold text-lg active:scale-95 transition">
                        Weiter
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
                    <svg class="w-24 h-24 mx-auto mb-6 text-white" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <h2 class="text-3xl font-bold mb-4">Deine Startseite</h2>
                    <p class="text-lg text-blue-100 mb-8">
                        Hier findest du deine eigenen Lernsets und von Experten erstellte Sets.
                        Scrolle horizontal, um alle Sets zu sehen!
                    </p>
                    <div class="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-left">
                        <div class="flex items-start gap-3 mb-3">
                            <svg class="w-8 h-8 text-white flex-shrink-0" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <div>
                                <h4 class="font-semibold">My Sets</h4>
                                <p class="text-sm text-blue-100">Deine selbst erstellten Lernsets</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <svg class="w-8 h-8 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
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
                    class="w-full bg-white text-primary py-4 rounded-xl font-bold text-lg active:scale-95 transition">
                    {{ $t('onboarding.continue') }}
                </button>
            </div>
        </div>
        <div v-if="currentStep === 2" class="flex-1 flex flex-col">
            <div class="flex-1 flex flex-col items-center justify-center px-6 text-white">
                <div class="w-full max-w-md text-center">
                    <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 space-y-4">
                        <div class="flex items-start gap-3">
                            <div>
                                <h4 class="font-semibold">{{ $t('onboarding.expertSetsTitle') }}</h4>
                                <p class="text-sm text-blue-100">{{ $t('onboarding.expertSetsDescription') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-6 pb-8">
                <button @click="nextStep"
                    class="w-full bg-white text-primary py-4 rounded-xl font-bold text-lg active:scale-95 transition">
                    {{ $t('onboarding.continue') }}
                </button>
            </div>
        </div>
        <div v-if="currentStep === 3" class="flex-1 flex flex-col">
            <div class="flex-1 flex flex-col items-center justify-center px-6 text-white">
                <div class="w-full max-w-md text-center">
                    <svg class="w-24 h-24 mx-auto mb-6 text-white" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <h2 class="text-3xl font-bold mb-4">{{ $t('onboarding.createSets') }}</h2>
                    <p class="text-lg text-blue-100 mb-8">
                        {{ $t('onboarding.createSetsDescription') }}
                    </p>
                    <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-left space-y-4">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">1
                            </div>
                            <p class="text-sm">{{ $t('onboarding.step1') }}</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">2
                            </div>
                            <p class="text-sm">{{ $t('onboarding.step2') }}</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">3
                            </div>
                            <p class="text-sm">{{ $t('onboarding.step3') }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-6 pb-8">
                <button @click="nextStep"
                    class="w-full bg-white text-primary py-4 rounded-xl font-bold text-lg active:scale-95 transition">
                    {{ $t('onboarding.continue') }}
                </button>
            </div>
        </div>
        <div v-if="currentStep === 4" class="flex-1 flex flex-col">
            <div class="flex-1 flex flex-col items-center justify-center px-6 text-white">
                <div class="w-full max-w-md text-center">
                    <svg class="w-24 h-24 mx-auto mb-6 text-white" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 class="text-3xl font-bold mb-4">{{ $t('onboarding.learnAndStreak') }}</h2>
                    <p class="text-lg text-blue-100 mb-8">
                        {{ $t('onboarding.learnAndStreakDescription') }}
                    </p>
                    <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6 space-y-4">
                        <div class="flex items-start gap-3 text-left">
                            <svg class="w-8 h-8 text-orange-300 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M12 2c1.3 0 2.4.6 3.2 1.5.9 1 1.4 2.3 1.4 3.8 0 1.8-.7 3.3-1.8 4.5.3.4.5.8.6 1.3.2.9.1 1.7-.2 2.5-.4.8-1 1.5-1.7 2-.7.5-1.5.8-2.4.8s-1.7-.3-2.4-.8c-.7-.5-1.3-1.2-1.7-2-.3-.8-.4-1.6-.2-2.5.1-.5.3-.9.6-1.3C6.3 10.6 5.6 9.1 5.6 7.3c0-1.5.5-2.8 1.4-3.8C7.8 2.6 8.9 2 10.2 2h1.6zm0 2h-1.6c-.8 0-1.5.3-2.1.9-.5.5-.8 1.2-.8 2 0 1.3.5 2.4 1.4 3.2.2.2.3.4.3.7 0 .3-.1.5-.3.7-.5.4-.8 1-.9 1.6-.1.6 0 1.2.3 1.7.2.5.6.9 1 1.2.4.3.9.5 1.5.5s1.1-.2 1.5-.5c.4-.3.7-.7 1-1.2.3-.5.4-1.1.3-1.7-.1-.6-.4-1.2-.9-1.6-.2-.2-.3-.4-.3-.7 0-.3.1-.5.3-.7.9-.8 1.4-1.9 1.4-3.2 0-.8-.3-1.5-.8-2-.6-.6-1.3-.9-2.1-.9z" />
                            </svg>
                            <div>
                                <h4 class="font-semibold">{{ $t('onboarding.dailyStreak') }}</h4>
                                <p class="text-sm text-blue-100">{{ $t('onboarding.dailyStreakDescription') }}</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3 text-left">
                            <svg class="w-8 h-8 text-white flex-shrink-0" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <div>
                                <h4 class="font-semibold">{{ $t('onboarding.flashcardsTitle') }}</h4>
                                <p class="text-sm text-blue-100">{{ $t('onboarding.flashcardsDescription') }}</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3 text-left">
                            <svg class="w-8 h-8 text-yellow-300 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                            <div>
                                <h4 class="font-semibold">{{ $t('onboarding.achievementsTitle') }}</h4>
                                <p class="text-sm text-blue-100">{{ $t('onboarding.achievementsDescription') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-6 pb-8">
                <button @click="finishOnboarding"
                    class="w-full bg-white text-primary py-4 rounded-xl font-bold text-lg active:scale-95 transition flex items-center justify-center gap-2">
                    <span>{{ $t('onboarding.getStarted') }}</span>
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
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

const nextStep = async () => {
    if (currentStep.value === 0 && userName.value.trim()) {
        await userStore.setName(userName.value.trim())
        currentStep.value++
        await userStore.setOnboardingStep(currentStep.value)
    } else if (currentStep.value > 0) {
        currentStep.value++
        await userStore.setOnboardingStep(currentStep.value)
    }
}

const saveProfile = async () => {
    if (userEmail.value.trim()) {
        await userStore.updateProfile({
            email: userEmail.value.trim()
        })
    }
    await nextStep()
}

const skipProfile = async () => {
    await nextStep()
}

const finishOnboarding = async () => {
    await userStore.completeOnboarding()
    router.push('/home')
}
</script>

<style scoped>
.active\:scale-95:active {
    transform: scale(0.95);
}
</style>
