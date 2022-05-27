const puppeteer = require('puppeteer');
const fs = require('fs')

var configLoaded = false;
var executablePath = "";
var proxyServer = "";
var dataDir = "data";
var fsmode = "";

var configs = {};

const normalNames = ["github-token"];

function ReadConfig() {
    if (configLoaded) return;
    const config = fs.readFileSync('config.txt', 'utf8');
    if (config) {
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
                case "data-dir":
                    dataDir = c[1].trim(); break;
                case "fsmode":
                    fsmode = c[1].trim(); break;
                default:
                    if (normalNames.includes(c[0])) {
                        configs[c[0]] = c[1].trim();
                    }
                    break;
            }
        })
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
            //proxyServer ? `--proxy-server=${proxyServer}` : "",
            '--lang=ja-JP']
    };

    // obj.headless = false;// Debug用

    const browser = await puppeteer.launch(obj);

    return browser;
}

function getDataDir() {
    ReadConfig();
    return dataDir;
}

function getFsMode() {
    ReadConfig();
    return fsmode;
}

function getConfigValue(name) {
    ReadConfig();
    return configs[name];
}
exports.CreateBrowser = CreateBrowser;
exports.getDataDir = getDataDir;
exports.getFsMode = getFsMode;
exports.getConfigValue = getConfigValue;