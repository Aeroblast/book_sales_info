const config = require('./config')
const shared_utils = require('./shared_utils')

const { Puppeteer } = require('puppeteer');
const fs = require('fs');

function log(c) {
    console.log("[SRC:book-rank.net] " + c);
}

module.exports = main;
if (require.main === module) {
    main();
}

const url = "https://book-rank.net/index.cgi?mode=ruikei&value=1";
//const url = "https://book-rank.net/index.cgi?mode=ruikei&value=1&c=1";

/**
 * @param {Puppeteer.browser} browser_ - browser
 */
async function main(browser_, selection, options = {}) {
    let browser = browser_
    if (!browser) {
        log("Start and create new puppeteer.Browser")
        browser = await config.CreateBrowser();

    } else {
        log("Start with given puppeteer.Browser")
    }
    //--------

    /** 
    *  @type {Puppeteer.page}
    */
    let page;

    page = await browser.newPage();
    await page.goto(url, { timeout: 0, waitUntil: "domcontentloaded" });

    let records = await page.evaluate(GetRankData_DOM).catch(err => { log(err); throw err });
    records.forEach(record => { if (!shared_utils.VerifyISBN10(record.isbn)) throw "ISBN?:" + record.title + record.isbn; })

    await traffic(records, record => GetBookData(record, browser))

    //--------
    await page.close();
    if (!browser_)
        browser.close();
    fs.writeFileSync("book_rank_net.json", JSON.stringify(records, null, 2))
}

const maxPromise = 5;
var index = 0;

async function relay(collection, func) {
    await func(collection[index])
    index++;

    if (index < collection.length) {
        log(`${index} of ${collection.length}`);
        await relay(collection, func);
    }
}


async function traffic(collection, func) {
    index = 0;
    let a = [];
    for (; index < maxPromise; index++) {
        a.push(relay(collection, func));
    }
    await Promise.all(a);
}

async function GetRankData_DOM() {
    const trs = document.querySelectorAll("#mymain table tr");
    let records = [];
    let count = 0;
    let temp = {};

    [].forEach.call(trs, tr => {
        if (count % 2 == 0) {
            let v = tr.children[0].innerText.trim();
            if (v[v.length - 1] != "部") throw "???";

            temp = {
                title: tr.children[1].innerText.trim(),
                salesValue: parseInt(v.substring(0, v.length - 1).replaceAll(',', '')),
                recordDate: tr.children[2].innerText.trim().replaceAll('/', '-')
            };

        } else {
            let texts = tr.querySelector("td > font > font").innerHTML.split("<br>");
            for (let x of texts) {
                x = x.trim();
                if (x.startsWith("部数詳細：")) {
                    temp.salesDesc = x.substring("部数詳細：".length).trim();

                } if (x.startsWith("情報元　：")) {
                    temp.sourceDesc = x.substring("情報元　：".length).trim();
                }
            }
            temp.isbn = tr.querySelector("td > font").getAttribute("id");

            records.push(temp)
        }
        count++;
    });

    return records
}

async function GetBookData(record, browser) {
    const url = "https://book-rank.net/rank/data.cgi?mode=rank&word=" + record.isbn;
    let page = await browser.newPage();
    await page.goto(url, { timeout: 0, waitUntil: "domcontentloaded" });
    let oldData = await page.evaluate(GetBookData_DOM).catch(err => { log(err); throw err });
    record.oldData = oldData;
    //await page.close();
    page.close();
}


async function GetBookData_DOM() {
    const sales = document.querySelector("#menu5");
    const reprint = document.querySelector("#menu15");

    if (sales) {
        if (sales.querySelector("a")) throw " has a";

    }
    if (reprint) {
        if (reprint.querySelector("a")) throw " has a";
    }

    return {
        sales: sales ? sales.innerText.trim() : null,
        reprint: reprint ? reprint.innerText.trim() : null,
    };
}