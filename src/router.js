import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

//views
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Register from '@/components/Register'
import UserBoard from '@/components/UserBoard'
import Admin from '@/components/Admin'

Vue.use(Router)

const router = new Router({
      routes: [
          {
          path: '/',
          name: 'home',
          component: Home
          },
          {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
          },
          {
          path: '/hw',
          name: 'HelloWorld',
          component: HelloWorld
          },
          {
          path: '/login',
          name: 'login',
          component: Login,
          meta: { 
              guest: true
          }
          },
          {
          path: '/register',
          name: 'register',
          component: Register,
          meta: { 
              guest: true
          }
          },
          {
          path: '/userboard',
          name: 'userboard',
          component: UserBoard,
          meta: { 
              requiresAuth: false
          }
          },
          {
          path: '/admin',
          name: 'admin',
          component: Admin,
          meta: { 
              requiresAuth: true,
              is_admin : true
          }
          },
      ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
      if (localStorage.getItem('jwt') == null) {
          next({
              path: '/login',
              params: { nextUrl: to.fullPath }
          })
      } else {
          let user = JSON.parse(localStorage.getItem('user'))
          if(to.matched.some(record => record.meta.is_admin)) {
              if(user.is_admin == 1){
                  next()
              }
              else{
                  next({ name: 'userboard'})
              }
          }else {
              next()
          }
      }
  } else if(to.matched.some(record => record.meta.guest)) {
      if(localStorage.getItem('jwt') == null){
          next()
      }
      else{
          next({ name: 'userboard'})
      }
  }else {
      next() 
  }
})

export default router;