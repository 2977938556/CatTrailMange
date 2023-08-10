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
                        <li class="a">
                            <h1>帖子标题</h1>
                            <input type="text" :value="CatGoodsData.title" class="lengtn_input">
                        </li>
                        <li class="b">
                            <div>
                                <h1>组织者ID</h1>
                                <input type="text" :value="CatGoodsData.user_id._id" class="smaill_input">
                            </div>
                            <div>
                                <h1>组织着名称</h1>
                                <input type="text" :value="CatGoodsData.user_id.username" class="smaill_input">
                            </div>
                            <div>
                                <h1>活动时间</h1>
                                <!-- <input type="text" :value="CatGoodsData.time" class="smaill_input"> -->
                                <el-date-picker class="times" :model-value="CatGoodsData.time" range-separator="To"
                                    start-placeholder="Start date" end-placeholder="End date" :default-time="defaultTime"
                                    type="datetimerange" />
                            </div>
                        </li>
                        <li class="c">
                            <h1>故事内容</h1>
                            <textarea class="max_imput" :value="CatGoodsData.content"></textarea>
                        </li>
                        <li class="d">
                            <h1>上传的封面</h1>
                            <div>
                                <img v-for="(item, index) in CatGoodsData.imageUrl" :key="index" :src="item" alt="">
                            </div>
                        </li>
                        <li class="e">
                            <h1>操作</h1>
                            <div v-if="CatGoodsData.to_examine === 'progress'">
                                <el-popconfirm title="结束活动" @confirm="passFn(CatGoodsData, 'end')">
                                    <template #reference>
                                        <el-button size="small" type="primary" icon="CircleCloseFilled">结束</el-button>
                                    </template>
                                </el-popconfirm>
                                <el-popconfirm title="取消活动" @confirm="passFn(CatGoodsData, 'cancellation')">
                                    <template #reference>
                                        <el-button size="small" icon="Close" type="info">取消</el-button>
                                    </template>
                                </el-popconfirm>
                                <el-popconfirm title="删除活动" @confirm="passFn(CatGoodsData, 'delete')">
                                    <template #reference>
                                        <el-button size="small" type="warning" icon="Select">删除</el-button>
                                    </template>
                                </el-popconfirm>
                            </div>
                            <div v-if="CatGoodsData.to_examine === 'end'">
                                <el-button size="small" type="success" icon="CircleCloseFilled" disabled>结束</el-button>
                            </div>
                            <div v-if="CatGoodsData.to_examine === 'cancellation'">
                                <el-button size="small" icon="Close" type="info" disabled>取消</el-button>
                            </div>
                            <div v-if="CatGoodsData.to_examine === 'delete'">
                                <el-button size="small" icon="Delete" type="warning" disabled>删除活动</el-button>
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
                                <!-- <CatLlmglRadio :radio1="radio1" :tabList="tabList" @changes="radioFn" /> -->
                                <el-radio-group v-model="radio1" size="large" @change="radioFn">
                                    <el-radio-button :label="item.name" v-for="item in tabList" :key="item.label" />
                                </el-radio-group>
                            </div>
                        </div>
                        <div class="subset-content-table">
                            <el-table :data="GoodsList" :border=true :stripe="true" v-loading="loading" empty-text="没有数据哦"
                                :default-sort="[{ prop: 'to_examine', order: 'ascending' }]" :sort-by="sortBy"
                                style="width: 100%">
                                <!-- <el-table-column type="index" label="序号" start-index="0"  width="60" /> -->
                                <el-table-column prop="title" label="活动标题" width="100">
                                    <template #default="scope">
                                        <el-popover placement="top-start" trigger="hover" :content="scope.row.content">
                                            <template #reference>
                                                {{ scope.row.content.slice(0, 10) + '...' }}
                                            </template>
                                        </el-popover>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="time" label="活动时间">
                                    <template #default="scope">
                                        <!-- {{ scope.row.time[0] }} -->
                                        {{ FromTimeArrat(scope.row.time[0]) }}-
                                        {{ FromTimeArrat(scope.row.time[1]) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="people" label="报名人数">
                                    <template #default="scope">
                                        <h5 style="color: rgba(255, 124, 0, 1);">{{
                                            `已报名(${scope.row.participant.length})/计划:${scope.row.people}` }}</h5>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="to_examine" label="活动状态" sortable>
                                    <template #default="scope">
                                        <el-tag v-if="scope.row.to_examine === 'progress'" class="ml-2">活动报名中</el-tag>
                                        <el-tag v-if="scope.row.to_examine === 'end'" type="success"
                                            class="ml-2">活动结束</el-tag>
                                        <el-tag v-if="scope.row.to_examine === 'cancellation'" type="info"
                                            class="ml-2">活动取消</el-tag>
                                        <el-tag v-if="scope.row.to_examine === 'delete'" class="ml-2"
                                            type="warning">活动被删除</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="to_examine" label="操作" width="240">
                                    <template #default="scope">
                                        <div v-if="scope.row.to_examine === 'progress'">
                                            <el-popconfirm title="结束活动" @confirm="passFnb(scope.row, 'end')">
                                                <template #reference>
                                                    <el-button size="small" type="primary" :plain="true"
                                                        icon="CircleCloseFilled">结束</el-button>
                                                </template>
                                            </el-popconfirm>
                                            <el-popconfirm title="取消活动" @confirm="passFnb(scope.row, 'cancellation')">
                                                <template #reference>
                                                    <el-button size="small" :plain="true" icon="Close"
                                                        type="info">取消</el-button>
                                                </template>
                                            </el-popconfirm>
                                            <el-popconfirm title="删除活动" @confirm="passFnb(scope.row, 'delete')">
                                                <template #reference>
                                                    <el-button :plain="true" size="small" type="warning"
                                                        icon="Select">删除</el-button>
                                                </template>
                                            </el-popconfirm>
                                        </div>
                                        <div v-if="scope.row.to_examine === 'end'">
                                            <el-button size="small" :plain="true" type="success" icon="CircleCloseFilled"
                                                disabled>结束</el-button>
                                        </div>
                                        <div v-if="scope.row.to_examine === 'cancellation'">
                                            <el-button size="small" :plain="true" icon="Close" type="info"
                                                disabled>取消</el-button>
                                        </div>
                                        <div v-if="scope.row.to_examine === 'delete'">
                                            <el-button size="small" :plain="true" icon="Delete" type="warning"
                                                disabled>删除活动</el-button>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="Successful_adoption" label="更多">
                                    <template #default="scope">
                                        <el-button size="small" @click="GetCatIdData(scope.row._id)">查看</el-button>
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
import { GetCatId } from '@/api/sh.js'
import { useRoute } from 'vue-router'
import { FormatTime, FromTimeArrat } from '@/utils/time.js'
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
            { name: "报名中", label: "progress" },
            { name: "结束", label: "end" },
            { name: "取消", label: "cancellation" },
            { name: "删除", label: "delete" },
        ])

        const defaultTime = new Date(2000, 1, 1, 12, 0, 0)

        let typeDatas = reactive({
            page: 1,
            pageSize: 8,
            total: 0,
            searchVal: "",
            type: "whole",
            typeofs: 'mjhd'
        })// 需要提交接口的参数

        let loading = ref(false)// 设loding模块的判断值
        let GoodsList = computed(() => store.state.llmsh.GoodsList)// 保存数据的模块

        let sortBy = (a, b) => {
            console.log(a);
            const order = (this.$refs.table.sortOrder === 'ascending') ? 1 : -1;
            const stateToValue = {
                'progress': -1, // 这里设为 -1，保证 progress 总是排在最前面
                'end': 0,
                'cancellation': 1,
                'delete': 2
            };
            const aValue = stateToValue[a.to_examine];
            const bValue = stateToValue[b.to_examine];
            return (aValue - bValue) * order;
        }


        // // 01 获取当前帖子的数据
        watchEffect(() => {
            GetCatId({ id: id.value, typeofs: 'mjhd' }).then(({ result }) => {
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
        let passFn = (values, type) => {
            // 这里会传递一个帖子的id是需要通过还是取消的模块
            PushModifyPost({ _id: values._id, type: type, typeofs: "mjhd" }).then(({ result: { data } }) => {
                store.commit('llmsh/ModifyGoodsList', data)
                // // 这里我们先将本地的数据获取
                CatGoodsData.value.to_examine = type
                ElMessage({
                    message: '操作成功',
                    type: 'success',
                })
            }).catch(err => {
                console.log(err);
                ElMessage({
                    message: '操作失败',
                    type: 'warning',
                })
            })
        }



        // // 05 这个是列表审核页面

        let passFnb = (row, type) => {
            PushModifyPost({ _id: row._id, type: type, typeofs: "mjhd" }).then(({ result: { data } }) => {
                store.commit('llmsh/ModifyGoodsList', data)
                if (data._id === CatGoodsData.value._id) {
                    CatGoodsData.value.to_examine = type
                }

                ElMessage({
                    message: '操作成功',
                    type: 'success',
                })
            }).catch(err => {
                console.log(err);
                ElMessage({
                    message: '操作失败',
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

        return { CatGoodsData, id, FormatTime, FromTimeArrat, passFn, radioFn, sortBy, GoodsList, searchFn, defaultTime, GetCatIdData, typeDatas, loading, search, tabList, radio1, FormatTime, pageFn, passFnb }
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
                            // margin-top: 10px;
                            display: flex;
                        }

                        h1 {
                            padding-bottom: 10px;
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
                            width: 100px;
                            height: 38px;
                            opacity: 1;
                            border-radius: 6px;
                            background: rgba(242, 242, 242, 1);
                            // margin-top: 10px;
                        }

                        .max_imput {
                            width: 100%;
                            height: 160px;
                            border-radius: 6px;
                            // margin-top: 10px;
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
                        width: 100%;
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