<template>
  <div class="sales_rank">
    <select v-model="sort_method" @change="SortEntries()">
      <option value="sales">部数</option>
      <option value="date">日付</option>
    </select>
    <div>
      <RankEntry :entry="entry" v-for="entry in entries" :key="entry.isbn" />
    </div>
  </div>
</template>

<script>
import RankEntry from "./RankEntry.vue";
export default {
  name: "SalesRank",
  data() {
    return {
      entries: [],
      history: [],
      sort_method: "date",
    };
  },
  props: {
    data_root: String,
    entry: Object,
  },
  components: {
    RankEntry,
  },
  async mounted() {
    let latest_p = fetch(
      this.data_root + `latest.json?t=${new Date().toISOString()}`
    );
    let histroy_p = fetch(
      this.data_root + `history.json?t=${new Date().toISOString()}`
    );
    let latest_response = await latest_p;
    this.entries = await latest_response.json();
    this.SortEntries();
    this.history = await (await histroy_p).json();
  },
  methods: {
    SortEntries() {
      const method = sort_methods[this.sort_method];
      console.log(this.entries);
      this.entries.sort(method);
    },
  },
  computed: {},
};

const sort_methods = {
  date: (a, b) => -a.recordDate.localeCompare(b.recordDate),
  sales: (a, b) => b.salesValue - a.salesValue,
};
</script>

<style scoped>

</style>
