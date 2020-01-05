export default [
  {
    name: 'home',
    path: '/',
    component: () => import('./components/page/home/index.vue'),
  },
  {
    name: 'doc',
    path: '/doc/:name',
    component: () => import('./components/page/doc/index.vue'),
  },

  // compatiable with old /about link
  {
    path: '/about',
    redirect: {name: 'doc', params: {name: 'about'}},
  },
]
