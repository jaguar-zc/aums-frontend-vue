import { get, post, put, del, patch } from './http';

export function login(data) {
  return post('/login',data)
}

export function logout() {
  return get('/logout')
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
export function updateUser( data) {
  return put('/system/user',data)
} 
export function deleteUser( id) {
  return del('/system/user/'+id)
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


export function listResourceLazy( data) {
  return get('/system/resource/lazy',data)
}
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

export function getResourceListByRoleId( id) {
  return get('/system/resource/role/'+id,{})
} 

//资源接口 GET /api/v1/system/dict
export function listDictType(data) {
  return get('/system/dict/type_list',data)
}
export function listDictValue( data) {
  return get('/system/dict/value_list',data)
}
export function addDictType( data) {
  return post('/system/dict/type',data)
}
export function addDictValue( data) {
  return post('/system/dict/value',data)
}  
export function updateDictType( data) {
  return put('/system/dict/type',data)
}
export function deleteDictType( id) {
  return del('/system/dict/type/'+id)
} 
export function deleteDictValue( id) {
  return del('/system/dict/value/'+id)
} 


//资源接口 GET /api/v1/system/dict
export function listApp( data) {
  return get('/system/app',data)
}
export function addApp( data) {
  return post('/system/app',data)
}
export function updateApp( data) {
  return put('/system/app',data)
}
export function deleteApp( id) {
  return del('/system/app/'+id)
} 

//日志接口 GET /api/v1/system/logs
export function listLogs(data) {
  return get('/system/logs',data)
}


//监控 GET /api/v1/system/jvm/monitor
export function jvmMonitor() {
  return get('/system/jvm/monitor',{})
}