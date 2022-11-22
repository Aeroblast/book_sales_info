<template>
    <a target="_blank" :href="absoluteSrc">{{ title }}</a><img class="inline" @click="large = !large" :src="absoluteSrc"
        :title="title">
    <div :data-large="large"><img :src="absoluteSrc" @click="large = !large"></div>
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
    data() {
        return {
            large: false
        }
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
img.inline {
    height: 1.5em;
    vertical-align: middle;
    width: auto;
    cursor: pointer;
}

div {
    display: none;
}

div[data-large="true"] {
    display: inline-block;
    width: 0;
    height: 0;
    overflow: visible;
}

div>img {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 100vw;
    max-width: 100vh;
    height: auto;
    z-index: 10;
}
</style>