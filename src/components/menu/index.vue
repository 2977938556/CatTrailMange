<template>
    <div class="menu">
        <el-row class="tac">
            <el-col :span="24">

                <div class="logo">
                    <img src="../../assets/image/cat-logo@1x.png" alt="">
                    <span>后台管理</span>
                </div>

                <el-menu default-active="/sjgl" class="el-menu-demo" mode="vertical" background-color="#334154"
                    text-color="#fff" active-text-color="#ffd04b" @select="handleSelect" :unique-opened="true"
                    :default-openeds="['/', 'sh', '/pzgl']" >

                    <el-sub-menu index="/" v-for="item in  menuNo " :key="item.patj">
                        <template #title>
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>{{ item.label }}</span>
                        </template>
                        <el-menu-item :index="citem.path" v-for="citem in  item.children " :key="citem.path"
                            @click="AddCrumbs(citem)">
                            <router-link :to="citem.path" exact-active-class="router-link-active">
                                <span>{{ citem.label }}</span>
                            </router-link>
                        </el-menu-item>
                    </el-sub-menu>

                    <el-menu-item :index="item.path" v-for="item in menuContain" :key="item.path" @click="AddCrumbs(item)">
                        <router-link :to="item.path" exact-active-class="router-link-active">
                            <el-icon>
                                <document />
                            </el-icon>
                            <span>{{ item.label }}</span>
                        </router-link>

                    </el-menu-item>
                </el-menu>

            </el-col>
        </el-row>
    </div>
</template>
  



<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
export default {
    name: "CatMenu",
    setup() {



        let store = useStore()

        let MenuList = ref([
            {
                icon: "House",
                label: "首页",
                name: 'home',
                path: "/",
                children: [
                    {
                        icon: "User",
                        label: "数据管理",
                        name: "sjgl",
                        path: "/sjgl",
                    }
                ]
            },
            {
                icon: "Avatar",
                label: "审核",
                path: 'sh',
                children: [
                    {
                        label: "流浪猫管理",
                        name: "llmgl",
                        path: "/llmgl",
                    },
                    {
                        label: "故事管理",
                        name: "gsgl",
                        path: "/gsgl",
                    }, {
                        label: "活动管理",
                        name: "hdgl",
                        path: "/hdgl",
                    }, {
                        label: "用户管理",
                        name: "yhgl",
                        path: "/yhgl",
                    }, {
                        label: "养猫指南管理",
                        name: "ymzngl",
                        path: "/ymzngl",
                    }
                ]
            },
            {
                icon: "Tools",
                label: "配置管理",
                name: "pzgl",
                path: "/pzgl",
            }
        ])


        // 计算出没有二级菜单的
        let menuContain = MenuList.value.filter(item => !item.children)

        // 计算出有二级菜单的
        let menuNo = MenuList.value.filter(item => item.children)



        let AddCrumbs = (value) => {
            // store.commit('header/AddCrumbs', value)
        }




        // 这里是选中的情况那么就需要进行一个判断
        let handleSelect = (keu) => {
            // console.log(keu);
        }



        return {
            handleSelect,
            menuContain,
            menuNo,
            AddCrumbs
        }
    }
}


</script>







<style lang="less" scoped>
.menu {
    width: auto;
    height: 100%;
    overflow: hidden;

}

.el-menu {
    background: #334154;
    border: none;


}

.tac {
    height: 100vh;
    background: #334154;

    ul {
        a {
            display: block;
            width: 100%;
            height: 100%;
            position: relative;
            left: -10px;
            color: rgb(255, 255, 255);
        }
    }
}

/* 设置选中菜单的背景颜色 */
.el-menu-item.is-active,
.el-submenu.is-active>.el-submenu__title {
    background-color: #222D3C;
}


.router-link-active {
    color: #ffd04b !important;
    font-weight: bold !important;
}

//设置侧边栏父级菜单高亮
::v-deep(.el-submenu.is-active > .el-submenu__title) {
    color: #409EFF !important;
}



// Logo标志
.logo {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
        margin-left: 7px;
        margin-top: 5px;
        display: block;
        width: auto;
        width: 42px;
        height: 18px;
        opacity: 1;
        border-radius: 8px;
        background: rgba(255, 124, 0, 1);
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 3px 5px 3px 5px;
        /** 文本1 */
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0px;
        cursor: pointer;
        color: rgba(255, 255, 255, 1);
    }
}
</style>