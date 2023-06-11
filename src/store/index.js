import { createStore } from 'vuex'
// 持久化插件
import createPersistedstate from 'vuex-persistedstate'


// 导入数据小仓库
import header from '@/store/modules/header.js'
import user from '@/store/modules/user.js'

let store = createStore({
    modules: {
        header,
        user,
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