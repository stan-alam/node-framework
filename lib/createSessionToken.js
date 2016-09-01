"use strict";


module.exports = {

    createSessionToken: function(cb) {
        var fs = require('fs');
        var sessionStorage;


        var wd = require('webdriver-sync');
        var ChromeDriver = wd.ChromeDriver;
        var driver = new ChromeDriver();
        var sleepy = require('sleep');




        driver.get('https://test-integrationhub-integrate.10004.elluciancloud.com/#/dashboard');
        sleepy.sleep(3);


        driver.findElement(wd.By.xpath("//*[@id='user-signin']")).sendKeys("kingfox");
        driver.findElement(wd.By.xpath("//*[@id='pass-signin']")).sendKeys("Demo99!?");
        driver.findElement(wd.By.xpath("//*[@id='signin-button']")).click();
        sleepy.sleep(5);
        var sessionStorage = driver.executeScript('return window.sessionStorage.token');


        console.log("This is the User's session token " + sessionStorage)

        fs.writeFile("./sessionStorage.txt", sessionStorage, function(err) {
            if (err) {
                return console.log(err);
            }
        });

        driver.quit();
        cb(null);
    },


};

