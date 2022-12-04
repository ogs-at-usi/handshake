import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () =>
      import(/* webpackChunkName: "signup" */ '../views/Signup.vue'),
  },
  {
    path: '/',
    name: 'app',
    meta: {
      // variable that indicates that this route requires authentication
      requiresAuth: true,
    },
    component: () =>
      import(/* webpackChunkName: "home" */ '../views/AppContainer.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

/**
 * Middleware to check if user is authenticated before accessing a route
 */
router.beforeEach((to, from, next) => {
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !store.getters.isLoggedIn
  ) {
    next('/login');
  } else {
    next();
  }
});

export default router;
