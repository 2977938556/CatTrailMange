export default {
    namespaced: true,
    state: () => {
        return {
            dialogTableVisibles: [],// 广告数据
            messageList: [],
        }
    },
    mutations: {

        // 设置渲染表格的数据
        AdddialogTableVisibles(state, { playload, type = true }) {
            // 这里设置一个条件进行判断
            if (type) {
                state.dialogTableVisibles.push(...playload)
            } else {
                state.dialogTableVisibles = state.dialogTableVisibles.filter(obj1 => !playload.some(obj2 => obj2._id === obj1._id));
            }
        },
        // 删除广告数据
        DeleteDialogTableVisibles(state, playload = []) {
            state.dialogTableVisibles = playload
        },

        // 添加信息数据
        // 传递的参数表表示一个数据一个判断是修改还是添加
        AddmessageList(state, { playload, type = true }) {
            if (type) {
                state.messageList = playload
            } else {
                state.messageList = state.messageList.filter(obj1 => !playload.some(obj2 => obj2._id === obj1._id));
            }
        }

    },
    actions: {


    },
    getters: {}
}