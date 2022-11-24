// This script is deprecated！

// need node.js fetch

const fs = require('fs')
const path = require('path');

const args = process.argv.splice(2);
const data_dir = args[0];
const batch_size = 10;

const latest_json_path = path.join(data_dir, "latest.json");
const save_path = path.join(data_dir, "metadata.json");

async function main() {
    /** @type {Array} */
    const entries = JSON.parse(fs.readFileSync(latest_json_path));
    console.log(`Entry count: ${entries.length}`);
    let result = [];
    for (let i = 0; i < entries.length; i += batch_size) {
        const batch = entries.slice(i, i + batch_size);
        const batch_isbn_str = batch.map(e => e.isbn).join(',');
        const res = await fetch("https://api.openbd.jp/v1/get?isbn=" + batch_isbn_str);
        const res_objs = await res.json();
        if (res_objs.length != batch.length) { throw `length not equal at ${batch[0].title}`; }
        const r_objs = res_objs.map((e, i) => CreateMetaObj(e, batch[i]));
        result = result.concat(r_objs);
    }
    console.log(labels)

    fs.writeFileSync(
        save_path,
        JSON.stringify(result, null, 2)
    );
}
main();
let labels = new Set();
function CreateMetaObj(o, entry) {
    try {
        return {
            isbn: entry.isbn,
            publisher: o.summary.publisher,
            label: (() => {
                try {
                    const t = o.onix.DescriptiveDetail.Collection.TitleDetail.TitleElement
                        .find(e => e.TitleElementLevel === "02" || e.TitleElementLevel === "03");
                    const l = t.TitleText.content;
                    labels.add(l);
                    return l;
                } catch (e) {
                    //console.log(`NoLabel: ${entry.isbn} ${entry.title}`);
                    return "";
                }
            })(),
            releaseDate: o.summary.pubdate,
            cover: o.summary.cover
        };
    } catch (e) {
        if (o === null) {
            console.error(`NoData: ${entry.isbn} ${entry.title}`);
            return null;
        }
        console.error(`Error at ${entry.isbn}`);
        throw e;
    }

}
//TitleType http://www.onix-codelists.io/codelist/15
//TitleElementLevel https://onix-codelists.io/codelist/149
//PublishingDateRole: http://onix-codelists.io/codelist/163

/**
放弃。缺数据。另外有缺Label，有些是真的没，有些是缺数据。
NoData: 4040711165 フルメタル・パニック！
NoData: 4087030253 おいしいコーヒーのいれ方
NoData: 4044336016 タクミくんシリーズ
NoData: 4073080407 ブギーポップシリーズ
NoData: 4801912796 才川夫妻の恋愛事情
NoData: 4896377532 乙女ゲー世界はモブに厳しい世界です
NoData: 4813702643 初めましてこんにちは、離婚してください
NoData: 4758091773 悲劇の元凶となる最強外道ラスボス女王は民の為に尽くします。
NoData: 4891994924 チート薬師のスローライフ
NoData: 4896377001 Sランクモンスターの≪ベヒーモス≫だけど、猫と間違われてエルフ娘の騎士(ペット)として暮らしてます
NoData: 4864727015 穏やか貴族の休暇のすすめ。
NoData: 4803012385 領民0人スタートの辺境領主様
NoData: 489637813X 嘆きの亡霊は引退したい　～最弱ハンターによる最強パーティ育成術～
NoData: 4864727392 出来損ないと呼ばれた元英雄は、実家から追放されたので好き勝手に生きることにした
NoData: 4758090955 家政魔導士の異世界生活　～冒険中の家政婦業承ります！～
NoData: 4344034422 ドS刑事
NoData: 4907064438 ヴァイオレット・エヴァーガーデン
NoData: 4813705286 しあわせ食堂の異世界ご飯
NoData: 480027964X 生活魔術師シリーズ
NoData: 4891995246 ガベージブレイブ　【異世界に召喚され捨てられた勇者の復讐物語】
NoData: 4040711149 グランクレスト戦記
NoData: 4813701302 あの花が咲く丘で、君とまた出会えたら。
NoData: 4877245081 神官シリーズ
NoData: 4086312832 遊び人は賢者に転職できるって知ってました？　～勇者パーティを追放されたLv99道化師、【大賢者】になる～
NoData: 4803012571 二度転生した少年はSランク冒険者として平穏に過ごす　～前世が賢者で英雄だったボクは来世では地味に生きる～
NoData: 4864726795 新しいゲーム始めました。　～使命もないのに最強です？～
NoData: 4891995068 異世界でも無難に生きたい症候群
NoData: 4344841255 最強の黒騎士、戦闘メイドに転職しました
NoData: 4569802559 桜ノ雨
NoData: 4864727007 無人島でエルフと共同生活
NoData: 4896378016 「お前ごときが魔王に勝てると思うな」と勇者パーティを追放されたので、王都で気ままに暮らしたい
NoData: 4864727899 忌み子と呼ばれた召喚士
NoData: 4864728054 元公爵令嬢の就職
*/