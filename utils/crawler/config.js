const puppeteer = require('puppeteer-core');
const fs = require('fs')

var configLoaded = false;
var executablePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
var proxyServer = "";

var configs = {};

const normalNames = ["github-token"];

function ReadConfig() {
    if (configLoaded) return;
    try {
        const config = fs.readFileSync('config.txt', 'utf8');

        config.split('\n').forEach(line => {
            let c = line.split('\t')
            if (c.length != 2) return;
            switch (c[0]) {
                case "executablePath":
                    executablePath = c[1].trim();
                    break;
                case "proxy-server":
                    proxyServer = c[1].trim();
                    break;
                default:
                    if (normalNames.includes(c[0])) {
                        configs[c[0]] = c[1].trim();
                    }
                    break;
            }
        })

    } catch {

    }

    configLoaded = true;
}


/**
* @return {Promise<puppeteer.Browser>}  Browser
*/
async function CreateBrowser() {
    ReadConfig();
    let obj = {
        executablePath: executablePath,
        args: [
            proxyServer ? `--proxy-server=${proxyServer}` : "",
            '--lang=ja-JP']
    };

    obj.headless = false;// Debug用

    const browser = await puppeteer.launch(obj);

    return browser;
}

function getConfigValue(name) {
    ReadConfig();
    return configs[name];
}
exports.CreateBrowser = CreateBrowser;
exports.getConfigValue = getConfigValue;