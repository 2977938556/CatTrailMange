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
// import Cat_config from '@/view/main/config/index.vue'// 配置管理
// 配置模块的菜单模块
import Cat_HomeBanner from '@/view/main/config/con-homebanner/index.vue'// 轮播图管理
import Cat_message from '@/view/main/config/con-tzmssage/index.vue'// 通知管理




// 子集页面
import Cat_LlmglSubmittPage from '@/view/main/examine/cat-llmgl/subset/index.vue'// 流浪猫管详情页面
import Cat_GsglLlmshPage from '@/view/main/examine/cat-gsgl/subset/index.vue'// 故事管理详情页面
import Cat_HdllSubmitPage from '@/view/main/examine/cat-hdgl/subset/index.vue'// 故事管理详情页面
import Cat_YmznSubmitPafge from '@/view/main/examine/cat-ymzn/subset/index.vue'// 养猫指南管理详情页面
import Cat_YhglSubmit from '@/view/main/examine/cat-yhgl/subset/index.vue' // 用户管详情





// 登录页面
import Login from '@/view/login/index.vue'
import Regiser from '@/view/login/register.vue'




const routes = [
    // 首页模块功能路由
    {
        path: "/", component: Main, name: "/", redirect: "sjgl", meta: { name: "首页", path: '/' }, children: [
            { path: 'sjgl', component: Cat_SjglPage, name: 'sjgl', meta: { name: "数据管理", path: '/sjgl' } },// 数据管理
            {
                path: 'llmgl', component: Cat_LlmGlPage, name: 'llmgl', meta: { name: "流浪猫管理", path: '/llmgl' }, children: [
                    { path: 'llmglsubmit', name: "llmglsubmit", component: Cat_LlmglSubmittPage, meta: { name: "流浪猫管理详情界面", path: "/llmglsubmit" } }
                ]
            },// 流浪猫管理
            {
                path: 'gsgl', component: Cat_GsglPage, name: 'gsgl', meta: { name: "故事管理", path: '/gsgl' }, children: [
                    { path: 'gsglsubmit', name: 'gsglsubmit', component: Cat_GsglLlmshPage, meta: { name: '故事管理详情界面', path: '/gsglsubmit' } }
                ]
            },// 故事管理
            {
                path: 'hdgl', component: Cat_HdglPage, name: 'hdgl', meta: { name: "活动管理", path: '/hdgl' }, children: [
                    { path: 'hdglsubmit', name: 'hdglsubmit', component: Cat_HdllSubmitPage, meta: { name: "活动管理详情界面", path: '/hdglsubmit' } }
                ]
            },// 活动管理
            {
                path: 'ymzngl', component: Cat_YmznglPage, name: 'ymzngl', meta: { name: "养猫指南管理", path: 'ymzngl' }, children: [
                    { path: 'ymznsubmit', name: 'ymznsubmit', component: Cat_YmznSubmitPafge, meta: { name: '养猫指南详情', path: '/ymznsubmit' } }
                ]
            },// 养猫指南管理
            {
                path: 'yhgl', component: Cat_YhglPage, name: 'yhgl', meta: { name: "用户管理", path: '/yhgl' }, children: [
                    { path: "yhglsubmit", name: 'yhglsubmit', component: Cat_YhglSubmit, meta: { name: "用户详情页面", path: "/yhglsubmit" } }
                ]
            },// 用户管理
            { path: 'homebannr', component: Cat_HomeBanner, name: 'homebannr', meta: { name: "轮播图管理", path: '/homebannr' } },
            { path: 'tzmessage', component: Cat_message, name: 'tzmessage', meta: { name: "通知管理", path: '/tzmessage' } },// 配置管理
        ]
    }, {
        path: "/login", component: Login, name: "login", meta: { name: "登录页面", path: '/login' }
    }, {
        path: "/register", component: Regiser, name: "regiser", meta: { name: "注册页面", path: '/register' }
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
    // 白名单
    let whiteList = ['/login', '/register'];
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