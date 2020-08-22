import { Logger } from "runjs/lib/common"

export function getToken() {
  return localStorage.getItem('token')
}

export function setToken(token) {
  console.log("setToken")
  console.log(token) 
  localStorage.setItem('token', token)
}

export function removeToken() {
  console.log("removeToken")
  localStorage.removeItem('token')
}

export function setMenu(data) { 
  localStorage.setItem('meun', JSON.stringify(data))
}
export function getMenu() { 
  return localStorage.getItem('meun')
}