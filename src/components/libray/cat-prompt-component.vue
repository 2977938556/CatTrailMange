<template>
    <div class="popup" v-if="visible">
        <div class="popup-mask" @click="updateVisible(false)"></div>
        <Transition name="ShowHidden">
            <div :class="['popup-content', { fade: fade }]" v-if="fade">
                <div class="popup-header">
                    <slot name="title">
                        {{ title }}
                    </slot>
                </div>
                <div class="popup-body">
                    <slot name="content">
                        {{ text }}
                    </slot>
                </div>
                <div class="popup-footer">
                    <button class="popup-btn popup-btn-cancel" @click="updateVisible(false)">取消</button>
                    <button class="popup-btn popup-btn-confirm" @click="$emit('onsubmit', true)">确定</button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
export default {
    name: 'CatPromptComponent',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: "消息提示"
        },
        text: {
            type: String,
            default: "亲，确认删除吗"
        }
    },
    emits: ['update:visible', 'onsubmit'],
    setup(props, { emit }) {


        let fade = ref(props.visible)

        onMounted(() => {
            setTimeout(() => { fade.value = true }, 0)
        })


        let updateVisible = (val) => {
            emit("update:visible", val)
        }


        return { fade, updateVisible }

    },
}
</script>

<style scoped lang="less">
// 过渡动画
.ShowHidden-enter-from {
    transform: translate3d(0, -60px, 0);
    opacity: 0;
}

.ShowHidden-enter-active {
    transition: all 0.5s;
}

.ShowHidden-enter-to {
    transform: none;
    opacity: 1;
}


// 结束
.ShowHidden-leave-from {
    transform: none;
    opacity: 1;
}

.ShowHidden-leave-active {
    transition: all 0.5s;
}

.ShowHidden-leave-to {
    transform: translate3d(0, 0px, 0);
    opacity: 0;
}

.popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;

}

.popup-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
}

.fade {
    transition: all 0.5s ease-in-out;
    opacity: 1 !important;

}

.popup-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    min-width: 450px;
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    opacity: 0;
    height: auto;
    padding: 20px;
    z-index: 200;

}

.popup-header {
    padding: 15px;
    text-align: center;
    min-height: 40px;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 0px;
    line-height: 23.17px;
    color: rgba(0, 0, 0, 1);
    text-align: center;
    vertical-align: top;

}


.popup-body {
    // padding: 5px;
    // min-height: 300px;
    // border: 1px solid red;


}

.popup-footer {
    display: flex;
    justify-content: space-between;

    .popup-btn {
        flex: 0.4;
        height: 40px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
    }

    .popup-btn-cancel:hover {
        opacity: 0.5;
    }

    .popup-btn-confirm {
        color: white;
        // background-color: blue;
        background: rgba(255, 124, 0, 1);

    }

    .popup-btn-confirm:hover {
        opacity: 0.5;
    }
}
</style>
```