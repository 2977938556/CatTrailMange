<template>
    <div class="header">
        <div class="left">
        </div>
        <div class="right">
            <div class="img">
                <el-avatar :size="50" src="https://img.js.design/assets/smartFill/img304164da746310.jpeg" />
                <!-- <img src="" alt=""> -->
            </div>
            <div class="text">
                <p>FeiMao@110</p>
                <el-dropdown trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        超级管理员
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="a">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'
export default {
    name: "CatHeader",

    setup() {

        let store = useStore()
        let router = useRouter()

        // 这个方法是用于设置点击事件的情况
        let handleCommand = (key) => {
            // 退出登录模块
            if (key == "a") {
                store.commit('user/SetUser', {})
                router.go(-1)
            }


        }
        return { handleCommand }
    }
}
</script>


<style lang="less" scoped>
.header {
    width: 100%;
    height: 56px;
    display: flex;
    justify-content: space-between;
    box-shadow: 1px 3px 8px  rgba(0, 0, 0, 0.1);

    .left {
        flex: 1
    }

    .right {
        flex: 0.15;
        display: flex;
        align-items: center;

        .img {
            padding-right: 20px;
        }

        .text {
            height: 70%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-between;


            p {
                font-size: 16px;
                font-weight: 500;
                letter-spacing: 0px;
                line-height: 14.48px;
                color: rgba(0, 0, 0, 0.65);
                text-align: left;
                vertical-align: top;

            }

            .el-dropdown-link {
                font-size: px;
                font-weight: 500;
                letter-spacing: 0px;
                line-height: 11.58px;
                color: rgba(83, 172, 255, 1);
                text-align: left;
                vertical-align: top;
                cursor: pointer;
                border: none;
            }
        }

    }


}



.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}
</style>