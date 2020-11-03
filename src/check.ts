import  puppeteer from 'puppeteer';
import fs = require('fs'); 
import path = require('path');

import { Level8 } from './level8';
require('path').dirname(require.main.filename)

const notifier = require('node-notifier');
var opn = require('opn');

(async () => {
    console.time("Duration");
    notifier.on('click', function (notifierObject, options, event) {
        opn('https://levelacht.de/slot-buchung/');

    });
    var filepath = path.resolve(__dirname,".." ,'level8.json');
    
    fs.readFile(filepath, async (err,data)=>{
        
     var input = JSON.parse(data.toString()) as Level8;
     console.log(input);    
     const browser =  await puppeteer.launch();
     const page = await browser.newPage();
        page.on('console', consoleObj => console.log(consoleObj.text()));

     await page.goto('https://levelacht.de/slot-buchung/');
        await page.waitForSelector(".drp-course-list-item-image");
     await page.evaluate(()=>{
         (<any>document.querySelector(".drp-course-list-item-image")).click();
     })
        await page.waitForSelector(".drp-calendar-day");

    await page.evaluate((input)=>{
        //Find the calendar date to click
        var all = document.querySelectorAll(".drp-calendar-day");
        console.log("Days found: " +all.length);
        all.forEach(dayElem=>{
            
            if (dayElem.innerHTML.trim() == input.day)
            {
                console.log("Found target date");
                setTimeout(() => {
                    (<any>dayElem).click();
                }, 100);
            }
        })
    }, <any>input)
        await page.waitForSelector(".drp-d-table-cell");

      var result = await page.evaluate( (input) => {
          return  new Promise(resolve => {
              var times = document.querySelectorAll(".drp-d-table-cell");
              for (let i = 0; i < times.length; i++) {
                  const hourElem = times[i];
                  
                      try {
                          var startHour = hourElem.innerHTML.trim().split(" ")[2].split(":")[0];
                          console.log(hourElem.innerHTML.trim().split(" ")["2"])
                          //Select the right slot
                          if (startHour == input.startTimeHour.toString()) {
                              if (!hourElem.parentElement.parentElement.parentElement.classList.contains("drp-date-not-relevant")) {
                                  console.log("Date Available!")
                                  resolve(true);
                                  return;
                              }
                              else {
                                  console.log("Date not available :(");
                              }

                          }
                          if(i == times.length-1)
                          {
                              resolve(false);
                          }
                      } catch (error) {
                          console.log("Date not available :(");
                          resolve(false);

                      }

                  
              }
            
          })
     }, <any>input)
     console.log(result);
     
     console.timeEnd("Duration");
     
     if(result)
     notify();
     await browser.close();
});
  
})();

function notify(){
    console.log("Notify sucess");
    
    notifier.notify('Your desired slot is free!');
    opn('https://levelacht.de/slot-buchung/');

}
