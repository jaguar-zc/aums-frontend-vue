/* Layout */
import Layout from '@/layout'

import { getKeys } from '@/utils/auth'


export const defaultMenuList = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'HOME',
    children: [{
      path: 'dashboard',
      name: 'HOME',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '工作台', icon: 'dashboard', affix: true }
    }]
  },

  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/user',
    name: 'SYS',
    meta: { title: '系统设置', icon: 'el-icon-setting', affix: true  },
    children: [
      {
        path: 'app',
        name: 'SYS_APP', 
        component: () => import('@/views/setting/app/index'),
        meta: { title: '应用管理', icon: 'el-icon-goods', affix: true  }
      },
      {
        path: 'user',
        name: 'SYS_USER', 
        component: () => import('@/views/setting/user/index'),
        meta: { title: '用户管理', icon: 'el-icon-user', affix: true  }
      },
      {
        path: 'role',
        name: 'SYS_ROLE', 
        component: () => import('@/views/setting/role/index'),
        meta: { title: '角色管理', icon: 'el-icon-view', affix: true  }
      },
      {
        path: 'dept',
        name: 'SYS_DEPT', 
        component: () => import('@/views/setting/dept/index'),
        meta: { title: '部门管理', icon: 'el-icon-orange', affix: true  }
      },
      {
        path: 'dict', 
        name: 'SYS_DICT',
        component: () => import('@/views/setting/dict/index'),
        meta: { title: '字典管理', icon: 'el-icon-notebook-2' , affix: true }
      },
      {
        path: 'resource',
        name: 'SYS_RESOURCE', 
        component: () => import('@/views/setting/resource/index'),
        meta: { title: '资源管理', icon: 'el-icon-menu', affix: true  }
      } 
    ]
  }, 
  {
    path: '/ops',
    component: Layout,
    redirect: '/ops/logs',
    name: 'OPS',
    meta: { title: '运维工具', icon: 'el-icon-cloudy-and-sunny', affix: true },
    children: [
      {
        path: 'logs',
        name: 'OPS_LOGS', 
        component: () => import('@/views/ops/logs/index'),
        meta: { title: '日志管理', icon: 'el-icon-eleme' , affix: true }
      },
      {
        path: 'monitor',
        name: 'OPS_MONITOR',
        component: () => import('@/views/ops/monitor/index'),
        meta: { title: 'JVM监控', icon: 'el-icon-cpu' , affix: true }
      }
    ]
  }

]

export function getUserMenuList() {
  let ownMenu = new Array()
  let keys = getKeys()

  for (let i in defaultMenuList) {
    const menu = defaultMenuList[i]
    if (keys.indexOf(menu.name) != -1) {//先判断有无主菜单权限 
      if (menu.children.length <= 1) {//单菜单判断了权限直接加入进去
        let item =  createMeunItem(menu, 1)
        item.children.push(createMeunItem(menu.children[0], 2))
        ownMenu.push(item) 
      } else {// 有多个子菜单的 需要判断子菜单 
        var itemChildren = createMeunItem(menu, 1);
        for (let j in menu.children) {
          let jmenu = menu.children[j]
          if (keys.indexOf(jmenu.name) != -1) {//判断有无子菜单权限
            itemChildren.children.push(createMeunItem(jmenu, 2))
          }
        }
        ownMenu.push(itemChildren)
      }
    }
  }
  return ownMenu;
}


function createMeunItem(source, level) {
  let menu = {}
  menu['path'] = source.path;
  menu['name'] = source.name;
  menu['component'] = source.component;
  if (source.meta != null) {
    menu['meta'] = source.meta;
  }
  if (level == 1) {
    menu['redirect'] = source.redirect;
    menu['children'] = new Array();
  }
  return menu;
}
