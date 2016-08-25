'use strict';

const
    expect  = require("chai").expect,
    wd = require('webdriver-sync');

exports.startDriver = function(browser) {

    let driver;
    let url = 'https://test-integrationhub-integrate.10004.elluciancloud.com/#/dashboard';
    switch(browser) {
        case 'firefox':
            let FirefoxDriver = wd.FirefoxDriver;
            driver = new FirefoxDriver();
            driver.get(url);
            break;
        case 'chrome':
            let ChromeDriver = wd.ChromeDriver;
            driver = new ChromeDriver();
            driver.get(url);
            break;
        default:
            console.error('Unknown browser: ', browser);
    }

    return driver;
}

exports.endDriver = function(driver) {
    driver.quit();
    return driver;
}