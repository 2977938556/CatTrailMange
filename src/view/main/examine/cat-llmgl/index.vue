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
                        <el-input clearable v-model="search" class="w-50 m-2" size="large" placeholder="Please Input"
                            prefix-icon="Search" @blur="searchFn" />
                    </div>
                    <el-radio-group v-model="radio1" size="large" @change="radioFn">
                        <el-radio-button :label="item.name" v-for="item in tabList" :key="item.label" />
                    </el-radio-group>
                </div>
            </div>
            <div class="content-box">
                <div class="content-box-table">
                    <el-table :data="GoodsList" :border=true :stripe="true" v-loading="loading" empty-text="没有数据哦"
                        :default-sort="[{ prop: 'updated_at', order: 'ascending' }, { prop: 'to_examine', order: 'ascending' }]"
                        style="width: 100%">
                        <el-table-column prop="user_id.username" label="用户名称" />
                        <el-table-column prop="addrs.provinceName" label="地区" width="280" />
                        <el-table-column prop="Successful_adoption" label="是否被申请" width="280">
                            <template #default="scope">
                                <p v-if="scope.row.Successful_adoption">已被领养</p>
                                <p v-else>无被领养</p>

                            </template>
                        </el-table-column>
                        <el-table-column prop="lable" label="标签">
                            <template #default="scope">
                                <el-tag style="margin-left: 10px;" v-for="(item, index) in scope.row.lable" :key="index">{{
                                    item }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="to_examine" label="状态" sortable :sort-by="['pass', 'examine', 'danger']">
                            <template #default="scope">
                                <el-tag class="ml-2" type="success" v-if="scope.row.to_examine == 'pass'">已通过</el-tag>
                                <el-tag v-else-if="scope.row.to_examine == 'examine'">待审核</el-tag>
                                <el-tag v-else class="ml-2" type="danger">未通过审核</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="updated_at" label="发布时间" sortable :formatter="FormatTime" />
                        <el-table-column prop="to_examine" label="审核" class="examine" width="200" sortable
                            :sort-by="['examine', 'nopass', 'pass']">
                            <template #default="scope">
                                <div class="btn">
                                    <!-- 这里是已经审核通过的模块 -->
                                    <div v-if="scope.row.to_examine == 'pass'">
                                        <el-button type="success" disabled>已通过</el-button>
                                    </div>
                                    <!-- 这里是待审核的状态 -->
                                    <div v-else-if="scope.row.to_examine == 'examine'">
                                        <el-popconfirm title="是否通过该帖子" @confirm="passFn(scope.row, true)">
                                            <template #reference>
                                                <el-button type="primary" icon="Select">通过</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="是否通过该帖子" @confirm="passFn(scope.row, false)">
                                            <template #reference>
                                                <el-button type="danger" icon="CloseBold">不通过</el-button>
                                            </template>
                                        </el-popconfirm>

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
                                <router-link :to="`/llmgl/llmglsubmit/${scope.row._id}`">
                                    <el-link type="primary">primary</el-link>
                                </router-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div class="content-box-fyq">
                    <el-pagination background layout="prev, pager, next" :total="typeData.total" @current-change="pageFn" />
                </div>

            </div>


        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed, ref, reactive, watch } from 'vue'
import { FormatTime } from '@/utils/time.js'
import { ElMessage } from 'element-plus'



import { GetBgData, PushModifyPost } from '@/api/sh.js'
export default {
    name: "CatLlmsh",

    setup() {
        let store = useStore()
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

        // 加载的判断值
        let loading = ref(false);


        // 搜索的值
        let search = ref('')


        // 这里是搜索的发送请求获取数据
        let searchFn = async (value) => {
            // 这里我们设置了请求的值
            typeData.searchVal = search.value
            GetBgDataFn()
        }










        // 保存数据的模块
        let GoodsList = computed(() => store.state.llmsh.GoodsList)

        // 需要提交的数据
        let typeData = reactive({
            page: 1,
            pageSize: 10,
            total: 0,
            searchVal: "",
            type: "whole",
        })




        // Tab模块数据

        // tab 数据模块
        let tabList = ref([
            { name: "全部", label: "whole" },
            { name: "待审核", label: "examine" },
            { name: "通过", label: "pass" },
            { name: "未通过", label: "nopass" },
        ])

        // 这个是筛选按钮的模块
        let radioFn = (val) => {
            // 这里查询到数据并赋予 最后重新发送请求获取数据
            let index = tabList.value.findIndex(item => item.name == val)
            typeData.type = tabList.value[index].label
            typeData.page = 1
            GetBgDataFn()
        }





        let GetBgDataFn = () => {
            loading.value = true;
            GetBgData(typeData).then(({ result }) => {
                console.log(result);
                // 将数据给响应性数据的变量
                // GoodsList.value = result.data
                store.commit('llmsh/AddGoodsList', result.data)
                // 更新总条数
                typeData.total = result.total

                loading.value = false;
            }).catch(err => {
                //这里获取数据失败的情况
                return ElMessage({
                    message: "获取数据失败",
                    type: 'error',
                })
            })
        }

        GetBgDataFn()







        // 分页器模块
        // 这个是分页器设置的模式数据
        let pageFn = (value) => {
            typeData.page = value
            GetBgDataFn()
        }




        // 审核模块
        let passFn = (value, type) => {
            store.commit('llmsh/ModifyGoodsList', { _id: value._id, type: type })
            //表示是需要通过
            PushModifyPost({ _id: value._id, type: type }).then(value => {
                console.log(value);
            })

        }


        return { radio1, headerList, search, searchFn, radioFn, GoodsList, pageFn, loading, typeData, FormatTime, tabList, passFn }





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
                // flex: 0.7;
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



            .content-box-fyq {
                min-height: 150px;
                display: flex;
                justify-content: space-around;
            }


        }

    }




}
</style>