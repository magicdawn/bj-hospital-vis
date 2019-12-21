export default [
  {
    name: 'home',
    path: '/',
    component: () => import('./components/page/home/index.vue'),
  },
  {
    name: 'about',
    path: '/about',
    component: () => import('./components/page/about/index.vue'),
  },
]
