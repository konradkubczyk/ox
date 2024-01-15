import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import HomeView from '@/views/HomeView.vue'
import GameView from '@/views/GameView.vue'
import JoinView from '@/views/JoinView.vue'
import LicensesView from '@/views/LicensesView.vue'
import PageNotFoundView from '@/views/PageNotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/join/:sessionId',
      name: 'join',
      component: JoinView
    },
    {
      path: '/game/',
      name: 'game',
      component: GameView,
      beforeEnter: (to, from, next) => {
        const sessionStore = useSessionStore()
        if (!sessionStore.sessionId) next({ name: 'home' })
        else next()
      }
    },
    {
      path: '/join',
      redirect: { name: 'home' }
    },
    {
      path: '/licenses',
      name: 'licenses',
      component: LicensesView
    },
    {
      path: '/:pathMatch(.*)*',
      component: PageNotFoundView
    }
  ]
})

export default router
