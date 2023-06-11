import { createRouter, createWebHashHistory } from 'vue-router'



// 布局容器
import Main from '@/view/main/index.vue'

// 首页下面的菜单
import Cat_SjglPage from '@/view/main/home/index.vue'// 数据管理

// 审核模块的下面的菜单
import Cat_LlmGlPage from '@/view/main/examine/cat-llmgl/index.vue'// 流浪猫管理
import Cat_GsglPage from '@/view/main/examine/cat-gsgl/index.vue'// 故事管理
import Cat_HdglPage from '@/view/main/examine/cat-hdgl/index.vue'// 活动管理
import Cat_YhglPage from '@/view/main/examine/cat-yhgl/index.vue'// 用户管理
import Cat_YmznglPage from '@/view/main/examine/cat-ymzn/index.vue'// 养猫指南管理


// 配置模块
import Cat_config from '@/view/main/config/index.vue'// 配置管理



// 子集页面
import Cat_LlmglSubmittPage from '@/view/main/examine/cat-llmgl/submit/index.vue'// 流浪猫管理




// 登录页面
import Login from '@/view/login/index.vue'




const routes = [
    // 首页模块功能路由
    {
        path: "/", component: Main, name: "/", redirect: "sjgl", meta: { name: "首页", path: '/' }, children: [
            { path: 'sjgl', component: Cat_SjglPage, name: 'sjgl', meta: { name: "数据管理", path: '/sjgl' } },// 数据管理
            {
                path: 'llmgl', component: Cat_LlmGlPage, name: 'llmgl', meta: { name: "流浪猫管理", path: '/llmgl' }, children: [
                    { path: 'llmglsubmit/:id', component: Cat_LlmglSubmittPage, meta: { name: "流浪猫管理详情界面", path: "/llmglsubmit" } }
                ]
            },// 流浪猫管理
            { path: 'gsgl', component: Cat_GsglPage, name: 'gsgl', meta: { name: "故事管理", path: '/gsgl' } },// 故事管理
            { path: 'hdgl', component: Cat_HdglPage, name: 'hdgl', meta: { name: "活动管理", path: '/hdgl' } },// 活动管理
            { path: 'yhgl', component: Cat_YhglPage, name: 'yhgl', meta: { name: "用户管理", path: '/yhgl' } },// 用户管理
            { path: 'ymzngl', component: Cat_YmznglPage, name: 'ymzngl', meta: { name: "养猫指南管理", path: 'ymzngl' } },// 养猫指南管理
            { path: 'pzgl', component: Cat_config, name: 'pzgl', meta: { name: "配置管理", path: 'pzgl' } },// 配置管理
        ]
    }, {
        path: "/login", component: Login, name: "login", meta: { name: "登录页面", path: '/login' }
    }

]


const scrollBehavior = (to, from, savedPosition) => {
    if (savedPosition) {
        return savedPosition
    } else {
        return { x: 0, y: 0 }
    }
}




// 创建路由实例
const router = createRouter({
    // 使用hash方式实现路由
    history: createWebHashHistory(),
    // 配置路由规则，写法和之前一样
    routes,
    scrollBehavior
})





// 优化路由守卫
router.beforeEach((to, from, next) => {
    // const token = localStorage.getItem('token');
    let whiteList = ['/login'];
    let token = JSON.parse(localStorage.getItem('user-store'))?.user?.profile?.token || false

    // 用户已登录，跳转至首页
    if (token) {
        // 用户有token并且跳转的是登录与注册那么就回首页
        if (whiteList.includes(to.path)) {
            next('/');
        } else {
            // 用户有token 并且跳转的是非登录与注册那么就下一步
            next();
        }
    } else {
        // 用户未登录
        if (whiteList.includes(to.path)) {
            next();
        } else {
            next('/login');
        }
    }
});






export default router