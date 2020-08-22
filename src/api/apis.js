import { get, post, put, del, patch } from './http';

export function login(data) {
  return post('/login',data)
}

export function logout() {
  return post('/logout')
}

//用户接口
export function listUser( data) {
  return get('/system/user',data)
}
export function currentUserInfo() {
  return get('/system/user/info')
} 
export function addUser( data) {
  return post('/system/user',data)
} 
export function getUserById( ID) {
  return get('/system/user/'+ID)
} 
export function updateUserPwd( data) {
  return put('/system/user/updatePwd',data)
} 
export function updateUserPhone( data) {
  return put('/system/user/updatePhone',data)
} 

//角色接口
export function listRole( data) {
  return get('/system/role',data)
}
export function addRole( data) {
  return post('/system/role',data)
}
export function updateRole( data) {
  return put('/system/role',data)
}
export function deleteRole( id) {
  return del('/system/role/'+id)
}

//部门接口
export function listDept( data) {
  return get('/system/dept',data)
}
export function addDept( data) {
  return post('/system/dept',data)
}
export function updateDept( data) {
  return put('/system/dept',data)
}
export function deleteDept( id) {
  return del('/system/dept/'+id)
}
export function listDeptMembers(id) {
  return get('/system/dept/members',{deptId: id})
} 


//资源接口 GET /api/v1/system/resource

export function listResource( data) {
  return get('/system/resource',data)
}
export function addResource( data) {
  return post('/system/resource',data)
}
export function updateResource( data) {
  return put('/system/resource',data)
}
export function deleteResource( id) {
  return del('/system/resource/'+id)
}
export function getResourceMenu( data) {
  return get('/system/resource/menu',data)
} 