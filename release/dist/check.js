"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs = require("fs");
const path = require("path");
require('path').dirname(require.main.filename);
const notifier = require('node-notifier');
var opn = require('opn');
(() => __awaiter(this, void 0, void 0, function* () {
    console.time("Duration");
    notifier.on('click', function (notifierObject, options, event) {
        opn('https://levelacht.de/slot-buchung/');
    });
    var filepath = path.resolve(__dirname, "..", 'level8.json');
    fs.readFile(filepath, (err, data) => __awaiter(this, void 0, void 0, function* () {
        var input = JSON.parse(data.toString());
        console.log(input);
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        page.on('console', consoleObj => console.log(consoleObj.text()));
        yield page.goto('https://levelacht.de/slot-buchung/');
        yield page.waitForSelector(".drp-course-list-item-image");
        yield page.evaluate(() => {
            document.querySelector(".drp-course-list-item-image").click();
        });
        yield page.waitForSelector(".drp-calendar-day");
        yield page.evaluate((input) => {
            //Find the calendar date to click
            var all = document.querySelectorAll(".drp-calendar-day");
            console.log("Days found: " + all.length);
            all.forEach(dayElem => {
                if (dayElem.innerHTML.trim() == input.day) {
                    console.log("Found target date");
                    setTimeout(() => {
                        dayElem.click();
                    }, 100);
                }
            });
        }, input);
        yield page.waitForSelector(".drp-d-table-cell");
        var result = yield page.evaluate((input) => {
            return new Promise(resolve => {
                var times = document.querySelectorAll(".drp-d-table-cell");
                for (let i = 0; i < times.length; i++) {
                    const hourElem = times[i];
                    try {
                        var startHour = hourElem.innerHTML.trim().split(" ")[2].split(":")[0];
                        console.log(hourElem.innerHTML.trim().split(" ")["2"]);
                        //Select the right slot
                        if (startHour == input.startTimeHour.toString()) {
                            if (!hourElem.parentElement.parentElement.parentElement.classList.contains("drp-date-not-relevant")) {
                                console.log("Date Available!");
                                resolve(true);
                                return;
                            }
                            else {
                                console.log("Date not available :(");
                            }
                        }
                        if (i == times.length - 1) {
                            resolve(false);
                        }
                    }
                    catch (error) {
                        console.log("Date not available :(");
                        resolve(false);
                    }
                }
            });
        }, input);
        console.log(result);
        console.timeEnd("Duration");
        if (result)
            notify();
        yield browser.close();
    }));
}))();
function notify() {
    console.log("Notify sucess");
    notifier.notify('Your desired slot is free!');
    opn('https://levelacht.de/slot-buchung/');
}
//# sourceMappingURL=check.js.map