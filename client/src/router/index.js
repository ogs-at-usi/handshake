import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      layout: true,
    },
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
  {
    path: '/signup',
    name: 'Signup',
    meta: {
      layout: true,
    },
    component: () =>
      import(/* webpackChunkName: "signup" */ '../views/Signup.vue'),
  },
  {
    path: '/',
    name: 'AppContainer',
    meta: {
      // variable that indicates that this route requires authentication
      requiresAuth: true,
    },
    component: () =>
      import(/* webpackChunkName: "container" */ '../views/AppContainer.vue'),
  },
  {
    path: '/about',
    name: 'AboutUs',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/AboutUs.vue'),
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
router.beforeEach(async (to, from, next) => {
  await store.restored;
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
