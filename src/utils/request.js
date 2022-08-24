/**
 * 请求模块
 */
import axios from "axios"
import store  from "@/store/index.js"
const requset = axios.create({
       baseURL:"http://toutiao.itheima.net/"
    // baseURL:"http://ttapi.research.itcast.cn/" //接口基准路径
})

// 请求拦截器
// Add a request interceptor
requset.interceptors.request.use(function (config) {
    // Do something before request is sent
    // 请求发起会经过这里
    // config ：本次请求的配置对象
    // config 里面有一个属性：headers
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 注意: 这里务必要返回 config 配置对象，否则就停在这了出不去
    return config
  }, function (error) {
    // Do something with request error
    // 如果 请求出错了(还没有发出去) 会进入这里
    return Promise.reject(error)
  })
// 响应拦截器
export default requset