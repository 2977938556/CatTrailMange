import request from '@/utils/request.js'

export let GetUserLogin = (data) => {
    return request(`/bg/login`, 'post', data)
}