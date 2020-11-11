export const routes = [
  {
    path: '/(login)?',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('../views/homeChildren/Index.vue')
      }
    ]
  },
  {
    path: '/doc',
    name: 'doc',
    component: () => import('../views/Doc.vue')
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/Doc.vue')
  },
  {
    path: '*',
    component: () => import('../views/errors/404.vue')
  }
]
