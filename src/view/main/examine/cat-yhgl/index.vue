<template>
    <div class="llmsh">
        <div class="content" v-if="$route.meta.path != '/yhglsubmit'">
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
            <div class="content-box" v-if="GoodsList.length">
                <div class="content-box-table">
                    <el-table :data="GoodsList" :border=true :stripe="true" v-loading="loading" empty-text="没有数据哦"
                        :default-sort="[{ prop: 'updated_at', order: 'ascending' }, { prop: 'to_examine', order: 'ascending' }]"
                        style="width: 100%">
                        <el-table-column prop="username" label="用户名称" />

                        <el-table-column prop="role" label="用户类型" sortable>
                            <template #default="scope">
                                <el-tag class="ml-2" type="success" v-if="scope.row.role == 'user'">普通用户</el-tag>
                                <el-tag type="info" v-else-if="scope.row.role == 'admin'">管理员</el-tag>
                                <el-tag type="danger" v-else-if="scope.row.role == 'institution'">合作机构</el-tag>
                                <el-tag type="danger" v-else-if="scope.row.role == 'business'">商家</el-tag>
                                <el-tag type="info" v-else-if="scope.row.role == 'ban'">被封禁</el-tag>
                                <el-tag type="danger" v-else-if="scope.row.role == 'delete'">无当前账户</el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column prop="role" label="状态" sortable>
                            <template #default="scope">
                                <el-tag class="ml-2" type="success" v-if="scope.row.role == 'user'">在线</el-tag>
                                <el-tag type="success" v-else-if="scope.row.role == 'admin'">在线</el-tag>
                                <el-tag type="info" v-else-if="scope.row.role == 'ban'">被封禁</el-tag>
                                <el-tag type="danger" v-else-if="scope.row.role == 'delete'">无当前账户</el-tag>
                                <el-tag type="success" v-else-if="scope.row.role == 'institution'">在线</el-tag>
                                <el-tag type="success" v-else-if="scope.row.role == 'business'">在线</el-tag>
                            </template>
                        </el-table-column>



                        <el-table-column prop="created_at" label="注册时间" sortable>
                            <template #default="scope">
                                <p>{{ FromTimeArrat(scope.row.created_at) }}</p>
                            </template>
                        </el-table-column>

                        <el-table-column prop="to_examine" label="审核" class="examine" width="600px" sortable>
                            <template #default="scope">
                                <div class="btn">
                                    <!-- 这里是普通用户 -->
                                    <div v-if="scope.row.role == 'user'">
                                        <el-popconfirm title="修改为管理员" @confirm="passFnb(scope.row, 'admin')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">修改为管理员</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="修改为机构" @confirm="passFnb(scope.row, 'institution')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">修改为机构</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="修改为商家" @confirm="passFnb(scope.row, 'business')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">修改为商家</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="删除该用户" @confirm="passFnb(scope.row, 'delete')">
                                            <template #reference>
                                                <el-button :plain="true" type="danger">删除该用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="封禁该用户" @confirm="passFnb(scope.row, 'ban')">
                                            <template #reference>
                                                <el-button :plain="true" type="danger">封禁该用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </div>

                                    <!-- 这里是管理员状态 -->
                                    <div v-else-if="scope.row.role == 'admin'">
                                        <el-popconfirm title="修改为普通用户" @confirm="passFnb(scope.row, 'user')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">修改为普通用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="修改为机构" @confirm="passFnb(scope.row, 'institution')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">修改为机构</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="修改为商家" @confirm="passFnb(scope.row, 'business')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">修改为商家</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="封禁该i用户" @confirm="passFnb(scope.row, 'delete')">
                                            <template #reference>
                                                <el-button :plain="true" type="danger">删除该用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </div>
                                    <!-- 这里是被封禁的状态 -->
                                    <div v-else-if="scope.row.role == 'ban'">
                                        <el-popconfirm title="取消封禁" @confirm="passFnb(scope.row, 'delete')">
                                            <template #reference>
                                                <el-button size="small" :plain="true" type="success"
                                                    icon="CloseBold">取消封禁</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="删除该用户" @confirm="passFnb(scope.row, 'delete')">
                                            <template #reference>
                                                <el-button :plain="true" type="danger">删除该用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </div>

                                    <!-- 这里是已经被删除的用户 -->
                                    <div v-else-if="scope.row.role == 'delete'">
                                        <el-popconfirm title="恢复该用户" @confirm="passFnb(scope.row, 'user')">
                                            <template #reference>
                                                <el-button size="small" :plain="true" type="success"
                                                    icon="CloseBold">恢复该用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="删除该用户" @confirm="passFnb(scope.row, 'delete')">
                                            <template #reference>
                                                <el-button :plain="true" type="danger">删除该用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </div>

                                    <!-- 这里是机构模块 -->
                                    <div v-else-if="scope.row.role == 'institution'">
                                        <el-popconfirm title="修改为普通用户" @confirm="passFnb(scope.row, 'user')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">修改为普通用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="修改为商家" @confirm="passFnb(scope.row, 'business')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">商家</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="删除该用户" @confirm="passFnb(scope.row, 'delete')">
                                            <template #reference>
                                                <el-button :plain="true" type="danger">删除该用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </div>


                                    <!-- 这里是商家模块 -->
                                    <div v-else-if="scope.row.role == 'business'">
                                        <el-popconfirm title="修改为普通用户" @confirm="passFnb(scope.row, 'user')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">修改为普通用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="修改为机构" @confirm="passFnb(scope.row, 'institution')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">修改为机构</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="删除该用户" @confirm="passFnb(scope.row, 'delete')">
                                            <template #reference>
                                                <el-button :plain="true" type="danger">删除该用户</el-button>
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
import { FormatTime, FromTimeArrat } from '@/utils/time.js'
import { ElMessage } from 'element-plus'


import { GetBgData, PushModifyPost } from '@/api/sh.js'
export default {
    name: "CatLlmsh",

    setup() {
        let store = useStore()
        let route = useRoute()
        let router = useRouter()

        // 设置按钮状态的
        let radio1 = ref("全部")

        // 加载的判断值
        let loading = ref(false);


        let GetCatContent = (val) => {
            store.commit('llmsh/AddId', val)
            router.push({
                name: "yhglsubmit",
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
            type: "whole",
            typeofs: "yhgl",
        })


        // Tab模块数据

        // tab 数据模块
        let tabList = ref([
            { name: "全部", label: "whole" },
            { name: "普通用户", label: "user" },
            { name: "管理员", label: "admin" },
            { name: "被封禁", label: "ban" },
            { name: "机构", label: "institution" },
            { name: "商户", label: "business" },
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
        let passFnb = (row, type) => {
            console.log(type);
            PushModifyPost({ _id: row._id, type: type, typeofs: "yhgl" }).then(({ result: { data } }) => {
                console.log(data);
                store.commit('llmsh/ModifyGoodsList', data)
                ElMessage({
                    message: '修改成功',
                    type: 'success',
                })
            }).catch(err => {
                console.log(err);
                ElMessage({
                    message: '修改失败',
                    type: 'error',
                })
            })
        }




        return { radio1, search, searchFn, radioFn, GoodsList, GetCatContent, passFnb, pageFn, loading, typeData, FormatTime, tabList, SelectString, FromTimeArrat }





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