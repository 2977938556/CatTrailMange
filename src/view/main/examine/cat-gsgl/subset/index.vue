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
                                <input type="text" :value="CatGoodsData.user_id._id" class="smaill_input" disabled>
                            </div>
                            <div>
                                <h1>用户名称</h1>
                                <input type="text" :value="CatGoodsData.user_id.username" class="smaill_input" disabled>
                            </div>
                            <div>
                                <h1>发布时间</h1>
                                <input type="text" :value="FormatTime(CatGoodsData)" class="smaill_input" disabled>
                            </div>
                        </li>
                        <li class="c">
                            <h1>故事内容</h1>
                            <textarea class="max_imput" :value="CatGoodsData.content" disabled></textarea>
                        </li>
                        <li class="d">
                            <h1>上传的封面</h1>
                            <div>
                                <img v-for="(item, index) in CatGoodsData.imageUrl" :key="index" :src="item" alt="">
                            </div>
                        </li>
                        <li class="e">
                            <h1>操作</h1>
                            <div class="btn">
                                <!-- 这里是已经审核通过的模块 -->
                                <div v-if="CatGoodsData.to_examine == 'pass'">
                                    <el-popconfirm title="是否下线该帖子" @confirm="passFn(CatGoodsData, 'offine')">
                                        <template #reference>
                                            <el-button :plain="true" type="success">下线</el-button>
                                        </template>
                                    </el-popconfirm>
                                </div>
                                <!-- 这里是待审核的状态 -->
                                <div v-else-if="CatGoodsData.to_examine == 'examine'">
                                    <el-popconfirm title="是否通过该帖子" @confirm="passFn(CatGoodsData, 'pass')">
                                        <template #reference>
                                            <el-button size="small" :plain="true" type="primary"
                                                icon="Select">通过</el-button>
                                        </template>
                                    </el-popconfirm>
                                    <el-popconfirm title="是否不通过该帖子" @confirm="passFn(CatGoodsData, 'nopass')">
                                        <template #reference>
                                            <el-button size="small" :plain="true" type="info"
                                                icon="CloseBold">不通过</el-button>
                                        </template>
                                    </el-popconfirm>
                                    <el-popconfirm title="是否删除该帖子" @confirm="passFn(CatGoodsData, 'delete')">
                                        <template #reference>
                                            <el-button size="small" :plain="true" type="danger"
                                                icon="CloseBold">删除</el-button>
                                        </template>
                                    </el-popconfirm>
                                </div>
                                <!-- 这里是未通过状态 -->
                                <div v-else-if="CatGoodsData.to_examine == 'nopass'">
                                    <el-popconfirm title="是否删除该帖子" @confirm="passFn(CatGoodsData, 'delete')">
                                        <template #reference>
                                            <el-button size="small" :plain="true" type="danger"
                                                icon="CloseBold">删除</el-button>
                                        </template>
                                    </el-popconfirm>
                                </div>

                                <!-- 这里是已下线的状态 -->
                                <div v-else-if="CatGoodsData.to_examine == 'offine'">
                                    <el-popconfirm title="是否不通过该帖子" @confirm="passFn(CatGoodsData, 'pass')">
                                        <template #reference>
                                            <el-button size="small" :plain="true" icon="CloseBold">上线</el-button>
                                        </template>
                                    </el-popconfirm>
                                    <el-popconfirm title="是否删除该帖子" @confirm="passFn(CatGoodsData, 'delete')">
                                        <template #reference>
                                            <el-button size="small" :plain="true" type="danger"
                                                icon="CloseBold">删除</el-button>
                                        </template>
                                    </el-popconfirm>
                                </div>

                                <!-- 这里是已删除 -->
                                <div v-else-if="CatGoodsData.to_examine == 'delete'">
                                    <el-popconfirm title="是否通过该帖子" @confirm="passFn(CatGoodsData, 'examine')">
                                        <template #reference>
                                            <el-button size="small" type="info" :plain="true" icon="Select">恢复</el-button>
                                        </template>
                                    </el-popconfirm>
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
                            <el-table :data="GoodsList" stripe style="width: 100%" v-loading="loading" empty-text="没有数据哦">
                                <el-table-column prop="user_id.username" label="作者名称" width="180" />
                                <el-table-column prop="updated_at" label="发布时间" :formatter="FormatTime" />
                                <el-table-column prop="isApproved" label="状态">
                                    <template #default="scope">
                                        <el-tag class="ml-2" type="success"
                                            v-if="scope.row.to_examine == 'pass'">已通过</el-tag>
                                        <el-tag v-else-if="scope.row.to_examine == 'examine'">待审核</el-tag>
                                        <el-tag v-else class="ml-2" type="danger">未通过审核</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="to_examine" label="操作" width="300">
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
                                                <el-popconfirm title="是否删除该帖子" @confirm="passFnb(scope.row, 'delete')">
                                                    <template #reference>
                                                        <el-button size="small" :plain="true" type="danger"
                                                            icon="CloseBold">删除</el-button>
                                                    </template>
                                                </el-popconfirm>
                                            </div>

                                            <!-- 这里是已下线的状态 -->
                                            <div v-else-if="scope.row.to_examine == 'offine'">
                                                <el-popconfirm title="是否不通过该帖子" @confirm="passFnb(scope.row, 'pass')">
                                                    <template #reference>
                                                        <el-button size="small" :plain="true"
                                                            icon="CloseBold">上线</el-button>
                                                    </template>
                                                </el-popconfirm>
                                                <el-popconfirm title="是否删除该帖子" @confirm="passFnb(scope.row, 'delete')">
                                                    <template #reference>
                                                        <el-button size="small" :plain="true" type="danger"
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
                                <el-table-column prop="_id" label="查看">
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
    name: "Cat_GsglLlmshPage",
    setup() {
        let route = useRoute()
        let store = useStore()


        let radio1 = "全部" // tab模块的默认值
        let id = computed(() => store.state.llmsh.id)// 当前帖子的id

        // 这里是获取的帖子的数据
        let CatGoodsData = ref(null)// 用于保存当前帖子的数据
        // tab 数据模块
        let tabList = ref([
            { name: "全部", label: "whole" },
            { name: "待审核", label: "examine" },
            { name: "在线", label: "pass" },
            { name: "未通过", label: "nopass" },
            { name: "下线", label: "offine" },
            { name: "删除", label: "delete" },
        ])


        let typeDatas = reactive({
            page: 1,
            pageSize: 11,
            total: 0,
            searchVal: "",
            type: "whole",
            typeofs: 'mjgs'
        })// 需要提交接口的参数

        let loading = ref(false)// 设loding模块的判断值
        let GoodsList = computed(() => store.state.llmsh.GoodsList)// 保存数据的模块


        // // 01 获取当前帖子的数据
        watchEffect(() => {
            GetCatId({ id: id.value, typeofs: 'mjgs' }).then(({ result }) => {
                console.log("测试数据", result)
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
        // // 03 审核模块
        let passFn = (value, type) => {
            //表示是需要通过
            // 这里传递的都是一些参数
            PushModifyPost({ _id: value._id, type: type, typeofs: "mjgs" }).then(({ result: { data } }) => {
                store.commit('llmsh/ModifyGoodsList', data)
                CatGoodsData.value.to_examine = type
                console.log(data);
            }).catch(err => {
                console.log(err);
                return ElMessage({
                    message: "修改失败",
                    type: 'error',
                })
            })
        }

        // // 05 这个是列表审核页面
        let passFnb = (row, type) => {
            PushModifyPost({ _id: row._id, type: type, typeofs: "mjgs" }).then(({ result: { data } }) => {
                store.commit('llmsh/ModifyGoodsList', data)
                // 这里还需要注意一个就是当我列表表格中的状态变化了那么我的详情也应该变化
                // 这里我们做一个判断如果当前的id等于详情的id那么我们就赋予新的值
                if (data._id == CatGoodsData.value._id) {
                    CatGoodsData.value.to_examine = type
                }

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