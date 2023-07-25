<template>
    <div class="llmsh">
        <div class="content" v-if="$route.meta.path != '/ymznsubmit'">
            <div class="content-header">
                <div class="left">
                    <h1>测试</h1>
                    <p>测试</p>
                </div>
                <div class="right">

                    <div class="input demo-input-size">
                        <el-input clearable v-model="search" class="w-50 m-2" size="large" placeholder="Please Input"
                            prefix-icon="Search" @blur="searchFn" />
                    </div>
                    <el-button type="primary" size="large" icon="Plus" @click="visible = true">发布指南</el-button>
                    <el-radio-group v-model="radio1" size="large" @change="radioFn">
                        <el-radio-button :label="item.name" v-for="item in tabList" :key="item.label" />
                    </el-radio-group>

                    <!-- 活动发布模块 -->
                    <CatPromptComponent v-model:visible="visible" @onsubmit="onsubmit" title="发布活动">
                        <template #content>
                            <ul class="inputA">
                                <li class="a">
                                    <h1>帖子标题</h1>
                                    <input v-model="HdFromData.title" type="text" class="lengtn_input">
                                </li>
                                <!-- <li class="b">
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
                                </li> -->
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
                                        <!-- <li>
                                            <h1>活动地区</h1>
                                            <input v-model="HdFromData.adds" type="text" class="smaill_input">
                                        </li> -->
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
            <div class="content-box">
                <div class="content-box-table">
                    <!-- 这里是渲染活动列表的 -->
                    <el-table :data="GoodsList" :border=true :stripe="true" v-loading="loading" empty-text="没有数据哦"
                        style="width: 100%">
                        <el-table-column prop="title" label="指南标题" />
                        <el-table-column prop="_id" label="ID" />
                        <el-table-column prop="updated_at" label="发布时间">
                            <template #default="scope">
                                <p>{{ FromTimeArrat(scope.row.updated_at) }}</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="lable" label="标签">
                            <template #default="scope">
                                <template v-if="scope.row.lable?.length">
                                    <el-tag style="margin-left: 10px;" v-for="(item, index) in scope.row.lable"
                                        :key="index">{{
                                            item }}
                                    </el-tag>
                                </template>
                                <template v-else>
                                    <p>无</p>
                                </template>
                            </template>
                        </el-table-column>



                        <el-table-column prop="to_examine" label="状态" sortable>
                            <template #default="scope">
                                <el-tag class="ml-2" type="success" v-if="scope.row.to_examine == 'pass'">在线</el-tag>
                                <el-tag type="info" v-else-if="scope.row.to_examine == 'examine'">待审核</el-tag>
                                <el-tag type="danger" v-else-if="scope.row.to_examine == 'nopass'">未通过</el-tag>
                                <el-tag type="warning" v-else-if="scope.row.to_examine == 'offine'">下线</el-tag>
                                <el-tag type="danger" v-else-if="scope.row.to_examine == 'delete'">已删除</el-tag>
                            </template>
                        </el-table-column>

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
                                        <el-popconfirm title="是否不通过该帖子" @confirm="passFnb(scope.row, 'pass')">
                                            <template #reference>
                                                <el-button size="small" :plain="true" icon="CloseBold">上线</el-button>
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
import { PushgUuidePost, GetBgData, PushModifyPost } from '@/api/sh.js'
export default {
    name: "CatHdgl",

    setup() {
        let store = useStore()
        let route = useRoute()
        let router = useRouter()









        let radio1 = ref("全部")


        // tab 数据模块
        let tabList = ref([
            { name: "全部", label: "whole" },
            { name: "待审核", label: "examine" },
            { name: "在线", label: "pass" },
            { name: "未通过", label: "nopass" },
            { name: "下线", label: "offine" },
            { name: "删除", label: "delete" },
        ])


        // 点击菜单获取不同的参数
        // 这个是筛选按钮的模块
        let radioFn = (val) => {
            // 这里查询到数据并赋予 最后重新发送请求获取数据
            let index = tabList.value.findIndex(item => item.name == val)
            typeData.type = tabList.value[index].label
            typeData.page = 1
            GetBgDataFn()
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
            size: 0,
            name: "",
            title: "【猫迹自愿者活动】割蛋行动 嘿嘿嘿",
            content: "此次活动主要是捕捉野外的流浪猫，进行割蛋行动，此次活动有一定的危险性，计划为10个人",// 
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
                HdFromData.name = file.name
                HdFromData.size = file.size

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
                // 图片数据
                let FormDataList = [
                    { base64: HdFromData.base64, name: HdFromData.name, size: HdFromData.size }
                ]
                // 用户数据
                let UserDat = store.state.user.profile;
                // 表单数据
                let inputData = {
                    title: HdFromData.title,
                    content: HdFromData.content
                }

                let result = await PushgUuidePost({ FormDataList, UserDat, inputData })
                // GetBgDataFn()
                ElMessage({
                    message: '发布成功', type: 'success',
                })

                visible.value = false

            } catch (err) {
                console.log(err);
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
            typeofs: "ymzn",
            store: -1,
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





        // 这个是点击会跳转到详情页面
        let GetCatContent = (id) => {
            store.commit('llmsh/AddId', id)
            router.push({
                name: "ymznsubmit",
            });
        }


        // 这个是设置当前页面
        let pageFn = (value) => {
            store.commit('llmsh/AddPage', value)
            typeData.page = store.state.llmsh.page
            GetBgDataFn()
        }



        // 列表审核模块
        let passFnb = (row, type) => {
            console.log(type);
            PushModifyPost({ _id: row._id, type: type, typeofs: "ymzn" }).then(({ result: { data } }) => {
                // 这里是修改本地vuex中的数据
                store.commit('llmsh/ModifyGoodsList', data)
                ElMessage({
                    message: '修改成功',
                    type: 'success',
                })
            }).catch(err => {
                ElMessage({
                    message: '修改势必',
                    type: 'error',
                })
            })
        }











        return { searchFn, search, visible, FromTimeArrat, radioFn, onsubmit, defaultTime, tabList, radio1, imgUpdata, pageFn, FormatTime, HdFromData, loading, typeData, GoodsList, GetCatContent, passFnb }
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
    // border-radius: 10px;
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
                flex: 0.6;
                display: flex;
                justify-content: space-between;
                align-items: center;
                // padding-left: 20px;

                // border: 1px solid red;

                // .el-button {
                //     // margin-left: 20px  ;
                // }

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