import { login, logout, currentUserInfo, getResourceMenu } from '@/api/apis'
import { setToken, removeToken, setKeys } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    userInfo: {}
  }

}


const state = getDefaultState()

const mutations = {
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        console.log(data)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      currentUserInfo().then(response => {
        const { data } = response
        if (!data) {
          return reject('登录中发生错误, 请重试.')
        }
        commit('SET_USERINFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getUserMenu({ commit }) {
    return new Promise((resolve, reject) => {
      getResourceMenu({menuType:'ME'}).then(response => {
        const { data } = response 
        let keys = [];
        for(let i in data){
          keys.push(data[i].key)
          let itemChildren = data[i].children
          for(let j in itemChildren){
            keys.push(itemChildren[j].key)
          } 
        }
        setKeys(keys)
        resolve(keys)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ state }) {
    console.log("logout")
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter() 
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken() {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

