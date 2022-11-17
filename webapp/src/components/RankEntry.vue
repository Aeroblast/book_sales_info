<template>
  <div class="entry" :data-detail="detail">
    <span class="salesValue">{{ AsianNumber(entry.salesValue) }}部</span
    >&nbsp;&nbsp;
    <span class="title" @click="detail = !detail">{{ entry.title }} </span
    >&nbsp;&nbsp;
    <span class="date">{{ entry.recordDate }}</span>
  </div>
  <div class="detail" :data-detail="detail">
    <p>部数詳細：{{ entry.salesDesc }}</p>
    <p>情報元：<span ref="desc" v-html="MarkDown(entry.sourceDesc)"></span></p>
    <p>
      <a target="_blank" :href="'https://www.amazon.co.jp/dp/' + entry.isbn"
        >Amazon</a
      >
    </p>
  </div>
</template>

<script>
export default {
  name: "RankEntry",
  props: {
    entry: Object,
  },
  data() {
    return {
      detail: false,
    };
  },
  mounted() {
    let as = this.$refs["desc"].getElementsByTagName("a");
    [].forEach.call(as, (a) => {
      a.target = "_blank";
    });
  },
  methods: {
    AsianNumber(num) {
      let thousand = num % 10000;
      if (thousand == 0) {
        return num / 10000 + "万";
      }
      let h = thousand % 1000;
      if (h == 0) {
        return `${Math.floor(num / 10000)}万${thousand / 1000}千`;
      } else {
        return `${num / 10000}万${thousand}`;
      }
    },
    MarkDown(raw) {
      return raw.replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2'>$1</a>");
    },
  },
  computed: {},
};
</script>

<style scoped>
.entry {
  border-top: solid 1px gray;
  padding: 0.3em;
  width: fit-content;
  height: 2.5em;
}
.entry:before {
  content: "";
  display: inline-block;
  vertical-align: middle;
  height: 100%;
}
.entry > span {
  display: inline-block;
  vertical-align: middle;
}
.salesValue {
  width: 5em;
  text-align: right;
}
.title {
  width: 25em;
  max-height: 100%;
  overflow: hidden;
  cursor: pointer;
}
.date {
  width: 6em;
}

.detail {
  display: none;
  width: fit-content;
  margin-left: 6em;
}
.detail > p {
  width: 30em;
  margin: 0;
  line-height: 1.5;
}
.detail[data-detail="true"] {
  display: block;
}
.entry[data-detail="true"]  {
  height: fit-content;
}
</style>
