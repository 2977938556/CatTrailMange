<template>
    <div class="sjgl">
        <div class="sjgl-content">
            <!-- 顶部的流浪猫数据和用户增长的数据 -->
            <div class="sjgl-top">
                <div class="sjgl-llmsl small">
                    <!-- <h3>发布的流浪猫数量(周)</h3> -->
                    <div class="echarts-llmsj" ref="llmfbu"> </div>
                </div>
                <div class="sjgl-yhsj small">
                    <!-- <h3>用户增长数据(周)</h3> -->
                    <div class="user-zhenz" ref="userz"></div>

                </div>
            </div>

            <div class="sjgl-bottom">
                <div class="sjgl-sqsj">
                    <div class="sq small" ref="apply"></div>
                    <div class="zyu small" ref="noapply"></div>
                </div>
                <div class="sjgl-redu">
                    <div class="click-host small">
                        <h3>点击量前10的帖子</h3>
                        <ul class="scrollbar">
                            <template v-if="ClickDat.length != 0">
                                <li v-for="item in ClickDat">
                                    <div class="left">
                                        <span>
                                            <img :src="item.imageUrl[0]" alt="">
                                        </span>
                                    </div>
                                    <div class="center">
                                        <div class="top">
                                            <h1>
                                                {{ item.title }}
                                            </h1>
                                        </div>
                                        <div class="bottom">
                                            <p>2023.4.5</p>
                                        </div>
                                    </div>
                                </li>
                            </template>
                            <div v-else>
                                <p>暂无数据哦</p>
                            </div>
                        </ul>

                    </div>
                    <div class="search-host small">
                        <h3>热词搜索</h3>
                        <ul class="hot-search-list scrollbar">
                            <template v-if="SearchHistopry.length != 0">
                                <li :class="['hot-search-item', { 'top-1': index == 0 }, { 'top-2': index == 1 }, { 'top-3': index == 2 },]"
                                    v-for="(item, index) in SearchHistopry" :key="item._id">
                                    <span class="search-term ">{{ item._id }}</span>
                                    <span class="search-count">{{ item.count }}</span>
                                </li>
                            </template>

                            <p v-else>暂无数据哦</p>

                        </ul>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>



<script setup>
import { ref, onMounted, reactive } from 'vue'
import { GetCount, GetApply, GetApplyOkNo, GetClickCat, GetClickSearch } from '@/api/echearts.js'



import * as echarts from 'echarts';
// 数据获取成功后的回调函数
function renderChart(datas, over = false, leixin) {
    // 初始化echarts实例
    let myChart = echarts.init(datas.dom);

    // 设置图表选项
    let option = {
        show: true,
        title: {
            text: datas.title,
            left: 20,
            top: 10
        },
        xAxis: {
            type: 'category',
            data: datas.xData
        },
        yAxis: {
            type: 'value'
        },
        tooltip: {
            trigger: 'axis'
        },
        series: [
            {
                data: datas.yData,
                type: datas.type || "line",
                itemStyle: {
                    color: '#FF8F24'
                }
            }
        ]
    };

    // 这里是控制是否需要滚动条
    if (over) {
        option.dataZoom = datas.dataZoom
    }


    // 这里判断是否需要设置为饼图
    if (leixin == 'bingtu') {
        option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: '{b}\n{d}%'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: 'white',
                            formatter: '{b}\n{d}%'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: datas.yData,
                }
            ]
        };

    }


    // 绘制图表
    myChart.setOption(option);

    return myChart; // 返回echarts实例对象
}




// 流浪猫发布的数据
let llmfbu = ref(null)
// 用户增长的数据
let userz = ref(null)
// 申请领养模块
let apply = ref(null)
// 未领养模块
let noapply = ref(null)


// 基于准备好的dom，初始化echarts实例
onMounted(async () => {
    // 01 初始化流浪猫发布的情况
    let { result: LlmfbuData } = await GetCount({ type: 'llmfb', time: 7 });
    let myChart = renderChart({
        dom: llmfbu.value,
        title: "发布的流浪猫指数(7天)",
        xData: LlmfbuData.dates,
        yData: LlmfbuData.counts,
        type: "line",
    });


    // 用户增长的数据
    let { result: UserData } = await await GetCount({ type: 'userzz', time: 7 });
    let myChUser_myChartrt = renderChart({
        dom: userz.value,
        title: "用户增长指数(7天)",
        xData: UserData.dates,
        yData: UserData.counts,
        type: "line",
    });


    // 申请领养
    let { result: ApplyData } = await GetApply({ time: 7 });
    let myApplyData_myChartrt = renderChart({
        dom: apply.value,
        title: "申请领养数据(7天)",
        xData: ApplyData.dates,
        yData: ApplyData.counts,
        type: "bar",
        dataZoom: [{ // 区域缩放组件
            type: 'slider', // 使用滑动条型数据区域缩放组件
            start: 100, // 默认开始位置为0%
            end: 10, // 默认结束位置为10%
        }],
    }, true);




    // 申请
    let { result: applyno } = await GetApplyOkNo();
    let myApply_myChartrt = renderChart({
        dom: noapply.value,
        // title: "领养申请(周)",
        // xData: ApplyData.dates,
        yData: applyno.data,
        type: "bar",

    }, false, 'bingtu');













    window.addEventListener('resize', function () {
        myChart.resize();
        myChUser_myChartrt.resize();
        myApplyData_myChartrt.resize();
        myApply_myChartrt.resize();
    });

})




let ClickDat = ref([])

// 获取点击量前10的数据
GetClickCat().then(({ result: data }) => {
    // console.log();
    if (data.data.length != 0) {
        ClickDat.value = data.data
    }
})





let SearchHistopry = ref([])

// 活动搜索前10的关键词
GetClickSearch().then(({ result: data }) => {
    if (data.data.length != 0) {
        SearchHistopry.value = data.data
    }
})





</script>

<style lang="less" scoped>
.small {
    padding: 20px;
    border-radius: 10px;
    box-shadow: 1px -1px 16px 0px #d6d6d6;
}



.sjgl {
    width: 100%;
    height: 100%;


    // 内容区域
    .sjgl-content {
        width: 100%;
        height: 100%;
        background: #F0F2F5;
        display: flex;
        flex-direction: column;
        justify-content: space-between;


        // 顶部
        .sjgl-top {
            width: 100%;
            height: 48%;
            // border: 1px solid red;
            display: flex;
            justify-content: space-between;

            // 发布数量表
            .sjgl-llmsl {
                width: 49%;
                height: 100%;
                background: white;
                overflow: hidden;

                .echarts-llmsj {
                    width: 100%;
                    height: 100%;

                    // border: 1px solid red;
                }
            }

            // 用户增长数据
            .sjgl-yhsj {
                width: 49%;
                height: 100%;
                background: white;
                overflow: hidden;

                .user-zhenz {
                    width: 100%;
                    height: 100%;
                }
            }



        }


        // 底部
        .sjgl-bottom {
            width: 100%;
            height: 48%;
            display: flex;
            justify-content: space-between;


            // 申请模块
            .sjgl-sqsj {
                width: 49%;
                height: 100%;
                width: 49%;
                height: 100%;
                display: flex;
                justify-content: space-between;

                div {
                    border-radius: 10px;
                }


                .sq {
                    width: 48%;
                    height: 100%;
                    background: white;
                }

                .zyu {
                    width: 48%;
                    height: 100%;
                    background: white;
                }

            }



            // 热度模块
            .sjgl-redu {
                width: 49%;
                height: 100%;
                display: flex;
                justify-content: space-between;

                // 热度排名前10的帖子
                .click-host {
                    width: 48%;
                    height: 100%;
                    background: white;
                    display: flex;
                    flex-direction: column;

                    h3 {
                        line-height: 40px;
                    }

                    ul {
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        height: 100%;
                        background: rgb(245, 245, 245);
                        border-radius: 10px;
                        padding: 10px;
                        overflow: auto;

                        li {
                            width: 100%;
                            display: flex;
                            justify-content: space-evenly;
                            margin-top: 20px;
                            padding: 10px 10px 10px 10px;
                            background: rgb(255, 255, 255);


                            .left {
                                height: 100%;
                                display: flex;
                                margin-right: 10px;


                                span {
                                    display: block;
                                    width: 60px;
                                    height: 60px;
                                    border-radius: 10px;
                                    overflow: hidden;

                                    img {
                                        width: 60px;
                                        height: 60px;
                                        object-fit: cover;

                                    }
                                }
                            }

                            .center {
                                width: 100%;
                                height: 100%;
                                display: flex;
                                flex-direction: column;
                                justify-content: space-between;
                                align-items: flex-end;

                                .top {
                                    h1 {
                                        font-size: 14px;
                                    }
                                }

                                .bottom {
                                    p {
                                        font-size: 12px;
                                    }
                                }
                            }
                        }

                        li:nth-child(1) {
                            margin-top: 0px;
                        }


                    }


                }







                .search-host {
                    width: 48%;
                    height: 100%;
                    background: white;
                    display: flex;
                    flex-direction: column;

                    h3 {
                        line-height: 40px;
                    }


                    .hot-search-list {
                        list-style-type: none;
                        padding: 0;
                        height: 100%;
                        overflow: auto;

                    }

                    .hot-search-item {
                        display: flex;
                        align-items: center;
                        margin-bottom: 10px;
                        background-color: #f1f1f1;
                        padding: 10px;
                        border-radius: 5px;
                        padding: 0px 10px 0px 10px;
                        height: 10%;
                    }

                    .search-term {
                        margin-right: auto;
                        font-weight: bold;
                    }

                    .search-count {
                        // color: #999;
                    }


                    .top-1 {
                        background-color: #ff6600;
                        color: white;
                    }

                    .top-2 {
                        background-color: #ff8533;
                        color: white;

                    }

                    .top-3 {
                        background-color: #ffaa66;
                        color: white;

                    }



                }


            }





        }





    }



}


/* 滚动条样式 */
.scrollbar::-webkit-scrollbar {
    width: 10px;
    cursor: pointer;
}

.scrollbar::-webkit-scrollbar-track {
    background-color: #f1f1f1;
    cursor: pointer;

}

.scrollbar::-webkit-scrollbar-thumb {
    background-color: #cacaca;
    border-radius: 5px;
}

.scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}

.scrollbar::-webkit-scrollbar-horizontal {
    height: 10px;
}

.scrollbar::-webkit-scrollbar-vertical {
    width: 10px;
}
</style>




