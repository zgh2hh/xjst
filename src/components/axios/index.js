import {Message} from 'element-ui'
import axios from 'axios'

axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// http://192.168.1.117:8081 http://zhutest.qmant.com/
axios.defaults.baseURL = (process.env.NODE_ENV === 'development' ? 'http://zhu.qmant.com/' : '')
axios.defaults.withCredentials = true

// POST传参序列化
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = JSON.stringify(config.data)
  }
  return config
})

axios.interceptors.response.use((res) => {
  // token失效得判断
  if (res.status === 401) {
    Message({
      message: '登陆过期,请重新登陆',
      type: 'error',
      onClose () {
        window.location.href = '/login'
      }
    })
    return Promise.reject(res)
  } else if (res.data.code !== 20000) {
    Message({
      message: res.data.message,
      type: 'error'
    })
    return Promise.reject(res)
  }
  return res
}, (error) => {
  Message({
    message: '网络异常',
    type: 'error'
  })
  return Promise.reject(error)
})

export default axios
