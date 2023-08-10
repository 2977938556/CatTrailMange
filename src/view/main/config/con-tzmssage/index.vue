<template>
    <div class="homebanner">
        <!-- 头部2 -->
        <div class="homebanner-header small">
            <h1>通知数据({{ dialogTableVisibles?.length }})</h1>
            <el-button type="primary" size="large" icon="Plus" @click="dialogTableVisible = true">发布广告</el-button>
        </div>

        <!-- 筛选 -->
        <div class="homebannder-store">
            <ul class="store">
                <li>
                    <p>栏目</p>
                    <el-select v-model="fromData.column" class="m-2" placeholder="Select" size="default">
                        <el-option v-for="item in columnOtion" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </li>

                <li>
                    <p>搜索</p>
                    <div>
                        <el-input class="w-50 m-2" placeholder="输入关键词" v-model="fromData.search"
                            :prefix-icon="Search" />
                    </div>
                </li>
            </ul>

        </div>

        <!-- 表格数据 -->
        <div class="homebanner-table">
            <el-table :data="dialogTableVisibles" v-loading="loading" style="width: 100%" :border="true" empty-text="没有数据哦"
                cell-class-name="custom-row">
                <el-table-column prop="_id" label="ID" />
                <el-table-column prop="title" label="通知内容" />
                <el-table-column prop="column" label="所属栏目" />
                <el-table-column prop="pagepath" label="页面路径" />
                <el-table-column prop="to_examine" label="状态">
                    <template #default="scope">
                        <el-tag class="ml-2" :type="`${scope.row.to_examine == 'pass' ? 'success' : 'info'}`">
                            {{ scope.row.to_examine == 'pass' ? '在线' : '下线了' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="clickCount" label="点击量" />
                <el-table-column prop="to_examine" label="操作">
                    <template #default="scope">
                        <el-button type="primary" :icon="Edit" circle @click="editTab(scope.row)" />
                        <el-button type="danger" :icon="Delete" circle @click="deletaTab(true, scope.row)" />
                    </template>
                </el-table-column>
            </el-table>
        </div>


        <!-- 发布模块 -->
        <div class=" homebanner-dialog">
            <el-dialog v-model="dialogTableVisible" @close="cloneDialog" :title="EditType != null ? '编辑' : '新增'"
                height="100%" width="600px">
                <div class="dialog-content" v-loading="loadings">
                    <div class="input">
                        <div>
                            <p>通知标题</p>
                            <el-input placeholder="1" v-model="inputData.title" />
                        </div>
                        <div>
                            <p>所属栏目</p>
                            <el-select v-model="inputData.column" class="m-2" placeholder="Select">
                                <el-option v-for="item in columnOtion" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </div>
                        <div>
                            <p>页面路径</p>
                            <el-select v-model="inputData.pagepath" class="m-2" placeholder="Select">
                                <el-option v-for="item in pagepathOption" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </div>
                        <div v-if="EditType != null">
                            <p>状态</p>
                            <el-radio-group v-model="EditType.to_examine" class="ml-4">
                                <el-radio label="pass" size="large">上线</el-radio>
                                <el-radio label="nopass" size="large">下线</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="btn">
                        <el-button type="primary" @click="SubmtGuangGao(true)">提交</el-button>
                        <el-button type="info" plain @click="SubmtGuangGao(false)">取消</el-button>
                    </div>
                </div>
            </el-dialog>
        </div>

    </div>
</template>

<script setup>
import { ref, reactive, watch, computed, watchEffect } from 'vue'
import { Search, Edit, Delete, Download, Plus, ZoomIn, CloseBold } from '@element-plus/icons-vue'
import { DeleteGuanGao, PushMessage, GetMessagData, EditMessage, DeleteMessage } from '@/api/config.js'

import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'



let store = useStore()


// 控制是否显示弹窗模块
const dialogTableVisible = ref(false)

// 栏目选项
let columnOtion = [
    {
        value: 'home',
        label: '首页',
    },
    {
        value: 'mjhd',
        label: "猫迹活动"
    },
    {
        value: 'ymzn',
        label: "养猫指南"
    }
]

// 跳转页面选项
let pagepathOption = [
    {
        value: '/catdetail',
        label: '猫迹页面',
    },
    {
        value: '/huodon',
        label: "营销活动页面"
    },
    {
        value: '/home/mjhd',
        label: "猫迹活动页面"
    },
    {
        value: '/home/mjzn',
        label: "养猫指南页面"
    }
]


// 收集表单的数据
let inputData = reactive({
    title: "领养替代购买",// 标题
    column: "home",// 所属栏目
    pagepath: "/catdetail",// 页面路径
})





// 恢复默认值
let cloneDialog = () => {
    EditType.value = null
}



// 提交加载效果
let loadings = ref(false)

// 提交数据
let SubmtGuangGao = (type = false) => {
    if (!type) {
        //  关闭当前模块
        dialogTableVisible.value = false
        return
    } else {
        loadings.value = true
        if (EditType.value == null) {
            // 这里是要提交的
            PushMessage({
                inputData: inputData,
                UserDat: store.state.user.profile
            }).then(({ result }) => {
                // store.commit('config/AdddialogTableVisibles', { playload: [result.data], type: true });
                loadings.value = false
                ElMessage({
                    showClose: true,
                    message: "发布成功",
                    type: 'success',
                })
                // 这里判断是否需要进行获取数据就是先判断是否选中了当前的栏目
                if (fromData.column === inputData.column) {
                    GetTabFn()
                }
                cloneDialog()
            }).catch(({ response }) => {
                loadings.value = false
                ElMessage({
                    showClose: true,
                    message: response?.data.message || "删除失败",
                    type: 'error',
                })
            })
        } else {
            loadings.value = true
            EditMessage({
                inputData: inputData,
                UserDat: store.state.user.profile,
                EditData: EditType.value,// 需要修改的参数
            }).then(({ result }) => {
                // console.log(result, "湖区哦的书j");
                loadings.value = false
                ElMessage({
                    showClose: true,
                    message: "修改成功",
                    type: 'success',
                })
                GetTabFn()
            }).catch(({ response }) => {
                loadings.value = false
                ElMessage({
                    showClose: true,
                    message: response?.data.message || "删除失败",
                    type: 'error',
                })
            })

        }
    }
}


// 获取数据的时候需要提交的数据
let fromData = reactive({
    search: "",
    column: 'home',
})

// 提交的时候加载的状态
let loading = ref(false)

// 表格数据
let dialogTableVisibles = computed(() => store.state.config.messageList)

// 获取数据函数
let GetTabFn = () => {
    loading.value = true
    store.commit('config/AddmessageList', { playload: [], type: true }); // 清空数据
    GetMessagData(fromData).then(({ result: { data } }) => {
        store.commit('config/AddmessageList', { playload: data, type: true });
        loading.value = false;
    }).catch(({ response }) => {
        loading.value = false;
        ElMessage({
            showClose: true,
            message: response?.data.message || "获取数据失败",
            type: 'error',
        })
    })
}


// 监听选项的变化
watch(() => JSON.parse(JSON.stringify(fromData)), (ne, vl) => {
    GetTabFn()
}, {
    immediate: true
})


// 删除模块
let deletaTab = (vals = true, data) => {
    if (vals == true) {
        DeleteMessage({ tabArray: [data] }).then(value => {
            store.commit('config/AddmessageList', { playload: [data], type: false })
        }).catch(({ response }) => {
            ElMessage({
                showClose: true,
                message: response?.data.message || "删除失败",
                type: 'error',
            })
        })
    }
}


// 记录数据的
let EditType = ref(null)

// 编辑按钮
let editTab = (data) => {
    dialogTableVisible.value = true
    // 大致的步骤就是点击编辑按钮的时候将数据赋予给之前的数据里面，然后修改了的话就就基于提交按钮进行判断
    EditType.value = data

    // 同步绑定数据
    inputData.title = data.title;
    inputData.column = data.column;
    inputData.pagepath = data.pagepath
}

</script>


<style lang="less" scoped>
.homebanner {
    width: 100%;
    height: 100%;

    .small {
        padding: 0px 20px 0px 20px;
        background: white;
    }


    // 头部数据
    .homebanner-header {
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgb(244, 244, 244);
    }


    // 筛选模块
    .homebannder-store {
        width: 100%;
        height: 100px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgb(244, 244, 244);


        ul {

            display: flex;
            justify-content: safe;

            li {
                width: auto;
                height: 100%;
                padding-left: 20px;
                display: flex;

                p {
                    line-height: 30px;
                    padding-right: 10px;
                }
            }
        }




    }


    .setsubmit {
        width: 100%;
        padding: 20px;
        background: rgb(222, 238, 255);
        display: flex;
        align-items: center;
    }

    // 表格数据
    .homebanner-table {
        width: 100%;
        height: 500px;
    }


    // 提交弹窗
    .homebanner-dialog {
        width: 100%;

        .dialog-content {
            width: 100%;
            height: 460px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            // border: 1px solid red;

            .input {
                width: 100%;
                height: 230px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;


                div {
                    p {}
                }
            }


            .img {
                height: 100px;
                display: flex;
                align-items: center;
                // border: 1px solid red;

                p {
                    padding-right: 10px;
                }

                .custom-file-upload {
                    width: 100px;
                    height: 100px;
                    cursor: pointer;
                    color: #777777;
                    background: rgb(241, 241, 241);
                    border-radius: 10px;
                    overflow: hidden;
                }

                .fa-cloud-upload {
                    margin-right: 5px;
                }

                img {
                    width: 100px;
                    height: 100px;
                    object-fit: cover;
                    // margin-left: 20px;
                }
            }


            .btn {
                height: 50px;
                display: flex;
                align-items: flex-end;
                justify-content: flex-end;
            }

        }
    }





}

.custom-row {
    height: 20px;
    /* 设置行的高度为 50px */
}
</style>