<script>
import { h } from "vue";
import InlineImage from "../components/InlineImage.vue";
export default {
    name: "MarkDown",
    props: {
        raw: String
    },
    render() {
        const html = this.Compile(this.raw);
        const VTree = CreateV(html)

        return VTree;
    },
    methods: {
        Compile(raw) {
            let r = raw.replaceAll(/!\[(.*?)\]\((.+?)\)/g,
                (match, g1, g2) => {
                    return `<InlineImage title="${g1}" src="${g2}"/>`;
                }
            );
            r = r.replace(/\[(.+?)\]\((.+?)\)/g, "<a href='$2'>$1</a>");
            return r;
        }
    },
    computed: {

    },
};

/**
 * My HTML-Like middle language. Much simpler.
 */
const reg_tag = /<([a-zA-Z0-9/].*?)>/g;
function CreateV(html) {
    let itr = html.matchAll(reg_tag);
    let pos = 0;
    let nodeList = [];

    for (const m of itr) {
        const textNode = html.substring(pos, m.index);
        if (textNode) {
            nodeList.push(textNode);
        }
        const tag = TagProcess(m[1])
        nodeList.push(tag);
        pos = m.index;
    }

    //console.log(vnodes);
    let root = [];
    CreateTree(nodeList, 0, root);
    return root;

}
function CreateTree(list, pos, parent) {
    for (; pos < list.length;) {
        const tag = list[pos];
        if (typeof (tag) === "string") {
            parent.push(tag);
            pos++;
        } else {
            switch (tag.info) {
                case "opening":
                    tag.value.children = [];
                    parent.push(tag.value);
                    pos = CreateTree(list, pos + 1, tag.value.children)
                    break;
                case "void":
                    parent.push(tag.value);
                    pos++;
                    break;
                case "closing":
                    return pos;
                default:
                    console.error(tag.value);
                    throw tag.info;
            }
        }
    }
}
/**
 * 
 * @param {String} tagStr 
 * @return {Object} info: opening void closing, value: VNode VNode tagName
 * 
 */
function TagProcess(tagStr) {
    const allow = {
        // to-do: filter attr
        "a": {
            attr: ["href"],
            form: "opening",
            v(attrs) { attrs.target = "_blank"; return h("a", attrs); }
        },
        "InlineImage": {
            attr: ["title", "src"],
            form: "void",
            v(attrs) { return h(InlineImage, attrs); }
        }
    }
    if (tagStr[0] == '/') {
        let tagName = tagStr.substring(1);
        if (tagName in allow) {
            if (allow[tagName].form === "opening") {
                return { info: "closing", value: tagName };
            } else {
                return { info: "error", value: "ForbiddenClosing: " + tagName };
            }
        } else {
            return { info: "error", value: "UnsupportedClosing: " + tagName }
        }
    }
    let form = "opening";
    if (tagStr[tagStr.length - 1] == '/') {
        tagStr = tagStr.substring(0, tagStr.length - 1);
        form = "void";
    }
    let pos = tagStr.indexOf(' ');
    if (pos < 0) {
        // tagName is tagStr
        if (tagStr in allow) {
            let tag = allow[tagStr];
            if (tag.form === form) {
                return { info: form, value: tag.v({}) }
            } else {
                return { info: "error", value: `Unsupported:${form} of ${tagStr}` }
            }
        } else {
            return { info: "error", value: `UnsupportedTag: ${tagStr}` }
        }
    } else {
        const tagName = tagStr.substring(0, pos);
        if (tagName in allow) {
            let tag = allow[tagName];
            let attrs = ReadAttrs(tagStr.substring(pos).trim());
            return { info: form, value: tag.v(attrs) }

        } else {
            return { info: "error", value: `UnsupportedTag: ${tagName}` }
        }
    }

}
const reg_attr = /([a-zA-Z0-9-_])=(["'])(.*?)(["'])/g; // Assert only one type of ' or "

function ReadAttrs(str) {
    let itr = str.matchAll(reg_attr);
    let r = {};
    for (const m of itr) {
        if (m[2] != m[4]) {
            console.error("ReadAttrs Fail: " + str);
            return {};
        }
        r[m[1]] = m[3];
    }
    return r;
}
</script>
  
<style>

</style>
  