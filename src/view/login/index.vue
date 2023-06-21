<template>
    <div class="login">
        <el-card class="box-card" shadow="never">
            <template #header>
                <div class="card-header">
                    <span style="font-size: 36px;color:#FF7C00;font-weight: 900;">猫迹后台管理系统</span>
                </div>
            </template>

            <div class="input">
                <div>
                    <div class="sub-title my-2 text-sm text-gray-600">
                        <el-icon>
                            <User />
                        </el-icon> Username
                    </div>
                    <el-input v-model="username" placeholder="请输入你的账户名称" clearable />
                </div>
                <div>
                    <div class=" sub-title my-2 text-sm text-gray-600">
                        <el-icon>
                            <Unlock />
                        </el-icon> Password
                    </div>
                    <el-input v-model="password" type="password" placeholder="请输入你的密码" show-password />
                </div>
                <div>
                    <el-button type="warning" round @click="submit">Login</el-button>
                </div>
            </div>

        </el-card>



    </div>
</template>


<script>
import { ref } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { GetUserLogin } from '@/api/login.js'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
export default {
    name: "Login",
    setup() {


        let username = ref('FeiMao')
        let password = ref('111111')


        let store = useStore()
        let router = useRouter()
        let route = useRoute()





        // 这里我们需要进行设置用户的名称
        let submit = async () => {
            if (username.value == "" || password.value == "") {
                return ElMessage({
                    message: '账户或者密码不能为空',
                    type: 'error',
                })
            }

            // 这里就是要发送请求
            try {
                let { result: { data, token } } = await GetUserLogin({ username: username.value, password: password.value })

                store.commit('user/SetUser', { ...data, token })
                router.push(route.query.redirectUrl || '/')

                return ElMessage({
                    message: `登录成功 ${data.username}`,
                    type: 'success',
                })

            } catch ({ response: { data } }) {
                return ElMessage({
                    message: data.message || "服务器错误",
                    type: 'error',
                })
            }

        }






        return { username, password, submit }
    }
}

</script>


<style lang="less" scoped>
.login {
    height: 100vh;
    width: 100%;
    min-height: 800px;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-image: url('https://img.js.design/assets/img/643a4f17097d676c8360550b.png#3f59acd38d9a191689639e1f5886e478');
    background-size: 100%;
    position: relative;

    .el-card {
        width: 500px;
        height: 500px;
        filter: none !important;
        border-radius: 20px;

        .input {
            height: 200px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }


}

.login::before {
    /* 添加伪元素 */
    content: "";
    position: absolute;
    /* 相对于父元素定位 */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('https://img.js.design/assets/img/643a4f17097d676c8360550b.png#3f59acd38d9a191689639e1f5886e478');
    background-size: 100%;
    filter: blur(20px);
    /* 对伪元素进行模糊处理 */
    z-index: -1;
    /* 将伪元素放在最底下，以确保其他元素不受影响 */
}



.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.box-card {
    width: 480px;
}
</style> 

