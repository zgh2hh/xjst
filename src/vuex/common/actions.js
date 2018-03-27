import md5 from 'md5'
import axios from '@/components/axios/'
import * as types from './mutationTypes'

/** 获取用户信息 */
export const login = ({commit}, parmas) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: 'noa/login',
      data: {
        username: parmas.username,
        password: md5(parmas.password)
      }
    }).then((response) => {
      commit(types.LOGIN, response.data.data)
      resolve(response)
    }).catch((error) => {
      reject(error)
    })
  })
}

/** 用户注销 */
export const quitLogin = ({commit}) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: '/noa/logout'
    }).then((response) => {
      commit(types.QUIT_LOGIN)
      resolve(response)
    }).catch((error) => {
      reject(error)
    })
  })
}

/** 获得批次 */
export const getCultivate = ({commit}) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: 'api/cultivate/all'
    }).then((response) => {
      commit(types.CULTIVATE, response.data.data)
      resolve(response)
    }).catch((error) => {
      reject(error)
    })
  })
}
