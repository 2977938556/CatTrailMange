<template>
    <div class="subset-heeader">
        <div class="left">
            <div>
                <h1>帖子id:</h1>
                <p>{{ catData?._id || "暂无" }}</p>
            </div>
            <div>
                <h1>活动状态:</h1>
                <el-tag class="ml-2" type="success" v-if="catData.to_examine == 'pass'">已通过</el-tag>
                <el-tag v-else-if="catData.to_examine == 'examine'">待审核</el-tag>
                <el-tag v-else-if="catData.to_examine == 'nopass'" class="ml-2" type="danger">未通过审核</el-tag>
                <el-tag v-else-if="catData.to_examine == 'progress'" class="ml-2" type="danger">报名中</el-tag>
                <el-tag v-else-if="catData.to_examine == 'end'" class="ml-2" type="success">结束</el-tag>
                <el-tag v-else-if="catData.to_examine == 'cancellation'" class="ml-2" type="info">取消</el-tag>
                <el-tag v-else-if="catData.to_examine == 'delete'" class="ml-2" type="warning">删除了</el-tag>
                <el-tag v-else class="ml-2" type="danger">暂无</el-tag>
            </div>
        </div>
        <div class="right">
            <slot></slot>
        </div>
    </div>
</template>




<script>
export default {
    name: "CatLlmshHeader",
    props: {
        catData: {
            type: Object,
            default: {}
        }
    },
}


</script>





<style lang="less" scoped>
// 头部数据
.subset-heeader {
    width: 100%;
    height: 70px;
    display: flex;

    .left {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        div {
            flex: 1;
            display: flex;
            align-items: center;
            .el-tag{
                padding: 10px;
            }
            // justify-content: center;
            * {
                margin-left: 10px;

            }
        }
    }

    .right {
        flex: 1;
        display: flex;
    }
}
</style>