<template>
    <div class="llmsh">
        <div class="content" v-if="$route.meta.path != '/llmglsubmit'">
            <div class="content-header">
                <div class="left">
                    <h1>{{ radio1 }}&nbsp&nbsp:&nbsp&nbsp</h1>
                    <p>{{ typeData.total }}&nbsp条</p>
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
            <div class="content-box" v-if="GoodsList">
                <div class="content-box-table">
                    <el-table :data="GoodsList" :border=true :stripe="true" v-loading="loading" empty-text="没有数据哦"
                        :default-sort="[{ prop: 'updated_at', order: 'ascending' }, { prop: 'to_examine', order: 'ascending' }]"
                        style="width: 100%">
                        <el-table-column prop="user_id.username" label="用户名称" />
                        <el-table-column prop="addrs.fullLocation" label="地区" width="280" />
                        <el-table-column prop="Successful_adoption" label="是否被申请" width="120">
                            <template #default="scope">
                                <p v-if="scope.row.Successful_adoption">已被领养</p>
                                <p v-else>无被领养</p>

                            </template>
                        </el-table-column>
                        <el-table-column prop="title" label="标题" :formatter="SelectString">
                            <template #default="scope">
                                <el-tooltip placement="top">
                                    <template #content>{{ scope.row.title }}</template>
                                    <p>{{ SelectString(scope.row.title) }}</p>
                                </el-tooltip>
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
                                <el-tag class="ml-2" type="success" v-if="scope.row.to_examine == 'pass'">在线</el-tag>
                                <el-tag type="info" v-else-if="scope.row.to_examine == 'examine'">待审核</el-tag>
                                <el-tag type="danger" v-else-if="scope.row.to_examine == 'nopass'">未通过</el-tag>
                                <el-tag type="warning" v-else-if="scope.row.to_examine == 'offine'">下线</el-tag>
                                <el-tag type="danger" v-else-if="scope.row.to_examine == 'delete'">已删除</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="updated_at" label="发布时间" sortable :formatter="FormatTime" />
                        <el-table-column prop="to_examine" label="审核" class="examine" width="500px" sortable>
                            <template #default="scope">
                                <div class="btn">
                                    <!-- 这里是已经审核通过的模块 -->
                                    <div v-if="scope.row.to_examine == 'pass'">
                                        <el-popconfirm title="是否下线该帖子" @confirm="passFnb(scope.row, 'offine')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">下线</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </div>
                                    <!-- 这里是待审核的状态 -->
                                    <div v-else-if="scope.row.to_examine == 'examine'">
                                        <el-popconfirm title="是否通过该帖子" @confirm="passFnb(scope.row, 'pass')">
                                            <template #reference>
                                                <el-button size="small" :plain="true" type="primary"
                                                    icon="Select">通过</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="是否不通过该帖子" @confirm="passFnb(scope.row, 'nopass')">
                                            <template #reference>
                                                <el-button size="small" :plain="true" type="info"
                                                    icon="CloseBold">不通过</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="是否删除该帖子" @confirm="passFnb(scope.row, 'delete')">
                                            <template #reference>
                                                <el-button size="small" :plain="true" type="danger"
                                                    icon="CloseBold">删除</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </div>
                                    <!-- 这里是未通过状态 -->
                                    <div v-else-if="scope.row.to_examine == 'nopass'">
                                        <el-popconfirm title="是否不通过该帖子" @confirm="passFnb(scope.row, 'delete')">
                                            <template #reference>
                                                <el-button size="small" :plain="true" type="danger"
                                                    icon="CloseBold">删除</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </div>

                                    <!-- 这里是已下线的状态 -->
                                    <div v-else-if="scope.row.to_examine == 'offine'">
                                        <el-popconfirm title="上线" @confirm="passFnb(scope.row, 'pass')">
                                            <template #reference>
                                                <el-button size="small" :plain="true" icon="CloseBold">上线</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="是否不通过该帖子" @confirm="passFnb(scope.row, 'delete')">
                                            <template #reference>
                                                <el-button size="small" type="danger" :plain="true"
                                                    icon="CloseBold">删除</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </div>

                                    <!-- 这里是已删除 -->
                                    <div v-else-if="scope.row.to_examine == 'delete'">
                                        <el-popconfirm title="是否通过该帖子" @confirm="passFnb(scope.row, 'examine')">
                                            <template #reference>
                                                <el-button size="small" type="info" :plain="true"
                                                    icon="Select">恢复</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </div>

                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="more" label="更多">
                            <template #default="scope">
                                <el-button type="success" @click="GetCatContent(scope.row._id)">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div class="content-box-fyq">
                    <el-pagination background :page-size="typeData.pageSize" :default-current-page="typeData.page"
                        layout="prev, pager, next" :total="typeData.total" @current-change="pageFn" />
                </div>

            </div>


        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, reactive, watch } from 'vue'
import { FormatTime } from '@/utils/time.js'
import { ElMessage } from 'element-plus'



import { GetBgData, PushModifyPost } from '@/api/sh.js'
export default {
    name: "CatLlmsh",

    setup() {
        let store = useStore()
        let route = useRoute()
        let router = useRouter()

        // 设置按钮状态的
        let radio1 = ref("待审核")



        // 加载的判断值
        let loading = ref(false);


        // 这个是点击发送数据
        let GetCatContent = (val) => {
            store.commit('llmsh/AddId', val)
            router.push({
                name: "llmglsubmit",
            });
        }



        // 搜索的值
        let search = ref('')




        // 这里是搜索的发送请求获取数据
        let searchFn = async (value) => {
            // 这里我们设置了请求的值
            typeData.searchVal = search.value
            GetBgDataFn()
        }

        // 截取其中部分内容
        let SelectString = (value) => {
            if (value.length > 10) {
                return value.slice(0, 10) + "..."
            }
            return value.slice(0, 10)
        }







        // 保存数据的模块
        let GoodsList = computed(() => store.state.llmsh.GoodsList)

        // 需要提交的数据
        let typeData = reactive({
            page: store.state.llmsh.page,
            pageSize: 10,
            total: 0,
            searchVal: "",
            type: "examine",
            typeofs: "llm",
        })


        // Tab模块数据

        // tab 数据模块
        let tabList = ref([
            { name: "全部", label: "whole" },
            { name: "待审核", label: "examine" },
            { name: "在线", label: "pass" },
            { name: "未通过", label: "nopass" },
            { name: "下线", label: "offine" },
            { name: "删除", label: "delete" },
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



        watch(() => route.path, (newval, olval) => {
            GetBgDataFn()
        }, { immediate: true })



        // 分页器模块
        // 这个是分页器设置的模式数据
        let pageFn = (value) => {
            store.commit('llmsh/AddPage', value)
            typeData.page = store.state.llmsh.page
            console.log(store.state.llmsh.page);
            GetBgDataFn()
        }




        // 审核模块
        let passFnb = (value, type) => {
            //表示是需要通过
            // 这里传递的都是一些参数
            PushModifyPost({ _id: value._id, type: type, typeofs: "llm" }).then(({ result: { data } }) => {
                store.commit('llmsh/ModifyGoodsList', data)



            }).catch(err => {
                console.log(err);
                return ElMessage({
                    message: "修改失败",
                    type: 'error',
                })
            })
        }


        return { radio1, search, searchFn, radioFn, GoodsList, GetCatContent, passFnb, pageFn, loading, typeData, FormatTime, tabList, SelectString }





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


            .content-box-table {
                min-height: 600px;
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