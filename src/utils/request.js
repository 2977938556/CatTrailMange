// 1. 创建一个新的axios实例
// 2. 请求拦截器，如果有token进行头部携带
// 3. 响应拦截器：1. 剥离无效数据  2. 处理token失效
// 4. 导出一个函数，调用当前的axsio实例发请求，返回值promise
import axios from 'axios'
import store from '@/store'
import router from '@/router'
// import MessageJs from '@/components/libray/CarMessage.js'
import { ElMessage } from 'element-plus'





// 配置基准地址
// 这里我把基准地址的配置设置在vite.config.js中
export const baseURL = 'http://172.16.79.14:3000/api';
// export const baseURL = ' http://192.168.43.57:3000/api';
const instance = axios.create({
    baseURL,
    timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use(config => {
    // 拦截业务逻辑
    // 如果有token那么就获取
    let { profile } = store.state.user
    if (profile && profile.token != "") {
        // 如果有token请求的话那么就会携带token进行请求添加在头部
        config.headers.Authorization = `Bearer ${profile.token}`
    }
    return config
}, err => {
    return Promise.reject(err)
})







// 请求拦截器
instance.interceptors.response.use(res => res.data, err => {
    // 判断是否是401状态
    if (err.response && err.response.status === 401) {
        // 1. 清空无效用户信息
        // 2. 跳转到登录页
        // 3. 跳转需要传参（当前路由地址）给登录页码
        store.commit('user/SetUser', {})

        // 基于当前的路径存储在回调地址中
        // MessageJs({ text: `${err.response.data.message}`, type: "error" })
        ElMessage.error('用户信息已过期，请重新登录')
        if (router.currentRoute.value.fullPath) {
            const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
            router.push('/login?redirectUrl=' + fullPath)
        } else {
            router.push('/login')
        }

    }

    return Promise.reject(err)
})


// 请求工具函数
export default (url, method, submitData) => {
    // 负责发请求：请求地址，请求方式，提交的数据
    return instance({
        url,
        method,
        // 1. 如果是get请求  需要使用params来传递submitData   ?a=10&c=10
        // 2. 如果不是get请求  需要使用data来传递submitData   请求体传参
        // [] 设置一个动态的key, 写js表达式，js表达式的执行结果当作KEY
        // method参数：get,Get,GET  转换成小写再来判断
        // 在对象，['params']:submitData ===== params:submitData 这样理解
        [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
    })
}


