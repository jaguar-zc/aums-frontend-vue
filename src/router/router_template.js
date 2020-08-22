/* Layout */
import Layout from '@/layout'

import {getMenu} from '@/utils/auth'

const m = [
    {
        "id": "1",
        "key": "HOME",
        "title": "工作台",
        "icon": "dashboard",
        "children": []
    },
    {
        "id": "2",
        "key": "SYS",
        "title": "系统设置",
        "icon": "el-icon-s-help",
        "children": [
            {
                "id": "3",
                "key": "SYS_USER",
                "title": "用户管理",
                "icon": "table",
                "children": null
            },
            {
                "id": "5",
                "key": "SYS_ROLE",
                "title": "角色管理",
                "icon": "form",
                "children": null
            },
            {
                "id": "4",
                "key": "SYS_DEPT",
                "title": "部门管理",
                "icon": "table",
                "children": null
            },
            {
                "id": "7",
                "key": "SYS_DICT",
                "title": "字典管理",
                "icon": "tree",
                "children": null
            },
            {
                "id": "6",
                "key": "SYS_RESOURCE",
                "title": "资源管理",
                "icon": "tree",
                "children": null
            }
        ]
    }
]




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
      meta: { title: '工作台', icon: 'dashboard' }
    }]
  },
  
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/user',
    name: 'SYS',
    meta: { title: '系统设置', icon: 'el-icon-setting' },
    children: [
      {
        path: 'user',
        name: 'SYS_USER',
        component: () => import('@/views/setting/user/index'),
        meta: { title: '用户管理', icon: 'table' }
      },
      {
        path: 'role',
        name: 'SYS_ROLE',
        component: () => import('@/views/setting/user/index'),
        meta: { title: '角色管理', icon: 'tree' }
      },
      {
        path: 'dept',
        name: 'SYS_DEPT',
        component: () => import('@/views/setting/user/index'),
        meta: { title: '部门管理', icon: 'tree' }
      },
      {
        path: 'dict',
        name: 'SYS_DICT',
        component: () => import('@/views/setting/user/index'),
        meta: { title: '字典管理', icon: 'tree' }
      },
      {
        path: 'resource',
        name: 'SYS_RESOURCE',
        component: () => import('@/views/setting/user/index'),
        meta: { title: '资源管理', icon: 'tree' }
      }
    ]
  }]

  export function meunList(){
      let m = new Array() 
      let userMenu = JSON.parse(getMenu()) 
      for (let i in defaultMenuList){
        let menu = defaultMenuList[i]
        if(menu.children.length <= 1){//单菜单判断了权限直接加入进去
          if(f(menu.name,userMenu)){
            m.push(menu)
          }
        }else{// 有多个子菜单的 需要判断子菜单
          if(f(menu.name,userMenu)){//先判断有无主菜单权限
            let childrenTrem = menu;
            childrenTrem.children = [];
            for (let j in  menu.children){
              let jmenu = menu.children[j]
              if(f(jmenu.name,userMenu)){
                childrenTrem.push(jmenu)
              }
            }
            m.push(childrenTrem)
          }
        }
      }  
      return m;
  } 
  function f(name,userMenu){
    for(var i in userMenu) {
      if(userMenu[i].key === name){
          return true;
      }
    } 
    return false; 
  }