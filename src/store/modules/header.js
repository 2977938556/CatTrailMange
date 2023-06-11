export default {
    namespaced: true,
    state: {
        crumbs: [// 面包屑
            {
                path: '/',
                name: 'home',
                label: '数据管理',
                icon: 's-home',
                url: '/sjgl'
            }
        ],
    },
    mutations: {
        // 添加面包屑
        AddCrumbs(state, playload) {
            let f = state.crumbs.some(item => item.name == playload.name)
            if (!f) {
                state.crumbs.push(playload)
            }


        }
    },
    actions: {


    },
    getters: {}
}