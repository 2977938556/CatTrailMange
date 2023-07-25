<template>
    <div class="subset">
        <!-- 头部组件数据 -->
        <CatLlmshHeader v-if="CatGoodsData" :catData="CatGoodsData">
        </CatLlmshHeader>

        <div class="subset-content">
            <div class="subset-content-left">
                <div class="subset-content-left-content">
                    <el-skeleton :rows="5" v-if="!CatGoodsData" />
                    <ul v-else>
                        <li class="b">
                            <div>
                                <h1>用户id</h1>
                                <input type="text" :value="CatGoodsData._id" class="smaill_input" disabled>
                            </div>
                            <div>
                                <h1>用户名称</h1>
                                <input type="text" :value="CatGoodsData.username" class="smaill_input" disabled>
                            </div>
                            <div>
                                <h1>注册时间</h1>
                                <input type="text" :value="FormatTime(CatGoodsData)" class="smaill_input" disabled>
                            </div>
                        </li>
                        <li class="c">
                            <div>
                                <h1>标语</h1>
                                <input type="text" :value="CatGoodsData.slogin" class="smaill_input" disabled>
                            </div>
                        </li>
                        <li class="d">
                            <h1>用户头像</h1>
                            <div>
                                <img :src="CatGoodsData.bgimgUrl" alt="">
                            </div>
                        </li>
                        <li class="e">
                            <h1>操作</h1>
                            <div class="btn">
                                <div class="btn">
                                    <!-- 这里是普通用户 -->
                                    <div v-if="CatGoodsData.role == 'user'">
                                        <el-popconfirm title="修改为管理员" @confirm="passFn(CatGoodsData, 'admin')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">修改为管理员</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="修改为机构" @confirm="passFn(CatGoodsData, 'institution')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">修改为机构</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="修改为商家" @confirm="passFn(CatGoodsData, 'business')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">修改为商家</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="删除该用户" @confirm="passFn(CatGoodsData, 'delete')">
                                            <template #reference>
                                                <el-button :plain="true" type="danger">删除该用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="封禁该用户" @confirm="passFn(CatGoodsData, 'ban')">
                                            <template #reference>
                                                <el-button :plain="true" type="danger">封禁该用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </div>

                                    <!-- 这里是管理员状态 -->
                                    <div v-else-if="CatGoodsData.role == 'admin'">
                                        <el-popconfirm title="修改为普通用户" @confirm="passFn(CatGoodsData, 'user')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">修改为普通用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="修改为机构" @confirm="passFn(CatGoodsData, 'institution')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">修改为机构</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="修改为商家" @confirm="passFn(CatGoodsData, 'business')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">修改为商家</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="封禁该i用户" @confirm="passFn(CatGoodsData, 'delete')">
                                            <template #reference>
                                                <el-button :plain="true" type="danger">删除该用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </div>
                                    <!-- 这里是被封禁的状态 -->
                                    <div v-else-if="CatGoodsData.role == 'ban'">
                                        <el-popconfirm title="取消封禁" @confirm="passFn(CatGoodsData, 'delete')">
                                            <template #reference>
                                                <el-button size="small" :plain="true" type="success"
                                                    icon="CloseBold">取消封禁</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="删除该用户" @confirm="passFn(CatGoodsData, 'delete')">
                                            <template #reference>
                                                <el-button :plain="true" type="danger">删除该用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </div>

                                    <!-- 这里是已经被删除的用户 -->
                                    <div v-else-if="CatGoodsData.role == 'delete'">
                                        <el-popconfirm title="恢复该用户" @confirm="passFn(CatGoodsData, 'user')">
                                            <template #reference>
                                                <el-button size="small" :plain="true" type="success"
                                                    icon="CloseBold">恢复该用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="删除该用户" @confirm="passFn(CatGoodsData, 'delete')">
                                            <template #reference>
                                                <el-button :plain="true" type="danger">删除该用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </div>

                                    <!-- 这里是机构模块 -->
                                    <div v-else-if="CatGoodsData.role == 'institution'">
                                        <el-popconfirm title="修改为普通用户" @confirm="passFn(CatGoodsData, 'user')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">修改为普通用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="修改为商家" @confirm="passFn(CatGoodsData, 'business')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">商家</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="删除该用户" @confirm="passFn(CatGoodsData, 'delete')">
                                            <template #reference>
                                                <el-button :plain="true" type="danger">删除该用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </div>


                                    <!-- 这里是商家模块 -->
                                    <div v-else-if="CatGoodsData.role == 'business'">
                                        <el-popconfirm title="修改为普通用户" @confirm="passFn(CatGoodsData, 'user')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">修改为普通用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="修改为机构" @confirm="passFn(CatGoodsData, 'institution')">
                                            <template #reference>
                                                <el-button :plain="true" type="success">修改为机构</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm title="删除该用户" @confirm="passFn(CatGoodsData, 'delete')">
                                            <template #reference>
                                                <el-button :plain="true" type="danger">删除该用户</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </div>

                                </div>

                            </div>
                        </li>
                    </ul>
                </div>
            </div>


            <div class="subset-content-right">
                <div class="subset-content-right-list">
                    <div class="submit-center">
                        <div class="subset-content-tight-header">
                            <div class="left">
                                <CatSearchInput @changes="searchFn" />
                            </div>
                            <div class="right">
                                <CatLlmglRadio :radio1="radio1" :tabList="tabList" @changes="radioFn" />
                            </div>
                        </div>

                        <div class="subset-content-table">
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
                                        <el-button type="success" @click="GetCatIdData(scope.row._id)">查看</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>


                        <div class="subset-content-fyq">
                            <el-pagination background layout="prev, pager, next" @current-change="pageFn"
                                :page-size="typeDatas.pageSize" :total="typeDatas.total" />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { FormatTime } from '@/utils/time.js'
import { GetCatId } from '@/api/sh.js'
import { useRoute } from 'vue-router'
import { ref, reactive, computed, watch, watchEffect } from 'vue'
import { PushModifyPost, GetBgData } from '@/api/sh.js'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'




export default {
    name: "Cat_LlmglSubmittPage",
    setup() {
        let route = useRoute()
        let store = useStore()


        let radio1 = "全部" // tab模块的默认值
        let id = computed(() => store.state.llmsh.id)// 当前帖子的id
        // 这里是获取的帖子的数据
        let CatGoodsData = ref(null)// 用于保存当前帖子的数据
        let tabList = ref([
            { name: "全部", label: "whole" },
            { name: "普通用户", label: "user" },
            { name: "管理员", label: "admin" },
            { name: "被封禁", label: "ban" },
            { name: "机构", label: "institution" },
            { name: "商户", label: "business" },
        ])


        let typeDatas = reactive({
            page: 1,
            pageSize: 11,
            total: 0,
            searchVal: "",
            type: "whole",
            typeofs: "yhgl",

        })// 需要提交接口的参数

        let loading = ref(false)// 设loding模块的判断值
        let GoodsList = computed(() => store.state.llmsh.GoodsList)// 保存数据的模块


        // // 01 获取当前帖子的数据
        watchEffect(() => {
            GetCatId({ id: id.value, typeofs: "yhgl" }).then(({ result }) => {
                console.log(result);
                CatGoodsData.value = result.data
            }).catch(err => {
                CatGoodsData.value = null
            })
        })


        // // 02 获取用户当前模块的tab数据
        let GetBgDataFn = () => {
            loading.value = true;
            GetBgData(typeDatas).then(({ result }) => {
                // 将数据给响应性数据的变量
                store.commit('llmsh/AddGoodsList', result.data)
                // 更新总条数
                typeDatas.total = result.total
                loading.value = false;

            }).catch(err => {
                //这里获取数据失败的情况
                return ElMessage({
                    message: "获取数据失败",
                    type: 'error',
                })
            })
        }

        watch(() => typeDatas.type, (newvalue, olvalue) => {
            if (newvalue != olvalue) {
                GetBgDataFn()
            }
        }, { immediate: true })


        // // 04 这个是筛选按钮的模块
        let radioFn = (val) => {
            // 这里查询到数据并赋予 最后重新发送请求获取数据
            let index = tabList.value.findIndex(item => item.name == val)
            store.commit('llmsh/AddTYpe', tabList.value[index].label)
            typeDatas.type = store.state.llmsh.type
            typeDatas.page = 1

            GetBgDataFn()
        }


        // 这个是点击查看更多的时候显示的
        let GetCatIdData = (val) => {
            store.commit('llmsh/AddId', val)
        }

        // // 03 审核模块
        let passFn = (value, type) => {
            //表示是需要通过
            // 这里传递的都是一些参数
            PushModifyPost({ _id: value._id, type: type, typeofs: "yhgl" }).then(({ result: { data } }) => {
                store.commit('llmsh/ModifyGoodsList', data)
                CatGoodsData.value.role = type
            }).catch(err => {
                console.log(err);
                return ElMessage({
                    message: "修改失败",
                    type: 'error',
                })
            })
        }






        // // 05 这个是列表审核页面
        let passFnb = (value, type) => {
            //表示是需要通过
            // 这里传递的都是一些参数
            PushModifyPost({ _id: value._id, type: type, typeofs: "yhgl" }).then(({ result: { data } }) => {
                store.commit('llmsh/ModifyGoodsList', data)

                if (data._id === CatGoodsData.value._id) {
                    CatGoodsData.value.role = type
                }


                return ElMessage({
                    message: "修改成功",
                    type: 'success',
                })
            }).catch(err => {
                console.log(err);
                return ElMessage({
                    message: "修改失败",
                    type: 'error',
                })
            })
        }

        // // 搜索的值
        let search = ref('')

        // 这里是搜索的发送请求获取数据
        let searchFn = async (value) => {
            // 这里我们设置了请求的值
            typeDatas.searchVal = value
            GetBgDataFn()
        }

        // 分页器事件
        let pageFn = (value) => {
            typeDatas.page = value
            GetBgDataFn()
        }

        return { CatGoodsData, id, FormatTime, passFn, radioFn, GoodsList, searchFn, GetCatIdData, typeDatas, loading, search, tabList, radio1, FormatTime, pageFn, passFnb }
    }
}
</script>

<style lang="less" scoped>
* div {
    // border: 1px solid red;
}

.subset {
    width: 98%;
    margin: 20px auto;
    height: 89%;



    // 内容区域
    .subset-content {
        height: 100%;
        min-height: 500px;
        display: flex;
        justify-content: space-between;


        .subset-content-left {
            display: flex;
            flex: 1;

            .subset-content-left-content {
                width: 96%;

                ul {
                    height: 680px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;

                    li {
                        .lengtn_input {
                            width: 100%;
                            height: 38px;
                            border-radius: 6px;
                            background: rgba(242, 242, 242, 1);
                            margin-top: 10px;

                        }

                        input {
                            font-size: 14px;
                            font-weight: 400;
                            line-height: 22px;
                            color: rgba(0, 0, 0, 1);
                            vertical-align: top;
                            // padding-left: 10px;
                        }

                        .smaill_input {
                            width: 200px;
                            height: 38px;
                            opacity: 1;
                            border-radius: 6px;
                            background: rgba(242, 242, 242, 1);
                            margin-top: 10px;
                        }

                        .max_imput {
                            width: 100%;
                            height: 160px;
                            border-radius: 6px;
                            margin-top: 10px;
                            background: rgba(242, 242, 242, 1);
                            font-size: 18px;
                            color: #7F7F7F;
                            // padding: 10px;
                        }
                    }



                    .a {
                        height: 66px;
                    }

                    .b {
                        width: 80%;
                        display: flex;
                        justify-content: space-between;

                        input {
                            padding-left: 10px;
                        }

                        ul {
                            width: 100%;
                            display: flex;
                            justify-content: space-between;


                        }



                    }

                    .d {
                        height: auto;

                        div {
                            // height: 100%;
                            width: 40%;
                            display: flex;
                            justify-content: space-between;

                            img {
                                width: 90px;
                                height: 88px;
                                object-fit: cover;
                                border-radius: 10px;
                                margin-top: 10px;
                            }
                        }
                    }

                    .e {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        height: 70px;
                    }


                }
            }
        }

        .subset-content-right {
            display: flex;
            justify-content: flex-end;
            flex: 1;


            .subset-content-right-list {
                width: 96%;
                background: rgba(242, 242, 242, 1);
                border-radius: 10px;


                .submit-center {
                    width: 96%;
                    height: 100%;
                    // background: red;
                    margin: 0 auto;

                    // 头部区域
                    .subset-content-tight-header {
                        width: 100%;
                        display: flex;
                        height: 60px;

                        .left {
                            flex: 1;
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            // background: blue;
                            // border: 1px solid red;
                        }

                        .right {
                            flex: 1;
                            display: flex;
                            justify-content: flex-end;
                            // background: rgb(224, 17, 17);
                        }
                    }


                    .subset-content-table {
                        min-height: 670px;
                    }

                    .subset-content-fyq {
                        min-height: 100px;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                    }


                }


            }

        }
    }



}
</style>