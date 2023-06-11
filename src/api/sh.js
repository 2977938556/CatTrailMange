import request from '@/utils/request.js'


export let GetShLlmGlList = (type = "all") => {
    return request('/home/recommend', 'get')
}