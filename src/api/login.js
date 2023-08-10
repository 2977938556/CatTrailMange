import request from '@/utils/request.js'




// 登录
export let GetUserLogin = (data) => {
    return request(`/bg/login`, 'post', data)
}



// 注册
export let PushRegister = (data) => {
    return request('/bg/register', 'post', data)
}