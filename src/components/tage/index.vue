<template>
    <div class="tage">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in ElbreadcrumbItem" :disabled="$route.path == item.path" :key="item.path">
                <router-link :to="item.path">
                    {{ item.meta.name }}
                </router-link>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
// import{}
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

export default {
    name: "CatTarget",
    setup() {
        let store = useStore()
        let route = useRoute()
        let router = useRouter()

        // 获取动态的路由对象
        let ElbreadcrumbItem = computed(() => route.matched)



        return { ElbreadcrumbItem }
    }
}
</script>


<style lang="less" scoped>
.el-breadcrumb__item:last-child {
    color: #000000 !important;
}

.tage {
    width: 100%;
    height: 40px;
    padding-left: 20px;
    line-height: 40px;
    display: flex;

    // background: red;
    // line-height: 40px !important;

    .el-breadcrumb {
        width: 100%;
        line-height: 40px;
        // background: red;
    }

}
</style>