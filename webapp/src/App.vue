<template>
  <SalesRank data_root="https://aeroblast.github.io/book_sales_info_data/" />
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
</style>
