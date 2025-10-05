import { useNotificationsStore } from '@/stores/notifications'

export const NotificationHelpers = {
  addStreakNotification(days: number) {
    const store = useNotificationsStore()
    store.addNotification({
      title: `${days}-Tage-Streak!`,
      message: `Glückwunsch! Du lernst jetzt ${days} Tage am Stück!`,
      time: 'gerade eben',
      icon: 'fire',
      read: false,
      link: '/profile',
    })
  },
  addGoalCompletedNotification(cardsLearned: number) {
    const store = useNotificationsStore()
    store.addNotification({
      title: 'Tagesziel erreicht!',
      message: `Du hast heute ${cardsLearned} Karten gelernt - gut gemacht!`,
      time: 'gerade eben',
      icon: 'check',
      read: false,
      link: '/profile',
    })
  },
  addReviewReminderNotification(setTitle: string, setId: number) {
    const store = useNotificationsStore()
    store.addNotification({
      title: 'Wiederholung fällig',
      message: `Das Set "${setTitle}" sollte wiederholt werden`,
      time: 'gerade eben',
      icon: 'clock',
      read: false,
      link: `/set/${setId}`,
    })
  },
  addBadgeUnlockedNotification(badgeName: string, badgeCount: number = 1) {
    const store = useNotificationsStore()
    const message =
      badgeCount === 1
        ? `Du hast den Badge "${badgeName}" freigeschaltet!`
        : `Du hast ${badgeCount} neue Badges freigeschaltet!`

    store.addNotification({
      title: 'Neuer Badge!',
      message,
      time: 'gerade eben',
      icon: 'badge',
      read: false,
      link: '/profile',
    })
  },
  addNewRecordNotification(cardsLearned: number) {
    const store = useNotificationsStore()
    store.addNotification({
      title: 'Neuer Rekord!',
      message: `Du hast heute ${cardsLearned} Karten gelernt - dein bester Tag!`,
      time: 'gerade eben',
      icon: 'trophy',
      read: false,
      link: '/profile',
    })
  },
  addCustomNotification(title: string, message: string, icon: string, link?: string) {
    const store = useNotificationsStore()
    store.addNotification({
      title,
      message,
      time: 'gerade eben',
      icon,
      read: false,
      link,
    })
  },
}
