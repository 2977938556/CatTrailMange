import { createApp } from 'vue'

import App from './App.vue'
const app = createApp(App)



// 全局导入ElementUi
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus)



// 全局导入图标icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


// 重置样式
// import 'normalize.css'


// 导入重置样式
import '@/assets/styles/default.less'





// 注册全局插件
import UI from '@/components/libray/index.js'
app.use(UI)


// 导入vuex
import store from '@/store'
app.use(store)


// 导入路由模块
import router from '@/router/index.js'
app.use(router)

app.mount('#app')
