
var  Okta_Single_SignOn = {
    signInUserName: "//*[@id='user-signin']",
    signInPassword: "//*[@id='pass-signin']",
    signInButton:   "//*[@id='signin-button']"
}

var CommonModal = {
    inputTitleId: "Add Application",
    inputRequiredLinkId:  ".//*[@id='addApplication_link']",
    inputForApp: "//input[@id='input_name']",
    saveButtonForApplicationAdd: "//button[@name='save']",
    buttonEditDesc: "//button[@id='edit_description']",
    inputFieldDesc: ".//textarea[@id='input_description']",
    buttonSaveDesc: "//button[@id='save_description']",
    inputRequiredLinkHome: "//a[contains(@href, '/#/dashboard')]"
}

var common = {
    t : true
}

var addRecordModal = {}
var dashboard = {}
var groupCards = {}
var records = {}
var recordEntry = {}
var table = {}

module.exports = {
    //addRecords:    addRecords,
    Okta_Single_SignOn: Okta_Single_SignOn,
    CommonModal: CommonModal,
    common: common,
    addRecordModal: addRecordModal,
    dashboard: dashboard,
    groupCards: groupCards,
    records: records,
    recordEntry: recordEntry,
    table: table
}
