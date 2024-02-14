import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

const env = dotenv.config()

const base_url = "https://pemilu.kompas.com/quickcount/indikator"
const baseHTML = await axios.get(base_url)
const $ = cheerio.load(baseHTML.data)

var anis = 0
var owo = 0
var gunjar = 0
var counterList = $(".qcResult__num").each(function (i, elem) {
    var cleanedString = $(this).text().replace(/\s/g, '-');
    var numbersArray = cleanedString.match(/[\d.]+/g);
    anis = numbersArray[0]
    owo = numbersArray[1]
    gunjar = numbersArray[2]
})


var lastUpdedList = []
var lastUpdated = $(".qcResult__vote__item").find("span").each(function (i, elem) {
    lastUpdedList.push($(this).text())
})


const token = process.env.TOKEN; // Replace with your own bot token
const bot = new TelegramBot(token, { polling: true });

var count = 0
setInterval(() => {
    count++
    bot.editMessageText(`
[ Pilpres Quickcount ]

Anis: ${anis}
Prabowo: ${owo}
Ganjar: ${gunjar}

Last Updated: ${lastUpdedList[3]}
Data Masuk Terakhir: ${lastUpdedList[4]}

count: ${count}
`, { chat_id: -1002050923780, message_id: 2, parse_mode: 'Markdown' })
}, 5000);