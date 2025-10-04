import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Notification {
  id: number
  title: string
  message: string
  time: string
  icon: string
  read: boolean
  link?: string
}

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([
    {
      id: 1,
      title: 'Neuer Lernrekord! 🎉',
      message: 'Du hast heute 50 Karten gelernt - dein bester Tag!',
      time: 'vor 5 Minuten',
      icon: '🏆',
      read: false,
      link: '/profile',
    },
    {
      id: 2,
      title: 'Wiederholung fällig',
      message: 'Das Set "Deutsch Vokabeln A2" sollte wiederholt werden',
      time: 'vor 1 Stunde',
      icon: '⏰',
      read: false,
      link: '/set/2',
    },
    {
      id: 3,
      title: 'Neue Badges freigeschaltet',
      message: 'Du hast 2 neue Erfolge erreicht!',
      time: 'vor 3 Stunden',
      icon: '🎖️',
      read: false,
      link: '/profile',
    },
    {
      id: 4,
      title: 'Tagesziel erreicht ✓',
      message: 'Glückwunsch! Du hast dein Tagesziel von 30 Karten erreicht.',
      time: 'gestern',
      icon: '✅',
      read: true,
      link: '/profile',
    },
    {
      id: 5,
      title: 'Streak aufrechterhalten!',
      message: 'Du lernst jetzt 7 Tage am Stück - weiter so!',
      time: 'vor 2 Tagen',
      icon: '🔥',
      read: true,
      link: '/profile',
    },
  ])

  const unreadCount = computed(() => {
    return notifications.value.filter((n) => !n.read).length
  })

  function markAsRead(id: number) {
    const notification = notifications.value.find((n) => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  function markAllAsRead() {
    notifications.value.forEach((n) => (n.read = true))
  }

  function addNotification(notification: Omit<Notification, 'id'>) {
    const newId = Math.max(...notifications.value.map((n) => n.id), 0) + 1
    notifications.value.unshift({
      ...notification,
      id: newId,
    })
  }

  function removeNotification(id: number) {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
  }
})
