(function(){"use strict";var e={7165:function(e,t,r){var n=r(9242),s=r(3396);function a(e,t,r,n,a,o){const i=(0,s.up)("SalesRank");return(0,s.wg)(),(0,s.j4)(i,{data_root:"https://aeroblast.github.io/book_sales_info_data/"})}const o={class:"sales_rank"},i=(0,s._)("option",{value:"sales"},"部数",-1),l=(0,s._)("option",{value:"date"},"日付",-1),u=[i,l];function c(e,t,r,a,i,l){const c=(0,s.up)("RankEntry");return(0,s.wg)(),(0,s.iD)("div",o,[(0,s.wy)((0,s._)("select",{"onUpdate:modelValue":t[0]||(t[0]=e=>i.sort_method=e),onChange:t[1]||(t[1]=e=>l.SortEntries())},u,544),[[n.bM,i.sort_method]]),(0,s._)("div",null,[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(i.entries,(e=>((0,s.wg)(),(0,s.j4)(c,{entry:e,key:e.isbn},null,8,["entry"])))),128))])])}var d=r(7139);const p={class:"editor"},_=["data-editor"],h=["data-editor"],f=(0,s._)("br",null,null,-1),y=(0,s._)("br",null,null,-1),b=(0,s._)("br",null,null,-1),D=(0,s._)("br",null,null,-1),m=(0,s._)("br",null,null,-1),v=["innerHTML"],w=(0,s._)("br",null,null,-1),g=["innerHTML"],k=["data-detail"],S={class:"salesValue"},T=["innerHTML"],O={class:"date"},M=["data-detail"],j={key:0},E=["innerHTML"],L=["href"];function C(e,t,r,a,o,i){return(0,s.wg)(),(0,s.iD)(s.HY,null,[(0,s._)("div",p,[(0,s._)("span",{class:"trigger",onClick:t[0]||(t[0]=e=>{o.editor=!o.editor,o.detail=o.editor}),title:"更新用JSON"}),(0,s._)("span",{class:"editor_title","data-editor":o.editor},"更新用JSONを生成",8,_),(0,s._)("div",{class:"editor_area","data-editor":o.editor},[(0,s.Uk)(" 部数詳細："),(0,s.wy)((0,s._)("input",{type:"text","onUpdate:modelValue":t[1]||(t[1]=e=>o.editor_salesDesc=e)},null,512),[[n.nr,o.editor_salesDesc]]),(0,s._)("span",null,(0,d.zw)(i.SearchAsianNumber(o.editor_salesDesc)),1),f,(0,s.Uk)(" 　　日付："),(0,s.wy)((0,s._)("input",{type:"date","onUpdate:modelValue":t[2]||(t[2]=e=>o.editor_date=e)},null,512),[[n.nr,o.editor_date]]),y,(0,s.Uk)(" 情報元(MarkDown)："),b,(0,s.wy)((0,s._)("textarea",{"onUpdate:modelValue":t[3]||(t[3]=e=>o.editor_sourceDesc=e)},"[]()",512),[[n.nr,o.editor_sourceDesc]]),D,(0,s.Uk)(" 情報元(Preview)："),m,(0,s._)("span",{innerHTML:i.MarkDown(o.editor_sourceDesc)},null,8,v),w,(0,s._)("button",{onClick:t[4]||(t[4]=(...e)=>i.TryCopy&&i.TryCopy(...e))},"Copy"),(0,s._)("span",{innerHTML:o.copy_result},null,8,g)],8,h)]),(0,s._)("div",{class:"entry","data-detail":o.detail},[(0,s._)("span",S,(0,d.zw)(i.AsianNumber(r.entry.salesValue))+"部",1),(0,s.Uk)("   "),(0,s._)("span",{class:"title",onClick:t[5]||(t[5]=e=>o.detail=!o.detail),innerHTML:i.titleDisplayHTML},null,8,T),(0,s.Uk)("   "),(0,s._)("span",O,(0,d.zw)(r.entry.recordDate),1)],8,k),(0,s._)("div",{class:"detail","data-detail":o.detail},[i.isLongTitle?((0,s.wg)(),(0,s.iD)("p",j,"タイトル："+(0,d.zw)(r.entry.title),1)):(0,s.kq)("",!0),(0,s._)("p",null,"部数詳細："+(0,d.zw)(r.entry.salesDesc),1),(0,s._)("p",null,[(0,s.Uk)("　情報元："),(0,s._)("span",{ref:"desc",innerHTML:i.MarkDown(r.entry.sourceDesc)},null,8,E)]),(0,s._)("p",null,[(0,s.Uk)("　　紹介："),(0,s._)("a",{target:"_blank",href:"https://www.amazon.co.jp/dp/"+r.entry.isbn},"Amazon",8,L)])],8,M)],64)}var H={name:"RankEntry",props:{entry:Object},data(){return{detail:!1,editor:!1,editor_salesDesc:"",editor_sourceDesc:"[]()",editor_date:null,copy_result:""}},mounted(){let e=this.$refs["desc"].getElementsByTagName("a");[].forEach.call(e,(e=>{e.target="_blank"}))},methods:{AsianNumber(e){let t=e%1e4;if(0==t)return e/1e4+"万";let r=t%1e3;return 0==r?`${Math.floor(e/1e4)}万${t/1e3}千`:`${e/1e4}万${t}`},SearchAsianNumber(e){let t=e.match(/([0-9]+)万(([0-9]+)千)?/);if(!t)return 0;let r=0;return t[3]&&(r+=1e3*parseInt(t[3])),t[1]&&(r+=1e4*parseInt(t[1])),r},MarkDown(e){return e.replace(/\[(.*?)\]\((.*?)\)/g,"<a href='$2'>$1</a>")},TryCopy(){let e={};if(e.salesDesc=this.editor_salesDesc.trim(),!e.salesDesc)return void(this.copy_result="Error: SalesDesc is empty!");if(e.recordDate=this.editor_date,!e.recordDate)return void(this.copy_result="Error: recordDate is empty!");if(e.recordDate.localeCompare(this.entry.recordDate)<=0)return void(this.copy_result="Error: New date should not earlier than last record!");if(e.sourceDesc=this.editor_sourceDesc.trim(),!e.sourceDesc)return void(this.copy_result="Error: SourceDesc is empty!");e.salesValue=this.SearchAsianNumber(e.salesDesc),e.isbn=this.entry.isbn,e.title=this.entry.title;let t=JSON.stringify(e,["title","salesValue","recordDate","salesDesc","sourceDesc","isbn"],2).replaceAll("\n","\n  ");console.log(t),navigator.clipboard.writeText(t).then((()=>{this.copy_result="Success!"}))}},computed:{isLongTitle(){return this.entry.title.length>17},titleDisplayHTML(){return this.isLongTitle?this.entry.title.substring(0,17)+'<span class="expander">…</span>':this.entry.title}}},U=r(89);const N=(0,U.Z)(H,[["render",C]]);var V=N,$={name:"SalesRank",data(){return{entries:[],history:[],sort_method:"date"}},props:{data_root:String,entry:Object},components:{RankEntry:V},async mounted(){let e=fetch(this.data_root+`latest.json?t=${(new Date).toISOString()}`),t=fetch(this.data_root+`history.json?t=${(new Date).toISOString()}`),r=await e;this.entries=await r.json(),this.SortEntries(),this.history=await(await t).json()},methods:{SortEntries(){const e=x[this.sort_method];console.log(this.entries),this.entries.sort(e)}},computed:{}};const x={date:(e,t)=>-e.recordDate.localeCompare(t.recordDate),sales:(e,t)=>t.salesValue-e.salesValue},A=(0,U.Z)($,[["render",c]]);var z=A,R={name:"App",components:{SalesRank:z}};const I=(0,U.Z)(R,[["render",a]]);var J=I;(0,n.ri)(J).mount("#app")}},t={};function r(n){var s=t[n];if(void 0!==s)return s.exports;var a=t[n]={exports:{}};return e[n](a,a.exports,r),a.exports}r.m=e,function(){var e=[];r.O=function(t,n,s,a){if(!n){var o=1/0;for(c=0;c<e.length;c++){n=e[c][0],s=e[c][1],a=e[c][2];for(var i=!0,l=0;l<n.length;l++)(!1&a||o>=a)&&Object.keys(r.O).every((function(e){return r.O[e](n[l])}))?n.splice(l--,1):(i=!1,a<o&&(o=a));if(i){e.splice(c--,1);var u=s();void 0!==u&&(t=u)}}return t}a=a||0;for(var c=e.length;c>0&&e[c-1][2]>a;c--)e[c]=e[c-1];e[c]=[n,s,a]}}(),function(){r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,{a:t}),t}}(),function(){r.d=function(e,t){for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}}(),function(){r.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={143:0};r.O.j=function(t){return 0===e[t]};var t=function(t,n){var s,a,o=n[0],i=n[1],l=n[2],u=0;if(o.some((function(t){return 0!==e[t]}))){for(s in i)r.o(i,s)&&(r.m[s]=i[s]);if(l)var c=l(r)}for(t&&t(n);u<o.length;u++)a=o[u],r.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return r.O(c)},n=self["webpackChunkbook_sales_info"]=self["webpackChunkbook_sales_info"]||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var n=r.O(void 0,[998],(function(){return r(7165)}));n=r.O(n)})();
//# sourceMappingURL=app.3195e903.js.map