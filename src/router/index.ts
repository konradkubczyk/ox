import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import GameView from '@/views/GameView.vue'
import JoinView from '@/views/JoinView.vue'
import LicensesView from '@/views/LicensesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/game/',
      name: 'game',
      component: GameView
    },
    {
      path: '/join/:sessionId',
      name: 'join',
      component: JoinView
    },
    {
      path: '/licenses',
      name: 'licenses',
      component: LicensesView
    }
  ]
})

export default router
