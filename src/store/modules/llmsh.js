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
            state.GoodsList = []
            state.GoodsList = payload
        },
        // 审核模块
        ModifyGoodsList(state, payload) {
            const index = state.GoodsList.findIndex(item => item._id === payload._id);
            if (index >= 0) {
                state.GoodsList.splice(index, 1, payload);
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