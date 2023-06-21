
import CatLlmshHeader from '../../components/libray/cat-llmsh-header.vue'// header 头部组件
import CatSearchInput from '../../components/libray/cat-llmgl-search.vue'// 搜索组件
import CatLlmglRadio from '../../components/libray/cat-llmgl-radio.vue'// radio组件
import CatPromptComponent from '../../components/libray/cat-prompt-component.vue'





export default {
    install(app) {
        app.component(CatLlmshHeader.name, CatLlmshHeader)
        app.component(CatSearchInput.name, CatSearchInput)
        app.component(CatLlmglRadio.name, CatLlmglRadio)
        app.component(CatPromptComponent.name, CatPromptComponent)
    }
}

