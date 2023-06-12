import request from '@/utils/request.js'



// 获取帖子的数据
export let GetBgData = (data) => {
    return request('/bg/catdata', 'post', data)
}



export let PushModifyPost = (data) => {
    return request('/bg/catpass', 'post', data)
}