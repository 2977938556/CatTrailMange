<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <!-- 这里是菜单 -->
        <CatMenu />
      </el-aside>
      <el-container>
        <el-header height="auto">
          <!-- 这里需要放置一个heade组件 -->
          <CatHeader></CatHeader>
        </el-header>
        <!-- 这个是面包屑模块 -->
        <CatTarget />
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script>
import CatHeader from '@/components/header/index.vue'// 这个是头部
import CatMenu from '@/components/menu/index.vue'// 这个是菜单模块
import CatTarget from '@/components/tage/index.vue'// 这个是标签栏
export default {
  name: "Main",
  components: {
    CatHeader,
    CatMenu,
    CatTarget
  }

}


</script>




<style lang="less" scoped>
* {
  box-sizing: border-box;
}



// 这里是头部的数据
.el-header {
  padding: 0px;
  height: 56px;

}

// .common-layou{
//   width: 1440px;
//   overflow: hidden;
// }

// 这里是内容区域的设置
.el-main {
  width: 98%;
  height: 100%;
  margin: 0 auto;
  // background: rgb(71, 110, 168);
  background: white;
  border-radius: 10px;
  margin-bottom: 20px;
}



.el-container {
  width: 100%;
  height: 100vh;
}
</style>

