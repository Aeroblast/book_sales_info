<template>
  <div class="editor">
    <span class="trigger" @click="editor = !editor; detail = editor" title="更新用JSON"></span>
    <span class="editor_title" :data-editor="editor">更新用JSONを生成</span>
    <div class="editor_area" :data-editor="editor">
      部数詳細：<input type="text" v-model="editor_salesDesc" /><span>{{ SearchAsianNumber(editor_salesDesc) }}</span><br>
      &#x3000;&#x3000;日付：<input type="date" v-model="editor_date" /><br>
      情報元(MarkDown)：<br><textarea v-model="editor_sourceDesc">[]()</textarea><br>
      情報元(Preview)：
      <div class="desc_preview">
        <MarkDown :raw="editor_sourceDesc" />
      </div>
      <button @click="TryCopy">Copy</button><span v-html="copy_result"></span>
    </div>
  </div>
  <div class="entry" :data-detail="detail">
    <span class="salesValue">{{ AsianNumber(entry.salesValue) }}部</span>&nbsp;&nbsp;
    <span class="title" @click="detail = !detail" v-html="titleDisplayHTML"></span>&nbsp;&nbsp;
    <span class="date">{{ entry.recordDate }}</span>
  </div>
  <div class="detail" :data-detail="detail">
    <p v-if="isLongTitle">タイトル：{{ entry.title }}</p>
    <p>部数詳細：{{ entry.salesDesc }}</p>
    <p>
      <MarkDown :raw="'&#x3000;情報元：' + entry.sourceDesc" />
    </p>
    <!--把冒号前也塞进raw，不然VSCode插件自动格式化会让那里多个空格。-->
    <p>&#x3000;&#x3000;紹介：<a target="_blank" :href="'https://www.amazon.co.jp/dp/' + entry.isbn">Amazon</a>
    </p>
  </div>
</template>

<script>
import MarkDown from './MarkDown.vue';
export default {
  name: "RankEntry",
  props: {
    entry: Object
  },
  components: {
    MarkDown,
  },
  data() {
    return {
      detail: false,
      editor: false,
      editor_salesDesc: "",
      editor_sourceDesc: "[]()",
      editor_date: null,
      copy_result: ""
    };
  },
  mounted() {
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
    SearchAsianNumber(str) {
      let m = str.match(/([0-9]+)万(([0-9]+)千)?/);
      if (!m) return 0;
      let value = 0;
      if (m[3]) { value += parseInt(m[3]) * 1000; }
      if (m[1]) { value += parseInt(m[1]) * 10000; }
      return value;
    },
    TryCopy() {
      let r = {};
      r.salesDesc = this.editor_salesDesc.trim();
      if (!r.salesDesc) {
        this.copy_result = "Error: SalesDesc is empty!";
        return;
      }
      r.recordDate = this.editor_date;
      if (!r.recordDate) {
        this.copy_result = "Error: recordDate is empty!";
        return;
      }
      if (r.recordDate.localeCompare(this.entry.recordDate) <= 0) {
        this.copy_result = "Error: New date should not earlier than last record!";
        return;
      }
      r.sourceDesc = this.editor_sourceDesc.trim();
      if (!r.sourceDesc) {
        this.copy_result = "Error: SourceDesc is empty!";
        return;
      }
      r.salesValue = this.SearchAsianNumber(r.salesDesc);
      r.isbn = this.entry.isbn;
      r.title = this.entry.title;
      let jsonText = JSON
        .stringify(r, ["title", "salesValue", "recordDate", "salesDesc", "sourceDesc", "isbn"], 2)
        .replaceAll('\n', '\n  ');
      console.log(jsonText);
      navigator.clipboard.writeText(jsonText).then(() => {
        this.copy_result = "Success!";
      });
    }
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
  white-space: nowrap;
}

.title {
  width: 18em;
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
  border-top: 0px dashed gray;
  transition: max-height 0.5s, border-width 0.5s;
}

.detail>p {
  width: 24em;
  margin: 0;
  line-height: 1.5;
  text-indent: -5em;
  padding-left: 5em;
}

.detail[data-detail="true"] {
  transition: max-height 0.5s, border-width 0.5s;
  max-height: 15em;
  border-top: 1px dashed gray;
}

.expander {
  color: rgb(136, 116, 255);
}

.editor {
  position: relative;
  height: 0;
  left: 100%;
  overflow: visible;
  font-size: 0.8em;
}

.editor>.trigger {
  width: 1em;
  height: 1em;
  cursor: pointer;
  display: inline-block;
}

.editor>.trigger:hover {
  background-color: rgb(162, 162, 162);
}

.editor_area {
  display: block;
  width: 0;
  overflow: visible;
  white-space: nowrap;
}

.editor_area>* {
  white-space: initial;
}

.editor_area>input[type="text"] {
  width: 10em;
}

.editor_area>textarea {
  width: 15em;
}

.editor_title[data-editor="false"] {
  display: none;
}

.editor_area[data-editor="false"] {
  display: none;
}

.desc_preview {
  width: 15em;
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
