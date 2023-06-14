<template>
    <el-radio-group v-model="radio1" size="large" @change="radioFn">
        <el-radio-button :label="item.name" v-for="item in tabList" :key="item.label" />
    </el-radio-group>
</template>

<script>
import { ref } from 'vue'
export default {
    name: "CatLlmglRadio",
    props: {
        radio1: {
            type: String,
            default: "",
        },
        tabList: {
            type: Array,
            default: [],
        }
    },
    setup(props, { emit }) {
        let radio1 = ref(props.radio1);
        
        let radioFn = (value) => {
            emit("changes", value)
        }

        return { radio1, radioFn }
    }
}

</script>