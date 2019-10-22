import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import { firestorePlugin } from 'vuefire'

import config from './views/config';

import Login from './views/Login.vue';
import Home from './views/Home.vue';
import Signup from './views/Signup.vue';

import Users from './views/Users.vue'
import Dependencies from './views/Dependencies.vue'

Vue.use(VueRouter);
Vue.use(firestorePlugin);

Vue.config.productionTip = false


const routes = [
  { path: '/', component: Login },
  {
    path: '/home', component: Home,
    children: [
      { path: '/users', component: Users, },
      { path: '/dependencies', component: Dependencies, },

    ]

  },
  { path: '/signup', component: Signup },

  { path: '*', redirect: '/' },
];

const router = new VueRouter({ routes });

router.beforeEach((to, from, next) => {

  const publicPages = ['/', '/register', '/signup'];
  let validUser = localStorage.getItem('user');
  let viewIsPrivate = !publicPages.includes(to.path);

  if (!validUser && viewIsPrivate) {
    next('/');
  } else if (!viewIsPrivate && validUser) {
    next('/dependencies');
  } else {
    next();
  }
})


if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

new Vue({
  el: '#app',
  vuetify,
  router,
  data: {
    validUser: true
  },
  render: h => h(App)
}).$mount('#app')
