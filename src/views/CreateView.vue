<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-3 py-4">
            <div class="flex items-center justify-between">
                <button @click="$router.back()" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 class="text-xl font-bold text-gray-800">{{ $t('create.title') }}</h1>
                <button @click="saveSet" class="text-primary font-semibold" :disabled="isSaving">
                    {{ isSaving ? $t('common.loading') : $t('common.done') }}
                </button>
            </div>
        </header>
        <main class="flex-1 overflow-y-auto pb-30 px-3 py-5">
            <div class="mb-2">
                <input v-model="setTitle" @keydown.enter="focusFirstCardFront" type="text"
                    :placeholder="$t('create.setTitlePlaceholder')"
                    class="w-full text-xl font-bold text-gray-800 bg-white rounded-xl px-3 py-4 border-2 border-gray-200 focus:border-primary focus:outline-none" />
            </div>
            <div class="mb-3">
                <textarea v-model="setDescription" :placeholder="$t('create.descriptionPlaceholder')" rows="3"
                    @keydown.enter.prevent="focusFirstCardFront"
                    class="w-full text-gray-700 bg-white rounded-xl px-3 py-3 border-2 border-gray-200 focus:border-primary focus:outline-none resize-none"></textarea>
            </div>
            <div class="space-y-4">
                <div v-for="(card, index) in cards" :key="index" class="bg-white rounded-xl p-4 shadow-sm">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-sm font-semibold text-gray-500">{{ $t('common.card') }} {{ index + 1
                        }}</span>
                        <button v-if="cards.length > 1" @click="removeCard(index)" class="text-red-500 text-sm">
                            {{ $t('common.delete') }}
                        </button>
                    </div>
                    <div class="space-y-3">
                        <div>
                            <label class="text-xs font-medium text-gray-600 mb-1 block">{{ $t('create.term') }}</label>
                            <input v-model="card.front" :ref="el => setCardFrontRef(el, index)" type="text"
                                :placeholder="$t('create.termPlaceholder')" @keydown.enter="focusCardBack(index)"
                                class="w-full text-gray-800 bg-gray-50 rounded-lg px-3 py-3 border border-gray-200 focus:border-primary focus:outline-none" />
                        </div>
                        <div>
                            <label class="text-xs font-medium text-gray-600 mb-1 block">{{ $t('create.definition')
                            }}</label>
                            <textarea v-model="card.back" :ref="el => setCardBackRef(el, index)"
                                :placeholder="$t('create.definitionPlaceholder')" rows="3"
                                @keydown.enter.exact.prevent="handleBackEnter(index)"
                                class="w-full text-gray-800 bg-gray-50 rounded-lg px-3 py-3 border border-gray-200 focus:border-primary focus:outline-none resize-none"></textarea>
                        </div>
                    </div>
                </div>
                <button @click="addCard"
                    class="w-full bg-white border-2 border-dashed border-gray-300 text-gray-600 font-semibold py-4 rounded-xl active:scale-98 transition flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    {{ $t('create.addCard') }}
                </button>
            </div>
        </main>
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 pt-2 safe-area-inset">
            <button @click="saveSet" :disabled="isSaving"
                class="w-full bg-primary text-white font-bold py-4 rounded-xl active:scale-98 transition disabled:opacity-50">
                {{ isSaving ? $t('common.loading') : `${$t('create.createSet')} (${cards.length} ${$t('common.cards')})`
                }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSetsStore } from '@/stores/sets'

const { t } = useI18n()
const router = useRouter()
const setsStore = useSetsStore()

const setTitle = ref('')
const setDescription = ref('')
const isSaving = ref(false)

interface Card {
    front: string
    back: string
}

const cards = ref<Card[]>([
    { front: '', back: '' },
    { front: '', back: '' }
])

const cardFrontRefs = ref<(HTMLInputElement | null)[]>([])
const cardBackRefs = ref<(HTMLTextAreaElement | null)[]>([])

const setCardFrontRef = (el: any, index: number) => {
    if (el) {
        cardFrontRefs.value[index] = el as HTMLInputElement
    }
}

const setCardBackRef = (el: any, index: number) => {
    if (el) {
        cardBackRefs.value[index] = el as HTMLTextAreaElement
    }
}

const focusFirstCardFront = () => {
    setTimeout(() => {
        cardFrontRefs.value[0]?.focus()
    }, 100)
}

const focusCardBack = (index: number) => {
    setTimeout(() => {
        cardBackRefs.value[index]?.focus()
    }, 100)
}

const handleBackEnter = (index: number) => {
    if (index === cards.value.length - 1) {
        addCard()
        setTimeout(() => {
            cardFrontRefs.value[index + 1]?.focus()
        }, 100)
    } else {
        setTimeout(() => {
            cardFrontRefs.value[index + 1]?.focus()
        }, 100)
    }
}

const addCard = () => {
    cards.value.push({ front: '', back: '' })
}

const removeCard = (index: number) => {
    if (cards.value.length > 1) {
        cards.value.splice(index, 1)
    }
}

const saveSet = async () => {
    if (!setTitle.value.trim()) {
        alert(t('create.enterTitle'))
        return
    }

    const validCards = cards.value.filter(card => card.front.trim() && card.back.trim())

    if (validCards.length === 0) {
        alert(t('create.addAtLeastOneCard'))
        return
    }

    isSaving.value = true
    try {
        await setsStore.createSet({
            title: setTitle.value,
            cards: validCards.map((card, index) => ({
                ...card,
                order: index
            })),
            icon: '📚'
        })

        await setsStore.fetchMySets(true)

        router.push('/library')
    } catch (error) {
        console.error('Error saving set:', error)
        alert(t('create.saveFailed'))
    } finally {
        isSaving.value = false
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

header {
    padding-top: env(safe-area-inset-top);
}

.pb-30 {
    padding-bottom: 120px;
}
</style>
