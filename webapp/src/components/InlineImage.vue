<template>
    <a target="_blank" :href="absoluteSrc">{{ title }}<img :src="absoluteSrc"></a>
</template>
  
<script>
import { data_root } from "../settings";
export default {
    name: "InlineImage",
    props: {
        title: String,
        src: String
    },
    mounted() {
    },
    methods: {
    },
    computed: {
        absoluteSrc() {
            if (this.src.startsWith("images/")) {
                return data_root + this.src;
            }
            return this.src;
        }
    },
};
</script>
  
<style scoped>
img {
    height: 1.5em;
    vertical-align: middle;
    width: auto;
}
</style>