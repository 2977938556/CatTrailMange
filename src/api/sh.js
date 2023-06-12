import request from '@/utils/request.js'


export let GetBgData = (data) => {
    return request('/bg/catdata', 'post', data)
}