const config = require('./config')
const shared_utils = require('./shared_utils')

const fs = require('fs')
const path = require('path');

const args = process.argv.splice(2);
//const data_dir = args[0];
const data_dir = "C:\\Users\\Loki\\WorkSpace\\book_sales_info_data";

const latest_json_path = path.join(data_dir, "latest.json");
const save_path = path.join(data_dir, "metadata.json");

async function main() {
    /** @type {Array} */
    const entries = JSON.parse(fs.readFileSync(latest_json_path));
    console.log(`Entry count: ${entries.length}`);
    const browser = await config.CreateBrowser();

    // for debug
    // await GetInfo(browser, entries.find(e => e.title === "銀河英雄伝説"))

    const result = [];
    const length = entries.length;
    for (const i in entries) {
        const entry = entries[i];
        console.log(`Processing ${parseInt(i) + 1} of ${length}: https://www.amazon.co.jp/dp/${entry.isbn} ${entry.title}`)
        result.push(await GetInfo(browser, entry));
    }
    await browser.close();

    fs.writeFileSync(
        save_path,
        JSON.stringify(result, null, 2)
    );
}
const date_format = new Intl.DateTimeFormat('ja-u-hc-h24',
    {
        timeZone: "Asia/Tokyo", year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    });
async function GetInfo(browser, entry) {
    const page = await browser.newPage();
    const url = `https://www.amazon.co.jp/dp/${entry.isbn}/`;
    let r = null;
    try {
        //console.log(`Processing: ${url} ${entry.title}`)
        const response = await page.goto(url);
        if (response.status() != 200) {
            throw `${response.status()} :${entry.isbn} ${entry.title}`;
        }

        // R18 click
        await page.waitForSelector("#navFooter");
        page.evaluate(() => { let a = document.querySelector("#black-curtain-yes-button a"); if (a) a.click(); });

        await page.waitForSelector(".imageThumb");
        page.evaluate(() => { document.querySelector(".imageThumb").click(); });


        await page.waitForSelector("#igImage");

        r = await page.evaluate(GetInfo_DOM);

        //console.log(`${JSON.stringify(r, null, 2)}`)
        r.releaseDate = date_format.format(new Date(r.releaseDate)).substring(0, 10);

    } catch (e) {
        console.log(`Failed at: ${url} ${entry.title} ${e.message}`)
    }
    await page.close();
    return r;

}
async function GetInfo_DOM() {
    function GetCreatorName(span) {
        let r = span.querySelector('.a-declarative');
        if (!r) r = span.querySelector('.a-link-normal');
        return r.innerText.trim();
    }
    function GetDesc() {
        for (const title of [
            '銀河英雄伝説',
            'フルメタル',
            'Missing 神隠しの物語',
            '最後にひとつだけお願いしてもよろしいでしょうか',
            'グランクレスト戦記'
        ]) {
            if (document.title.includes(title)) return null;
        }
        let r = document.querySelector("#bookDescription_feature_div .a-expander-content");
        if (!r) r = document.querySelector("#editorialReviews_feature_div > div.a-section.a-spacing-small.a-padding-base > div");
        return r.innerText;
    }
    function trimAny(str, chars) {
        var start = 0,
            end = str.length;

        while (start < end && chars.indexOf(str[start]) >= 0)
            ++start;

        while (end > start && chars.indexOf(str[end - 1]) >= 0)
            --end;

        return (start > 0 || end < str.length) ? str.substring(start, end) : str;
    }

    const largeImage = document.querySelector("#igImage");
    if (!largeImage.complete) {
        await new Promise(async (resolve) => {
            largeImage.onload = resolve
        })
    }

    const info_dic = Object.fromEntries(
        Array.from(document.querySelectorAll("#detailBullets_feature_div>ul:nth-child(1) .a-list-item")).map(span => {
            let t = span.children[0].innerText;
            t = trimAny(t.substring(0, t.indexOf(':')), ' \u200f');
            return [t, span.children[1].innerText]
        })//End of Array.from
    );
    console.log(info_dic)

    const r = {
        title: document.querySelector('#productTitle').innerHTML,
        creators: Array.from(document.querySelectorAll("#bylineInfo .author")).map(span => {
            const name = GetCreatorName(span);
            if (document.title.includes('満月珈琲店の星詠み') && name == '桜田 千尋') {
                return { name: name, role: 'イラスト' }
            }
            return {
                name: name,
                role: span.querySelector('.contribution').innerText.match(/\((.+)\)/)[1]
            }
        }),
        desc: GetDesc(),
        releaseDate: info_dic['発売日'],
        publisher: info_dic['出版社']
    };
    // "画像はありません" は 60x40
    if (largeImage.naturalHeight > 500) {
        r.coverSourceUrl = largeImage.src;
        // let response = await fetch(largeImage.src);
        // let blob = await response.blob();
        // let fr = new FileReader();
        // let dataUrl = await new Promise((resolve) => {
        //     fr.onloadend = () => { resolve(fr.result) }
        //     fr.readAsDataURL(blob);
        // })
        // result.coverData = dataUrl;
    }
    //console.log(r);
    return r;
}

if (require.main === module) {
    main();
}
module.exports = main;