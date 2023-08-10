import request from '@/utils/request.js'



// 获取发布流浪的统计数据
export let GetCount = (data) => {
    return request(`/echarts/llmfb`, 'post', data)
}



// 获取申请的数据
export let GetApply = (data) => {
    return request('/echarts/applys', 'post', data)
}


// 获取领养和未领养的比例数据
export let GetApplyOkNo = (data) => {
    return request('/echarts/applynook', 'post', data)
}


// 获取点击量前10的帖子
export let GetClickCat = (data) => {
    return request('/echarts/clickcat', 'post', data)
}


// 获取点击量前10的帖子
export let GetClickSearch = (data) => {
    return request('/echarts/searchhost', 'post', data)
}