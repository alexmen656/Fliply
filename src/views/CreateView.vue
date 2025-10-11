<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-4">
            <div class="flex items-center justify-between">
                <button @click="$router.back()" class="text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h1 class="text-xl font-bold text-gray-800">{{ $t('create.title') }}</h1>
                <button @click="saveSet" :class="[
                    'font-semibold px-4 py-2 rounded-lg',
                    canSave ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                ]" :disabled="isSaving || !canSave">
                    {{ isSaving ? $t('common.loading') : $t('common.done') }}
                </button>
            </div>
        </header>
        <main class="flex-1 overflow-y-auto pb-32 px-4 py-6">
            <div class="mb-6">
                <h2 class="text-sm font-semibold text-gray-500 mb-3">{{ $t('create.setInfo') || 'Set-Informationen' }}
                </h2>
                <div class="bg-white rounded-xl p-4 border border-gray-200 space-y-4">
                    <div>
                        <label class="text-sm font-medium text-gray-700 mb-2 block">
                            {{ $t('create.setTitle') || 'Titel' }}
                        </label>
                        <input v-model="setTitle" @keydown.enter="focusDescription" type="text"
                            :placeholder="$t('create.setTitlePlaceholder')"
                            class="w-full text-base text-gray-800 bg-white rounded-lg px-4 py-3 border border-gray-300 focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-700 mb-2 block">
                            {{ $t('create.description') || 'Beschreibung' }}
                            <span class="text-xs text-gray-400 font-normal">({{ $t('common.optional') || 'Optional'
                            }})</span>
                        </label>
                        <textarea v-model="setDescription" ref="descriptionRef"
                            :placeholder="$t('create.descriptionPlaceholder')" rows="2"
                            @keydown.enter.prevent="focusFirstCardFront"
                            class="w-full text-sm text-gray-700 bg-white rounded-lg px-4 py-3 border border-gray-300 focus:border-primary focus:outline-none resize-none"></textarea>
                    </div>
                </div>
            </div>
            <div>
                <div class="flex items-center justify-between mb-3">
                    <h2 class="text-sm font-semibold text-gray-500">{{ $t('create.yourCards') || 'Deine Karten' }}</h2>
                    <span class="text-sm text-gray-600">{{ validCardsCount }} / {{ cards.length }}</span>
                </div>
                <div class="space-y-3">
                    <div v-for="(card, index) in cards" :key="index" class="bg-white rounded-xl border border-gray-200">
                        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                            <span class="text-sm font-medium text-gray-600">{{ $t('common.card') }} {{ index + 1
                            }}</span>
                            <button v-if="cards.length > 1" @click="removeCard(index)"
                                class="text-gray-400 hover:text-red-500">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="p-4 space-y-3">
                            <div>
                                <label class="text-xs font-medium text-gray-500 mb-1 block uppercase">
                                    {{ $t('create.term') }}
                                </label>
                                <input v-model="card.front" :ref="el => setCardFrontRef(el, index)" type="text"
                                    :placeholder="$t('create.termPlaceholder')" @keydown.enter="focusCardBack(index)"
                                    class="w-full text-base text-gray-800 bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-200 focus:border-primary focus:bg-white focus:outline-none" />
                            </div>
                            <div>
                                <label class="text-xs font-medium text-gray-500 mb-1 block uppercase">
                                    {{ $t('create.definition') }}
                                </label>
                                <textarea v-model="card.back" :ref="el => setCardBackRef(el, index)"
                                    :placeholder="$t('create.definitionPlaceholder')" rows="3"
                                    @keydown.enter.exact.prevent="handleBackEnter(index)"
                                    class="w-full text-base text-gray-800 bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-200 focus:border-primary focus:bg-white focus:outline-none resize-none"></textarea>
                            </div>
                        </div>
                    </div>
                    <button @click="addCard"
                        class="w-full bg-white border-2 border-dashed border-gray-300 text-gray-600 font-medium py-4 rounded-xl hover:border-primary hover:text-primary flex items-center justify-center gap-2">
                        <span>{{ $t('create.addCard') }}</span>
                    </button>
                </div>
            </div>
        </main>
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pt-3 pb-6 safe-area-inset">
            <button @click="saveSet" :disabled="isSaving || !canSave" :class="[
                'w-full font-semibold py-4 rounded-xl flex items-center justify-center gap-2',
                canSave ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
            ]">
                <svg v-if="!isSaving" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span v-if="isSaving">{{ $t('common.loading') }}</span>
                <span v-else>{{ $t('create.createSet') }} ({{ validCardsCount }})</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSetsStore } from '@/stores/sets'

const { t } = useI18n()
const router = useRouter()
const setsStore = useSetsStore()

const setTitle = ref('')
const setDescription = ref('')
const isSaving = ref(false)
const descriptionRef = ref<HTMLTextAreaElement | null>(null)

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

const isCardValid = (card: Card) => {
    return card.front.trim() !== '' && card.back.trim() !== ''
}

const validCardsCount = computed(() => {
    return cards.value.filter(card => isCardValid(card)).length
})

const canSave = computed(() => {
    return setTitle.value.trim() !== '' && validCardsCount.value > 0
})

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

const focusDescription = () => {
    setTimeout(() => {
        descriptionRef.value?.focus()
    }, 100)
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

    const validCards = cards.value.filter(card => isCardValid(card))

    if (validCards.length === 0) {
        alert(t('create.addAtLeastOneCard'))
        return
    }

    isSaving.value = true
    try {
        await setsStore.createSet({
            title: setTitle.value,
            description: setDescription.value,
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

header {
    padding-top: env(safe-area-inset-top);
}

.pb-32 {
    padding-bottom: 128px;
}
</style>
