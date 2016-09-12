
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
    linksRequiredLinkHome: ".//*[contains(@href, '/#/dashboard')]",
    linksSelectApplication: ".//input[@type='checkbox']",
    linksViewApplication: ".//a[@id='applicationsCount_link']",
    buttonDeleteApplication: ".//button[contains(@data-hint,'Delete')]",
    buttonConfirmDeleteApplication: ".//button[@id='delete_confirm_button']",
    linksHome: "//a[contains(@href, '/#/dashboard')]",
   // linkSelectEnv: ".//link[@id='kingfox@ellucian.me.sandbox']",
<<<<<<< HEAD
    linkSelectEnv: "//a[@id='settings_link']",
    linkSelectProd: "//label[@id='production_label']/cp-translate",
    linkSelectTest: "//label[@id='test_label']/cp-translate",
=======
    linkSelectSettings: "//a[@id='settings_link']",
    linkSelectProd: "//label[@id='production_label']",
    linkSelectTest: "//label[@id='test_label']",
>>>>>>> 82cb59eb071a389a3a3b961c9d8207fb0119ff81
    //label[@id='ProductionLabel']
    grabStringForEnvironment: "//section/div/h3/cp-translate"
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
