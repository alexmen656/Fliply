import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Preferences } from '@capacitor/preferences'

export interface CoinTransaction {
  id: string
  amount: number
  reason: string
  timestamp: string
  type: 'earned' | 'spent'
}

export const useCoinHistoryStore = defineStore('coinHistory', () => {
  const transactions = ref<CoinTransaction[]>([])

  const loadFromStorage = async () => {
    try {
      const { value } = await Preferences.get({ key: 'fliply_coin_history' })
      if (value) {
        transactions.value = JSON.parse(value)
      }
    } catch (e) {
      console.error('Error loading coin history:', e)
    }
  }

  const saveToStorage = async () => {
    try {
      await Preferences.set({
        key: 'fliply_coin_history',
        value: JSON.stringify(transactions.value),
      })
    } catch (e) {
      console.error('Error saving coin history:', e)
    }
  }

  const addTransaction = async (amount: number, reason: string, type: 'earned' | 'spent') => {
    const transaction: CoinTransaction = {
      id: Date.now().toString(),
      amount,
      reason,
      timestamp: new Date().toISOString(),
      type,
    }
    transactions.value.unshift(transaction)
    await saveToStorage()
  }

  const getRecentTransactions = (limit: number = 10) => {
    return transactions.value.slice(0, limit)
  }

  const getTotalEarned = () => {
    return transactions.value
      .filter((t) => t.type === 'earned')
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getTotalSpent = () => {
    return transactions.value
      .filter((t) => t.type === 'spent')
      .reduce((sum, t) => sum + t.amount, 0)
  }

  return {
    transactions,
    loadFromStorage,
    saveToStorage,
    addTransaction,
    getRecentTransactions,
    getTotalEarned,
    getTotalSpent,
  }
})
