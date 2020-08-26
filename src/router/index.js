import Vue from 'vue'
import Router from 'vue-router'
import { defaultMenuList, getUserMenuList } from '@/router/router_template'
Vue.use(Router)
import ApiDoc from '@/components/ApiDoc'
/* Layout */
import Layout from '@/layout'

/**
 * 发
 */
const hidenRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]


const suffixRouter = [
  {
    path: '/api',
    component: Layout,
    redirect: '/api/apidoc',
    children: [{
      path: 'apidoc',
      name: 'API文档',
      component: ApiDoc,
      meta: { title: 'API文档', icon: 'el-icon-question',  affix: true }
    }]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' , affix: true }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]



const createRouter = () => {
  let list = getUserMenuList();
  let mergeRouters = hidenRoutes.concat(list, suffixRouter) 
  return new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: mergeRouters
  })
}

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
