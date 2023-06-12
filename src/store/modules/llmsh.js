export default {
    namespaced: true,
    state: () => {
        GoodsList: []
    },
    mutations: {
        // 添加数据的模块
        AddGoodsList(state, payload = []) {
            state.GoodsList = payload
        },
        // 审核模块
        ModifyGoodsList(state, payload) {
            let { _id, type } = payload

            if (type) {
                let data = state.GoodsList.find(item => item._id == _id)
                data.to_examine = "pass"
                data.isApproved = true
            } else {
                let data = state.GoodsList.find(item => item._id == _id)
                data.to_examine = "nopass"
                data.isApproved = true
            }




        }

    },
    actions: {

    },
    getters: {

    }
}