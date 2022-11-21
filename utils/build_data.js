const fs = require('fs')


const args = process.argv.splice(2);
const dara_dir = args[0];

const filterLatestObject =
    ({ title, salesValue, recordDate, salesDesc, sourceDesc, isbn }) =>
        ({ title, salesValue, recordDate, salesDesc, sourceDesc, isbn });
const filterHistoryRecord =
    ({ salesValue, recordDate, salesDesc, sourceDesc }) =>
        ({ salesValue, recordDate, salesDesc, sourceDesc });
const filterHistoryObject = ({ title, isbn, salesValue, oldData }) => {
    let r = { isbn };
    r.salesRecords = [];
    r.reprintRecords = [];
    let firstProcessed = false;
    if (oldData) {
        if (oldData.sales) {
            const lines = oldData.sales.split('\n');
            lines.forEach(line => {
                const date = line.match(/^.*?[\s]+/)[0]; //there are nbsp;
                if (!date.match(/[0-9]{4}\/[0-9]{2}\/[0-9*]{2}/)) { throw "unexpect sales record：" + line }
                const rest = line.substring(date.length)
                const v = GetSalesValue(rest);
                //console.log(v, rest)
                if (!firstProcessed) {
                    firstProcessed = true;
                    if (v == salesValue) return;
                    const known = [
                        "しあわせ食堂の異世界ご飯"
                    ]
                    if (!known.includes(title)) {

                        throw "First old sales record should be latest." + `${title}|Old ${v}|Latest ${salesValue}`
                    }
                }
                r.salesRecords.push({
                    recordDate: date.trim().replaceAll('/', '-').replace('-**', ''),
                    salesDesc: rest,
                    salesValue: v,
                    sourceDesc: "book-rank.net"
                })
            })
        }
        if (oldData.reprint) {
            const lines = oldData.sales.split('\n');
            lines.forEach(line => {
                let date = line.match(/[0-9]{4}\/[0-9]{2}\/[0-9*]{2}/);
                if (!date) { throw line }
                date = date[0].replaceAll('/', '-').replace('-**', '');

                r.reprintRecords.push({
                    recordDate: date,
                    reprintDesc: line,
                    sourceDesc: "book-rank.net"
                })
            })
        }
    }
    return r;
}

function GetSalesValue(desc) {
    let m;
    m = desc.match(/([0-9]+)[.]([0-9])万部/)
    if (m) { return parseInt(m[1]) * 10000 + parseInt(m[2]) * 1000 }
    m = desc.match(/([0-9]+)万(部|冊|突破)/);
    if (m) { return parseInt(m[1]) * 10000 }
    m = desc.match(/([0-9]+)部/);
    if (m) { return parseInt(m[1]) }
    m = desc.match(/([0-9]+)万([0-9]+)千部/);
    if (m) { return parseInt(m[1]) * 10000 + parseInt(m[2]) * 1000 }
    throw "unexpect sales desc: " + desc;
}

// Main

const baseData = JSON.parse(fs.readFileSync(dara_dir + "base/base.json"));
const patchFiles = fs.readdirSync(dara_dir + "base/").filter(f => f.match(/20[0-9]{2}.json/))
var latestData = baseData.map(filterLatestObject);
var historyData = baseData.map(filterHistoryObject);

patchFiles.forEach(file => {
    const data = JSON.parse(fs.readFileSync(dara_dir + "base/" + file));
    data.forEach(item => {
        const latestRef = latestData.find(x => x.isbn == item.isbn);
        if (latestRef) {
            const copy = filterHistoryRecord(latestRef);
            const historyRef = historyData.find(x => x.isbn == item.isbn);
            if (historyRef) {
                historyRef.salesRecords.push(copy)
            } else {
                historyData.push({
                    isbn: item.isbn,
                    salesRecords: [copy]
                })
            }
            ["title", "salesValue", "recordDate", "salesDesc", "sourceDesc", "isbn"].forEach(p => latestRef[p] = item[p]);
        } else {
            latestData.push(item);
        }
    })
})





fs.writeFileSync(dara_dir + "latest.json", JSON.stringify(latestData, null, 2));
fs.writeFileSync(dara_dir + "history.json", JSON.stringify(historyData, null, 2));



