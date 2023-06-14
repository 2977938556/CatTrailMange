import request from '@/utils/request.js'



// 获取帖子的数据
export let GetBgData = (data) => {
    return request('/bg/catdata', 'post', data)
}

// 这个是用于用户进行是否审核通过该帖子
export let PushModifyPost = (data) => {
    return request('/bg/catpass', 'post', data)
}


// 这个是通过帖子的id进行查询出帖子的数据
export let GetCatId = (id) => {
    return request(`/bg/catiddata?id=${id}`, 'get')
}