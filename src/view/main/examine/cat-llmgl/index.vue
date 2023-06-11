<template>
    <div class="llmsh">
        <div class="content" v-if="$route.meta.path != '/llmglsubmit'">
            <div class="content-header">
                <div class="left">
                    <h1>总申请量：</h1>
                    <p>881242位用户</p>
                </div>
                <div class="right">
                    <div class="input demo-input-size">
                        <el-input v-model="search" class="w-50 m-2" size="large" placeholder="Please Input"
                            prefix-icon="Search" @blur="searchFn" />
                    </div>
                    <el-radio-group v-model="radio1" size="large" @change="radioFn">
                        <el-radio-button label="全部" />
                        <el-radio-button label="待审核" />
                        <el-radio-button label="已审核" />
                        <el-radio-button label="未通过" />
                    </el-radio-group>
                </div>
            </div>
            <div class="content-box">
                <!-- <div class="content-box-header">
                    <ul>
                        <li v-for="item in headerList" :key="item">{{ item.name }}</li>
                    </ul>
                </div> -->

                <div class="content-box-table">
                    <el-table :data="tableData" :border=true :stripe="true"
                        :default-sort="{ prop: 'upload_time', order: 'descending' }" style="width: 100%">
                        <el-table-column prop="username" label="用户名称" />
                        <el-table-column prop="adds" label="地区" width="280" />
                        <el-table-column prop="label" label="标签">
                            <template #default="scope">
                                <el-tag style="margin-left: 10px;" v-for="(item, index) in scope.row.label" :key="index">{{
                                    item }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="state" label="状态" sortable :sort-by="['state', 'state']">
                            <template #default="scope">
                                <el-tag class="ml-2" type="success" v-if="scope.row.state == 'pass'">已通过</el-tag>
                                <el-tag v-else-if="scope.row.state == 'examine'">待审核</el-tag>
                                <el-tag v-else class="ml-2" type="info">未通过</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="upload_time" label="发布时间" sortable />
                        <el-table-column prop="examine" label="审核" class="examine" sortable
                            :sort-by="['examine', 'nopass']">
                            <template #default="scope">
                                <div class="btn">
                                    <!-- 这里是已经审核通过的模块 -->
                                    <div v-if="scope.row.state == 'pass'">
                                        <el-button type="success" disabled>已通过</el-button>
                                    </div>
                                    <!-- 这里是待审核的状态 -->
                                    <div v-else-if="scope.row.state == 'examine'">
                                        <el-button type="primary" icon="Select">通过</el-button>
                                        <el-button type="danger" icon="CloseBold">未通过</el-button>
                                    </div>
                                    <!-- 这里是审核未通过的模块 -->
                                    <div v-else>
                                        <el-button type="danger" icon="Delete" disabled>未通过</el-button>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="more" label="更多">
                            <template #default="scope">
                                <router-link :to="`/llmgl/llmglsubmit/${scope.row.id}`">查看详情</router-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

            </div>


        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'



import { GetShLlmGlList } from '@/api/sh.js'
export default {
    name: "CatLlmsh",

    setup() {
        let route = useRoute()

        // 设置按钮状态的
        let radio1 = ref("全部")


        // 设置header标签的
        let headerList = ref([
            { name: "用户名称" },
            { name: "地区" },
            { name: "标签" },
            { name: "状态" },
            { name: "发布时间" },
            { name: "审核" },
            { name: "更多" },
        ])


        let search = ref('')

        // 这里是搜索的发送请求获取数据
        let searchFn = () => {
            console.log("测试数据")
        }


        // 
        let radioFn = (val) => {
            console.log(val);
        }




        // 测试数据
        const tableData = [
            {
                id: "1",
                username: 'FeiMao@110',
                adds: '赣州市',
                label: ["标签1", "标签2", "标签1", "标签2", "标签1", "标签2", "标签1", "标签2", "标签1", "标签2"],
                state: "examine",
                upload_time: "2023.4.5",
                examine: true,
                more: "更多"
            },
            {
                id: "1",
                username: 'MenMao@110',
                adds: '赣州市',
                label: ["标签1", "标签2"],
                state: "pass",
                upload_time: "2023.4.6",
                examine: false,
                more: "更多"
            }, {
                id: "1",
                username: '小白',
                adds: '赣州市',
                label: ["标签1", "标签2"],
                state: "examine",
                upload_time: "2023.4.7",
                examine: false,
                more: "更多"
            }, {
                id: "1",
                username: '小黑',
                adds: '江西省赣州市赣县区',
                label: ["标签1", "标签2"],
                state: "nopass",
                upload_time: "2023.4.8",
                examine: false,
                more: "更多"
            },
            {

                id: "1",
                username: '小黑',
                adds: '江西省赣州市赣县区',
                label: ["标签1", "标签2"],
                state: "nopass",
                upload_time: "2023.4.8",
                examine: false,
                more: "更多"
            },
            {
                id: "1",
                username: '小黑',
                adds: '江西省赣州市赣县区',
                label: ["标签1", "标签2"],
                state: "nopass",
                upload_time: "2023.4.8",
                examine: false,
                more: "更多"
            }
        ]


        // GetShLlmGlList().then(value => {
        //     console.log(value);
        // })


        return { radio1, headerList, tableData, search, searchFn, radioFn }





    }


}
</script>



<style lang="less" scoped>
.llmsh {
    background: #fff;
    height: 100%;
    width: 100%;
    // margin-left: 20px;
    // margin-right: 20px;
    border-radius: 10px;
    overflow: auto;

    .content {

        .content-header {
            height: 74px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .left {
                flex: 1;
                padding-left: 20px;
                display: flex;
                align-items: center;
            }

            .right {
                flex: 0.5;
                padding-right: 20px;
                display: flex;
                justify-content: space-between;

            }

        }

        .content-box {
            height: auto;
            min-height: 400px;

            .btn {

                button {
                    padding: 10px;
                }
            }



            // 导航区域
            .content-box-header {
                width: 100%;
                height: 50px;

                ul {
                    display: flex;
                    background: rgba(242, 242, 242, 1);

                    li {
                        flex: 1;
                        text-align: center;
                        line-height: 50px;
                        font-size: 16px;
                        font-weight: 400;
                        letter-spacing: 0px;
                        color: rgba(51, 51, 51, 1);
                        vertical-align: top;
                    }
                }
            }
        }
    }




}
</style>