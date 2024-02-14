import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express()

const base_url = "https://pemilu.kompas.com/quickcount/indikator"

app.get("/quickcount", async (req, res) => {
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

    res.json({ 
        "member": {
            "anis": anis,
            "prabowo": owo,
            "ganjar": gunjar
        },
        "last_updated": lastUpdedList[3],
        "last_data_entry": lastUpdedList[4]
    })
})


app.listen(3000, () => {
    console.log("running on port 3000")
})