import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LibraryView from '../views/LibraryView.vue'
import CreateView from '../views/CreateView.vue'
import ProfileView from '../views/ProfileView.vue'
import SetDetailView from '../views/SetDetailView.vue'
import FlashcardView from '../views/FlashcardView.vue'
import QuizView from '../views/QuizView.vue'
import MatchView from '../views/MatchView.vue'
import LearnView from '../views/LearnView.vue'
import AllCardsView from '../views/AllCardsView.vue'
import EditSetView from '../views/EditSetView.vue'
import EditProfileView from '../views/EditProfileView.vue'
import ExpertSetsView from '../views/ExpertSetsView.vue'
import AvatarShopView from '../views/AvatarShopView.vue'
import AchievementsView from '../views/AchievementsView.vue'
import CoinHistoryView from '../views/CoinHistoryView.vue'
import StatsView from '../views/StatsView.vue'
import NotificationsView from '../views/settings/NotificationsView.vue'
import GoalsView from '../views/settings/GoalsView.vue'
import AppearanceView from '../views/settings/AppearanceView.vue'
import HelpView from '../views/settings/HelpView.vue'
import OnboardingView from '../views/OnboardingView.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: OnboardingView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/library',
      name: 'library',
      component: LibraryView,
    },
    {
      path: '/expert-sets',
      name: 'expert-sets',
      component: ExpertSetsView,
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/set/:id',
      name: 'set-detail',
      component: SetDetailView,
    },
    {
      path: '/flashcards/:id',
      name: 'flashcards',
      component: FlashcardView,
    },
    {
      path: '/quiz/:id',
      name: 'quiz',
      component: QuizView,
    },
    {
      path: '/match/:id',
      name: 'match',
      component: MatchView,
    },
    {
      path: '/learn/:id',
      name: 'learn',
      component: LearnView,
    },
    {
      path: '/set/:id/cards',
      name: 'all-cards',
      component: AllCardsView,
    },
    {
      path: '/edit-set/:id',
      name: 'edit-set',
      component: EditSetView,
    },
    {
      path: '/edit-profile',
      name: 'edit-profile',
      component: EditProfileView,
    },
    {
      path: '/avatar-shop',
      name: 'avatar-shop',
      component: AvatarShopView,
    },
    {
      path: '/achievements',
      name: 'achievements',
      component: AchievementsView,
    },
    {
      path: '/coin-history',
      name: 'coin-history',
      component: CoinHistoryView,
    },
    {
      path: '/stats',
      name: 'stats',
      component: StatsView,
    },
    {
      path: '/settings/notifications',
      name: 'notifications',
      component: NotificationsView,
    },
    {
      path: '/settings/goals',
      name: 'goals',
      component: GoalsView,
    },
    {
      path: '/settings/appearance',
      name: 'appearance',
      component: AppearanceView,
    },
    {
      path: '/settings/help',
      name: 'help',
      component: HelpView,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const needsOnboarding = await userStore.checkOnboardingStatus()

  if (needsOnboarding && to.path !== '/onboarding') {
    next('/onboarding')
  } else if (!needsOnboarding && to.path === '/onboarding') {
    next('/home')
  } else {
    next()
  }
})

export default router
