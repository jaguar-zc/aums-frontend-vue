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

export function setKeys(data) {
  localStorage.setItem('keys', JSON.stringify(data))
}
export function getKeys() {
  let keys = localStorage.getItem('keys')
  return keys == null ? [] : JSON.parse(keys)
}