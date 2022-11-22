<template>
  <SalesRank />
</template>

<script>
import SalesRank from "./components/SalesRank.vue";

export default {
  name: "App",
  components: {
    SalesRank,
  },
};
</script>

<style>
.sales_rank {
  margin: auto;
  width: fit-content;
}

html,
body {
  overflow-x: hidden;
}
</style>
