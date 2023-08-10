import request from '@/utils/request.js'




// 发布广告模块
export let PushGuangGao = (data) => {
    return request('/config/guangpuhs', 'post', data)
}


// 获取数据
export let GetGuangGaoData = (data) => {
    return request('/config/guangaodata', 'post', data)
}



// 删除接口
export let DeleteGuanGao = (data) => {
    return request('/config/guangaodatadelete', 'post', data)
}



// 修改广告接口
export let EditGuangGao = (data) => {
    return request('/config/editguangpuhs', 'post', data)
}



// 添加通知模块
export let PushMessage = (data) => {
    return request('/config/messagepush', 'post', data)
}

// 获取通知数据
export let GetMessagData = (data) => {
    return request('/config/messagedata', 'post', data)
}



// 修改当前的通知模块
export let EditMessage = (data) => {
    return request('/config/editmessage', 'post', data)
}



// 删除数据可批量
export let DeleteMessage = (data) => {
    return request('/config/messagedelete', 'post', data)
}