export default {
    namespaced: true,
    state: () => {
        return {
            // 用户信息
            profile: JSON.parse(localStorage.getItem('user-store'))?.user.profile || {
                _id: "",
                username: "",
                slogin: "",
                bgimgUrl: "",
                user_id: "",
                created_at: "",
                role: "",
                token: "",
                configuration_information: ""
            }
        }
    },
    mutations: {
        // 修改用户数据
        SetUser(state, payload) {
            // 这里直接设置数据
            // state.profile = { ...state.profile, ...payload }
            if (Object.values(payload).length > 0) {
                // 这里是修改用户，由于我偷懒不想结构出数据所以我就采用循环判断的方式
                for (let [key, value] of Object.entries(payload)) {
                    if (key in state.profile) {
                        state.profile[key] = value
                    }
                }
            } else {
                state.profile = {
                    _id: "",
                    username: "",
                    slogin: "",
                    bgimgUrl: "",
                    user_id: "",
                    created_at: "",
                    role: "",
                    token: "",
                    configuration_information: ""
                }

            }
        }
    },
    actions: {

    },
    getters: {

    }
}