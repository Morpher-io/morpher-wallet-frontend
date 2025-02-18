import { createRouter, createWebHistory } from 'vue-router'
import { useWalletStore } from '@/stores/wallet'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "Login" */ '../views/Login.vue'),
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import(/* webpackChunkName: "Signup" */ '../views/Signup.vue'),
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import(/* webpackChunkName: "Settings" */ '../views/Settings.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/settings/email',
      name: 'EmailSettings',
      component: () => import(/* webpackChunkName: "EmailSettings" */ '../views/EmailSettings.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/settings/password',
      name: 'PasswordSettings',
      component: () => import(/* webpackChunkName: "PasswordSettings" */ '../views/PasswordSettings.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/settings/2fa',
      name: 'TwoFactorSettings',
      component: () => import(/* webpackChunkName: "TwoFactorSettings" */ '../views/TwoFactorSettings.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/settings/keys',
      name: 'KeysSettings',
      component: () => import(/* webpackChunkName: "KeysSettings" */ '../views/KeysSettings.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/settings/recovery',
      name: 'RecoverySettings',
      component: () => import(/* webpackChunkName: "RecoverySettings" */ '../views/RecoverySettings.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/settings/delete',
      name: 'DeleteSettings',
      component: () => import(/* webpackChunkName: "DeleteSettings" */ '../views/DeleteSettings.vue'), //: DeleteSettings,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/recovery',
      name: 'Recovery',
      component: () => import(/* webpackChunkName: "Recovery" */ '../views/Recovery.vue'),
    },
    {
      path: '/2fa',
      name: 'TwoFA',
      component: () => import(/* webpackChunkName: "TwoFA" */ '../views/TwoFA.vue'),
      meta: {
        requires2fa: true
      }
    },
    {
      path: '/unlock',
      name: 'Unlock',
      component: () => import(/* webpackChunkName: "Unlock" */ '../views/Unlock.vue'),
    },
    {
      path: '/signtx',
      name: 'SignTx',
      component: () => import(/* webpackChunkName: "SignTx" */ '../views/SignTx.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signmsg',
      name: 'SignMsg',
      component: () => import(/* webpackChunkName: "SignMsg" */ '../views/SignMsg.vue'), 
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/',
      name: 'Wallet',
      component: () => import(/* webpackChunkName: "Wallet" */ '../views/Wallet.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const store = useWalletStore()
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    
    
    if (to.query && to.query.code) {
      next()
      return
    }
    if (store.isLoggedIn) {
      if (store.redirectPath) {
        const path = store.redirectPath
        store.setRedirect('')
        next(path)
      } else {
        next()
      }

      return
    }
    if (to.path && to.path !== '/') {
      store.setRedirect(to.path)
    }

    if (store.twoFaRequired && (store.twoFaRequired.email || store.twoFaRequired.authenticator)) {
      next('/2fa')
      return
    }

    
    if (store.email) {
      store.loadEncryptedSeed()

      next('/unlock')
      return
    }
    next('/login')
  } else if (to.matched.some((record) => record.meta.requires2fa)) {
    if (store.twoFaRequired) {
      next()
      return
    }
    if (store.isLoggedIn) {
      next('/')
      return
    }

    next('/login')
  } else {
    next()
  }
})

export default router
