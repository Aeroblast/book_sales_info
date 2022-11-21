<template>
  <div class="entry" :data-detail="detail">
    <span class="salesValue">{{ AsianNumber(entry.salesValue) }}部</span>&nbsp;&nbsp;
    <span class="title" @click="detail = !detail" v-html="titleDisplayHTML"></span>&nbsp;&nbsp;
    <span class="date">{{ entry.recordDate }}</span>
  </div>
  <div class="detail" :data-detail="detail">
    <p v-if="isLongTitle">タイトル：{{ entry.title }}</p>
    <p>部数詳細：{{ entry.salesDesc }}</p>
    <p>&#x3000;情報元：<span ref="desc" v-html="MarkDown(entry.sourceDesc)"></span></p>
    <p>&#x3000;&#x3000;紹介：<a target="_blank" :href="'https://www.amazon.co.jp/dp/' + entry.isbn">Amazon</a>
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
      a.target = "_blank"; // for old data using html tags
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
  computed: {
    isLongTitle() {
      return this.entry.title.length > 17;
    },
    titleDisplayHTML() {
      return this.isLongTitle ?
        (this.entry.title.substring(0, 17) + '<span class="expander">…</span>')
        : this.entry.title;
    }
  },
};
</script>

<style>
.entry {
  border-top: solid 1px gray;
  padding: 0.3em;
  width: fit-content;
  /* 4.5em + 14em/10em + 6em */
  height: 2.5em;
}

.entry:before {
  content: "";
  display: inline-block;
  vertical-align: middle;
  height: 100%;
}

.entry>span {
  display: inline-block;
  vertical-align: middle;
}

.salesValue {
  width: 4.5em;
  text-align: right;
}

.title {
  width: 14em;
  max-height: 100%;
  overflow: hidden;
  cursor: pointer;
  line-height: 1.2;
}

.date {
  width: 6em;
}

.detail {
  width: fit-content;
  height: fit-content;
  margin-left: 1em;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.5s;
}

.detail>p {
  width: 20em;
  margin: 0;
  line-height: 1.5;
  text-indent: -5em;
  padding-left: 5em;
}

.detail[data-detail="true"] {
  transition: max-height 0.5s;
  max-height: 15em;
  border-top: 1px dashed gray;
}

.expander {
  color: rgb(136, 116, 255);
}

@media (max-width: 600px) {

  .title {
    width: 9em;
  }

  .detail>p {
    width: 15em;
  }
}
</style>
