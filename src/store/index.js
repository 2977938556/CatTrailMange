import { createStore } from 'vuex'
// 持久化插件
import createPersistedstate from 'vuex-persistedstate'


// 导入数据小仓库
import header from '@/store/modules/header.js'// header模块
import user from '@/store/modules/user.js'// 用户登录模块 模块
import llmsh from '@/store/modules/llmsh.js'// 流浪猫审核

let store = createStore({
    modules: {
        header,
        user,
        llmsh
    },

    // 持久化配置
    plugins: [
        createPersistedstate({
            key: 'user-store',
            paths: ['user']
        })
    ]
})


export default store