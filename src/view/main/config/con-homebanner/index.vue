<template>
    <div class="homebanner">
        <!-- 头部2 -->
        <div class="homebanner-header small">
            <h1>广告列表(1)</h1>
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
                    <p>排序</p>
                    <el-select v-model="fromData.stor" class="m-2" placeholder="Select" size="default">
                        <el-option v-for="item in stor" :key="item.value" :label="item.label" :value="item.value" />
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


        <div class="setsubmit" v-if="multipleSelection.length != 0">
            <el-button type="danger" @click="deletaTab(true)">删除</el-button>
        </div>

        <!-- 表格数据 -->
        <div class="homebanner-table">
            <el-table :data="dialogTableVisibles" v-loading="loading" style="width: 100%" :border="true" empty-text="没有数据哦"
                @selection-change="handleSelectionChange" cell-class-name="custom-row">
                <el-table-column prop="_id" label="选中" type="selection" />
                <el-table-column prop="weight" label="权重" width="80">
                    <template #default="scope">
                        <el-input size="small" :value="scope.row.weight" style="width: 30px;" disabled />
                    </template>
                </el-table-column>
                <el-table-column prop="_id" label="ID" width="180" />
                <el-table-column prop="imageUrl" label="广告图片" width="180">
                    <template #default="scope">
                        <div class="demo-image">
                            <div class="block">
                                <el-image style="width: 100px; height: 60px" :src="scope.row.imageUrl" fit="contain" />
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="广告标题" width="180" />
                <el-table-column prop="column" label="所属栏目" width="180" />
                <el-table-column prop="pagepath" label="页面路径" width="180" />
                <el-table-column prop="to_examine" label="状态" width="180">
                    <template #default="scope">
                        <el-tag class="ml-2" :type="`${scope.row.to_examine == 'pass' ? 'success' : 'info'}`">
                            {{ scope.row.to_examine == 'pass' ? '在线' : '下线了' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="clickCount" label="点击量" width="100" />
                <el-table-column prop="to_examine" label="操作">
                    <template #default="scope">
                        <el-button type="primary" :icon="Edit" circle @click="editTab(scope.row)" />
                        <el-button type="danger" :icon="Delete" circle @click="deletaTab(false, scope.row)" />
                    </template>

                </el-table-column>
            </el-table>
        </div>



        <!-- 发布模块 -->
        <div class="homebanner-dialog">
            <el-dialog v-model="dialogTableVisible" @close="cloneDialog" :title="EditType != null ? '编辑' : '新增'" height="100%"
                width="600px">
                <div class="dialog-content" v-loading="loadings">
                    <div class="input">
                        <div>
                            <p>广告标题</p>
                            <el-input placeholder="1" v-model="inputData.title" />
                        </div>
                        <div>
                            <p>所属栏目</p>
                            <el-select v-model="inputData.weight" class="m-2" placeholder="Select">
                                <el-option v-for="item in weightOption" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
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
                    </div>
                    <div class="img">
                        <p>上传图片</p>
                        <label for="file-upload" class="custom-file-upload">
                            <!-- <i class="fa fa-cloud-upload"></i> -->
                            <img v-if="imageUrl" :src="imageUrl" alt="缩略图">
                        </label>
                        <input id="file-upload" type="file" @change="handleFileChange" style="display: none;">
                    </div>
                    <div v-if="EditType != null">
                        <p>状态</p>
                        <el-radio-group v-model="EditType.to_examine" class="ml-4">
                            <el-radio label="pass" size="large">上线</el-radio>
                            <el-radio label="nopass" size="large">下线</el-radio>
                        </el-radio-group>
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
import { Search, Edit, Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import { PushGuangGao, GetGuangGaoData, DeleteGuanGao, EditGuangGao } from '@/api/config.js'

import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'



let store = useStore()






// 01 上传广告模块
// 收集图片的数据
let imgData = reactive([{
    base64: null,
    name: "",
    size: 0,
}])

const imageUrl = ref('');
const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        imgData[0].name = file.name
        imgData[0].size = file.size
        const reader = new FileReader();
        reader.onload = () => {
            imageUrl.value = reader.result;
            imgData[0].base64 = reader.result
        };
        reader.readAsDataURL(file);
    }
};





// 控制是否显示弹窗模块
const dialogTableVisible = ref(false)


// 权重
let weightOption = [
    {
        value: 1,
        label: "一级",
    },
    {
        value: 2,
        label: "二级",
    },
    {
        value: 3,
        label: "三级",
    },
    {
        value: 4,
        label: "四级",
    }, {
        value: 5,
        label: "五级",
    }
]

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


//  排序选项
let stor = [
    {
        value: 0,
        label: "正序",
    },
    {
        value: 1,
        label: "倒叙",
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
    weight: 1,// 权重 1-5
    column: "home",// 所属栏目
    pagepath: "/catdetail",// 页面路径
})





// 恢复默认值
let cloneDialog = () => {
    imgData[0].base64 = null
    imgData[0].name = ""
    imgData[0].size = 0
    imageUrl.value = ""

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
            PushGuangGao({
                FormDataList: imgData,
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

                GetTabFn()
            }).catch(({ response }) => {
                loadings.value = false
                ElMessage({
                    showClose: true,
                    message: response?.data.message || "删除失败",
                    type: 'error',
                })
            })

            // 这里清空之前提交的数据

        } else {
            // 这里就会多一个参数有一个参数EditData
            loadings.value = true
            EditGuangGao({
                FormDataList: imgData,
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
                    message: response?.data.message || "修改失败",
                    type: 'error',
                })
            })
        }
    }
}




// 需要提交的数据
let fromData = reactive({
    search: "",
    stor: 0,
    column: 'home',
})

let loading = ref(false)


// 表格数据
let dialogTableVisibles = computed(() => store.state.config.dialogTableVisibles)

// 获取数据函数
let GetTabFn = () => {
    loading.value = true
    store.commit('config/DeleteDialogTableVisibles', []); // 清空数据
    GetGuangGaoData(fromData).then(({ result: { data } }) => {
        store.commit('config/AdddialogTableVisibles', { playload: data, type: true });
        loading.value = false;
    }).catch(({ response }) => {
        ElMessage({
            showClose: true,
            message: response?.data.message || "获取数据失败",
            type: 'error',
        })
    })
}


// 监听选项变化发送获取数据
watch(() => JSON.parse(JSON.stringify(fromData)), (ne, vl) => {
    GetTabFn()
}, {
    immediate: true
})



// 收集选中的数据
let multipleSelection = ref([])

// 这个是选中删除的模块 查询出id获取然后删除
const handleSelectionChange = (val) => {
    multipleSelection.value = val
}


// 删除模块
let deletaTab = (vals = true, data) => {
    if (vals == true) {
        // 批量删除
        DeleteGuanGao({ tabArray: multipleSelection.value }).then(value => {
            store.commit('config/AdddialogTableVisibles', { playload: multipleSelection.value, type: false })
        }).catch(({ response }) => {
            ElMessage({
                showClose: true,
                message: response?.data.message || "删除失败",
                type: 'error',
            })
        })
    }
    else {
        // 单个删除
        DeleteGuanGao({ tabArray: [data] }).then(value => {
            store.commit('config/AdddialogTableVisibles', { playload: [data], type: false })
        }).catch(({ response }) => {
            ElMessage({
                showClose: true,
                message: response?.data.message || "删除失败",
                type: 'error',
            })
        })
    }
}



// 收集需要编辑的数据
let EditType = ref(null)


// 编辑按钮
let editTab = (data) => {
    dialogTableVisible.value = true
    // 大致的步骤就是点击编辑按钮的时候将数据赋予给之前的数据里面，然后修改了的话就就基于提交按钮进行判断
    EditType.value = data


    inputData.title = data.title;
    inputData.weight = data.weight;
    inputData.column = data.column;
    inputData.pagepath = data.pagepath
    imageUrl.value = data.imageUrl

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