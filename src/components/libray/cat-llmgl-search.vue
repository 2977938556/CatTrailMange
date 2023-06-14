<template>
    <div class="input demo-input-size">
        <el-input clearable v-model="search" class="w-50 m-2" size="large" placeholder="Please Input" prefix-icon="Search"
            @blur="searchFn" />
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    name: "CatSearchInput",
    setup(props, { emit }) {

        let search = ref("")

        let searchFn = () => {
            emit("changes", search.value)
        }


        return { searchFn, search }


    }
}


</script>