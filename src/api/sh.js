import request from '@/utils/request.js'



// 获取帖子的数据
export let GetBgData = (data) => {
    return request('/bg/shdata', 'post', data)
}

//  审核帖子模块
export let PushModifyPost = (data) => {
    return request('/bg/catpass', 'post', data)
}


// 这个是通过帖子的id进行查询出帖子的数据
export let GetCatId = ({ id, typeofs }) => {
    return request(`/bg/catiddata?id=${id}&typeofs=${typeofs}`, 'get')
}



// 用于提交活动模块的数据
export let PuhsActivityPost = (data) => {
    return request('/bg/activity', 'post', data)
}



// 提交养猫指南模块
export let PushgUuidePost = (data) => {
    return request('/bg/pushGuide', 'post', data)
}
