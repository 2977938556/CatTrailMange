export default {
    namespaced: true,
    state: () => {
        return {
            GoodsList: [],
            page: JSON.parse(localStorage.getItem("sh"))?.llmsh.page || 1,
            id: localStorage.getItem("llmshid") || "",
        }
    },
    mutations: {
        // 添加数据的模块
        AddGoodsList(state, payload = []) {
            state.GoodsList = payload
        },
        // 审核模块
        ModifyGoodsList(state, payload) {
            let { _id, type } = payload

            if (typeof type === 'boolean') {
                if (type) {
                    let data = state.GoodsList.find(item => item._id == _id)
                    data.to_examine = "pass"
                    data.isApproved = true
                } else {
                    let data = state.GoodsList.find(item => item._id == _id)
                    data.to_examine = "nopass"
                    data.isApproved = true
                }
            } else if (typeof type === 'string') {
                let data = state.GoodsList.find(item => item._id == _id)
                data.to_examine = type
            }







        },
        // 设置状态参数
        AddId(state, payload) {
            state.id = payload
            localStorage.setItem("llmshid", state.id)
        },
        // 设置page当前页面的值
        AddPage(state, payload) {
            state.page = payload
        },
        // 设置状态参数
        AddTYpe(state, payload) {
            state.type = payload
        }


    },
    actions: {

    },
    getters: {

    }
}