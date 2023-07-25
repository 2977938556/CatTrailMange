<template>
    <div class="subset-heeader">
        <div class="left">
            <div>
                <h1>帖子id:</h1>
                <p>{{ catData?._id || "暂无" }}</p>
            </div>
            <div>
                <h1>活动状态:</h1>

                <p v-if="catData.to_examine">
                    <el-tag class="ml-2" type="success" v-if="catData.to_examine == 'pass'">在线</el-tag>
                    <el-tag v-else-if="catData.to_examine == 'examine'">待审核</el-tag>
                    <el-tag v-else-if="catData.to_examine == 'nopass'" class="ml-2" type="danger">未通过审核</el-tag>
                    <el-tag v-else-if="catData.to_examine == 'progress'" class="ml-2" type="danger">报名中</el-tag>
                    <el-tag v-else-if="catData.to_examine == 'end'" class="ml-2" type="success">结束</el-tag>
                    <el-tag v-else-if="catData.to_examine == 'cancellation'" class="ml-2" type="info">取消</el-tag>
                    <el-tag v-else-if="catData.to_examine == 'delete'" class="ml-2" type="warning">删除了</el-tag>
                    <el-tag class="ml-2" type="success" v-else-if="catData.to_examine == 'pass'">在线</el-tag>
                    <el-tag type="info" v-else-if="catData.to_examine == 'examine'">待审核</el-tag>
                    <el-tag type="danger" v-else-if="catData.to_examine == 'nopass'">未通过</el-tag>
                    <el-tag type="warning" v-else-if="catData.to_examine == 'offine'">下线</el-tag>
                    <el-tag type="danger" v-else-if="catData.to_examine == 'delete'">已删除</el-tag>
                </p>
                <p v-else-if="catData.role">
                    <el-tag class="ml-2" type="success" v-if="catData.role == 'user'">普通用户</el-tag>
                    <el-tag type="info" v-else-if="catData.role == 'admin'">管理员</el-tag>
                    <el-tag type="danger" v-else-if="catData.role == 'institution'">合作机构</el-tag>
                    <el-tag type="danger" v-else-if="catData.role == 'business'">商家</el-tag>
                    <el-tag type="info" v-else-if="catData.role == 'ban'">被封禁</el-tag>
                    <el-tag type="danger" v-else-if="catData.role == 'delete'">无当前账户</el-tag>
                </p>




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

            .el-tag {
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