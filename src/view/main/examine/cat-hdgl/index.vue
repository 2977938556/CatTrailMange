<template>
    <div class="llmsh">
        <div class="content" v-if="$route.meta.path != '/hdglsubmit'">
            <div class="content-header">
                <div class="left">
                    <h1>测试</h1>
                    <p>测试</p>
                </div>
                <div class="right">
                    <!-- 发布活动模块 -->
                    <el-button type="primary" icon="Plus" @click="visible = true">发布活动</el-button>
                    <!-- 搜索模块 -->
                    <div class="input demo-input-size">
                        <el-input clearable v-model="typeData.searchVal" class="w-50 m-2" size="large"
                            placeholder="Please Input" prefix-icon="Search" @blur="searchFn" />
                    </div>
                    <!-- 活动发布模块 -->
                    <CatPromptComponent v-model:visible="visible" @onsubmit="onsubmit" title="发布活动">
                        <template #content>
                            <ul class="inputA">
                                <li class="a">
                                    <h1>帖子标题</h1>
                                    <input v-model="HdFromData.title" type="text" class="lengtn_input">
                                </li>
                                <li class="b">
                                    <div>
                                        <h1>活动人数</h1>
                                        <input v-model="HdFromData.people" type="text" class="smaill_input">
                                    </div>
                                    <div>
                                        <h1>活动报名时间</h1>
                                        <el-date-picker class="times" v-model="HdFromData.time" range-separator="To"
                                            start-placeholder="Start date" end-placeholder="End date"
                                            :default-time="defaultTime" type="datetimerange" />
                                    </div>
                                </li>
                                <li class="d">
                                    <ul>
                                        <li>
                                            <h1>上传图片</h1>
                                            <div>
                                                <label for="upload">
                                                    <Plus />
                                                    <input type="file" @change="imgUpdata" accept="image/*" multiple
                                                        id="upload" style="display: none">
                                                </label>
                                                <img v-if="HdFromData.imgUrl" :src="HdFromData.imgUrl" alt="">
                                            </div>
                                        </li>
                                        <li>
                                            <h1>活动地区</h1>
                                            <input v-model="HdFromData.adds" type="text" class="smaill_input">
                                        </li>
                                    </ul>
                                </li>
                                <li class="e">
                                    <h1>活动内容</h1>
                                    <textarea v-model="HdFromData.content"></textarea>
                                </li>
                            </ul>
                        </template>
                    </CatPromptComponent>

                </div>
            </div>
            <div class="content-box" v-if="GoodsList.length != 0">
                <div class="content-box-table">
                    <!-- 这里是渲染活动列表的 -->
                    <el-table :data="GoodsList" :border=true :stripe="true" v-loading="loading" empty-text="没有数据哦"
                        :default-sort="[{ prop: 'to_examine', order: 'ascending' }]" :sort-by="sortBy" style="width: 100%">
                        <!-- <el-table-column type="index" label="序号" start-index="0"  width="60" /> -->
                        <el-table-column prop="user_id.username" label="活动负责人" />
                        <el-table-column prop="title" label="活动名称" width="300">
                            <template #default="scope">
                                <el-popover placement="top-start" :width="200" trigger="hover" :content="scope.row.content">
                                    <template #reference>
                                        {{ scope.row.content.slice(0, 16) + '...' }}
                                    </template>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column prop="time" label="活动时间">
                            <template #default="scope">
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
                                <el-tag v-if="scope.row.to_examine === 'end'" type="success" class="ml-2">活动结束</el-tag>
                                <el-tag v-if="scope.row.to_examine === 'cancellation'" type="info"
                                    class="ml-2">活动取消</el-tag>
                                <el-tag v-if="scope.row.to_examine === 'delete'" class="ml-2" type="warning">活动被删除</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="to_examine" label="操作" :width="300">
                            <template #default="scope">
                                <div v-if="scope.row.to_examine === 'progress'">
                                    <el-popconfirm title="结束活动" @confirm="passFnb(scope.row, 'end')">
                                        <template #reference>
                                            <el-button size="small" type="primary" icon="CircleCloseFilled">结束</el-button>
                                        </template>
                                    </el-popconfirm>
                                    <el-popconfirm title="取消活动" @confirm="passFnb(scope.row, 'cancellation')">
                                        <template #reference>
                                            <el-button size="small" icon="Close" type="info">取消</el-button>
                                        </template>
                                    </el-popconfirm>
                                    <el-popconfirm title="删除活动" @confirm="passFnb(scope.row, 'delete')">
                                        <template #reference>
                                            <el-button size="small" type="warning" icon="Select">删除</el-button>
                                        </template>
                                    </el-popconfirm>
                                </div>
                                <div v-if="scope.row.to_examine === 'end'">
                                    <el-button size="small" type="success" icon="CircleCloseFilled" disabled>结束</el-button>
                                </div>
                                <div v-if="scope.row.to_examine === 'cancellation'">
                                    <el-button size="small" icon="Close" type="info" disabled>取消</el-button>
                                </div>
                                <div v-if="scope.row.to_examine === 'delete'">
                                    <el-button size="small" icon="Delete" type="warning" disabled>删除活动</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="Successful_adoption" label="更多">
                            <template #default="scope">
                                <el-button size="small" @click="GetCatContent(scope.row._id)">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div class="content-box-fyq">
                    <!-- 这里是放分页模块的 -->
                    <div class="subset-content-fyq">
                        <el-pagination background layout="prev, pager, next" :default-current-page="typeData.page"
                            @current-change="pageFn" :page-size="typeData.pageSize" :total="typeData.total" />
                    </div>
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
import { PuhsActivityPost, GetBgData, PushModifyPost } from '@/api/sh.js'
export default {
    name: "CatHdgl",

    setup() {
        let store = useStore()
        let route = useRoute()
        let router = useRouter()


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

        // 控制发布按钮的模块
        let visible = ref(false)

        let loading = ref(false)
        // 搜索的值
        let search = ref('')

        // 这里是搜索的发送请求获取数据
        let searchFn = async (value) => {
            // 这里我们设置了请求的值
            typeData.searchVal = search.value
            GetBgDataFn()
        }



        //  发布模块需要提交的数据
        let HdFromData = reactive({
            imgUrl: null,//
            base64: null,
            imgType: null, // 图片的类型
            title: "【猫迹自愿者活动】割蛋行动 嘿嘿嘿",
            adds: "江西省赣州市芙蓉江新区",
            content: "此次活动主要是捕捉野外的流浪猫，进行割蛋行动，此次活动有一定的危险性，计划为10个人",// 
            time: null,// 发布时间
            people: 10,// 报名的限制人数
        })

        const defaultTime = new Date(2000, 1, 1, 12, 0, 0)
        // 处理图片上传模块
        let imgUpdata = (e) => {
            let file = e.target.files[0]
            if (file.size > 4 * 1024 * 1024) {
                ElMessage({
                    message: '图片超出了2MB',
                    type: 'error',
                })
                return;
            }

            const reader = new FileReader();
            reader.onload = function () {
                const base64 = reader.result;
                // 将base64保存到变量中
                HdFromData.base64 = base64;
                HdFromData.imgType = file.type

                const url = URL.createObjectURL(file);
                // 将url保存到变量中
                HdFromData.imgUrl = url;

            };
            reader.readAsDataURL(file);
        }

        // 提交模块
        let onsubmit = async (val) => {

            // 这里是验证是否填写了
            for (const key of Object.keys(HdFromData)) {
                if (!HdFromData[key]) {
                    return ElMessage({
                        message: '还有参数未填写', type: 'error',
                    })
                }
            }

            // 提交数据
            try {
                let { result: { data } } = await PuhsActivityPost(HdFromData)
                GetBgDataFn()
                ElMessage({
                    message: '发布成功', type: 'success',
                })

                visible.value = false

            } catch (err) {
                console.log("错误的情况哦");
                return ElMessage({
                    message: '发布失败', type: 'error',
                })

            }

        }


        // 保存数据的模块
        let GoodsList = computed(() => store.state.llmsh.GoodsList)

        // 需要提交的数据
        let typeData = reactive({
            page: store.state.llmsh.page,//store.state.llmsh.page
            pageSize: 10,
            total: 0,
            searchVal: "",
            type: "whole",
            typeofs: "hdgl",
        })


        // 获取数据模块
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



        let GetCatContent = (id) => {
            store.commit('llmsh/AddId', id)
            router.push({
                name: "hdglsubmit",
            });
        }


        let pageFn = (value) => {
            store.commit('llmsh/AddPage', value)
            typeData.page = store.state.llmsh.page
            GetBgDataFn()
        }



        // 列表审核
        let passFnb = (row, type) => {

            PushModifyPost({ _id: row._id, type: type, typeofs: "hdgl" }).then(value => {
                store.commit('llmsh/ModifyGoodsList', { _id: row._id, type: type })
                ElMessage({
                    message: '操作成功',
                    type: 'success',
                })
            }).catch(err => {
                console.log(err);
                ElMessage({
                    message: '操作成功',
                    type: 'error',
                })
            })
        }











        return { searchFn, search, visible, FromTimeArrat, onsubmit, sortBy, defaultTime, imgUpdata, pageFn, FormatTime, HdFromData, loading, typeData, GoodsList, GetCatContent, passFnb }
    }


}
</script>



<style lang="less" scoped>
.demo-date-picker {
    display: flex;
    width: 100%;
    padding: 0;
    flex-wrap: wrap;
}

.demo-date-picker .block {
    padding: 30px 0;
    text-align: center;
    border-right: solid 1px var(--el-border-color);
    flex: 1;
}

.demo-date-picker .block:last-child {
    border-right: none;
}

.demo-date-picker .demonstration {
    display: block;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    margin-bottom: 20px;
}







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
                flex: 0.3;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .el-button {
                    // margin-left: 20px  ;
                }

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




.times {
    z-index: 1000 !important;
}

.inputA {
    h1 {
        padding-bottom: 10px;
    }


    height: 680px;
    // display: flex;
    // flex-direction: column;
    // background: red;
    // justify-content: space-between;

    li {
        height: auto;
        width: 100%;
        margin-bottom: 20px;



        input {
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
            color: rgba(0, 0, 0, 1);
            vertical-align: top;
            background: rgb(240, 240, 240) !important;
            border: none;
            padding-left: 20px;
        }

        .lengtn_input {
            width: 100%;
            height: 38px;
            border-radius: 6px;
            background: rgba(242, 242, 242, 1);
        }

        .smaill_input {
            width: 200px;
            height: 38px;
            opacity: 1;
            border-radius: 6px;
            background: rgba(242, 242, 242, 1);
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
        height: auto;
    }

    .b {
        width: 100%;
        display: flex;
        justify-content: space-between;


        div:nth-child(1) {
            width: 50%;
        }

        div:nth-child(2) {
            width: 50%;
        }


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

        ul {
            display: flex;


            li:nth-child(1) {
                flex: 1;

                div {
                    display: flex;

                    label {
                        display: block;
                        width: 100px;
                        height: 100px;
                        background: #d7d7d7;
                        border-radius: 10px;
                        display: flex;
                        justify-content: center;
                        color: #ef6c14;
                        cursor: pointer;



                        svg {
                            width: 50%;
                        }
                    }

                    img {
                        width: 100px;
                        height: 100px;
                        object-fit: cover;
                        border-radius: 10px;
                        margin-left: 10px;
                        background: #d7d7d7;


                    }
                }

            }

            li:nth-child(2) {
                flex: 1;

                input {
                    padding-left: 10px;

                }
            }

        }
    }

    .e {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        // height: 70px;


        textarea {
            background: rgb(216, 216, 216);
            height: 200px;
            border: none;
            border-radius: 10px;

            font-size: 24px;
            padding: 20px;

        }
    }


}
</style>