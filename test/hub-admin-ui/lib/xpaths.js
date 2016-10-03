module.exports.xpaths = {
    addAppClose: "//span[contains(@data-ng-click, 'cancelAddRecord')]",
    addAppSave: "//*[@id='wizard_save_button']",
    add: "//*[@id='card_dialog_add_button']",
    archiveHistoryRowOneStatus: "//*[@id='tab-content-5']/div/ng-include/div[2]/table/tbody/tr[2]/td[6]/span[2]",
    authoritativeApplicationsCredentialsList: "//*[@id='panel']/div/div/section[*]/div/h4/a[2]",
    breadCrumbsOne: "//*[@id='bread-crumbs-title']/cp-view-title",
    buttonConfirmDeleteApplication: ".//button[@id='delete_confirm_button']",
    buttonConfirmDelete: "//button[@id='delete_confirm_button']",
    buttonDeleteApplication: ".//button[contains(@data-hint,'Delete')]",
    buttonDeleteAuthoritativeApplicationTemplate: "//*[text()='TEMPLATE']/../..//button[@id='card_delete_button']",
    buttonEditAuthoritativeApplicationTemplate: "//*[text()='TEMPLATE']/../..//button[@id='card_edit_button']",
    buttonEditDesc: "//button[@id='edit_description']",
    buttonEditPassword: "//*[@id='edit_password']",
    buttonEditUsername: "//*[@id='edit_username']",
    buttonSaveDesc: "//button[@id='save_description']",
    buttonSavePassword: "//*[@id='save_password']",
    buttonSaveUsername: "//*[@id='save_username']",
    buttonSearchClose: '//cp-translate[text()="Search"]/../../span',
    cancel: "//*[@id='card_dialog_cancel_button']",
    cardAuthoritativeApplicationTemplate: "//*[text()='TEMPLATE']/../../..",
    closeDialog: "//*[contains(@data-ng-click, 'cancelPromptForNewElement')][contains(@class, 'close')]",
    closeMultiDialog: "//*[contains(@data-ng-click, 'closeLookupMultiple')][contains(@class, 'close')]",
    credentialsPasswordTemplate: "//*[text()='TEMPLATE']/../../ul/li[2]/*/span",
    credentialsUsernameTemplate: "//*[text()='TEMPLATE']/../../ul/li[1]/*/span",
    filterHistoryRowOneStatus: "//span[text()='TEMPLATE']",
    findAnchorByTemplate: "//a[text() = 'TEMPLATE']",
    findButtonDataHintByTemplate: "//button[@data-hint = 'TEMPLATE']",
    findElementIdByTemplate: "//*[@id='TEMPLATE']",
    findElementTextByTemplate: "//*[text() = 'TEMPLATE']",
    findTdByTrContainsTemplate: "//tr[contains(td,'TEMPLATE')]",
    findButtonSpanClassContainsTemplate: "//span[contains(@class,'TEMPLATE') and contains(@role,'button')]",
    findName: "//*[@name='TEMPLATE']",
    findId: "//*[@id='TEMPLATE']",
    findTitleColumn: '//*[contains(@class, "title-column")][text()="TEMPLATE"]',
    firstRow: "//a[text()='TEMPLATE']",
    grabStringForEnvironment: "//section/div/h3/cp-translate",
    historyRowOneStatus: "//*[@id='tab-content-2']/div/ng-include/div[2]/table/tbody/tr[2]/td[6]/span[2]",
    inputFieldDesc: ".//textarea[@id='input_description']",
    inputForApp: "//input[@id='input_name']",
    inputName: "//*[@id='input_name']",
    inputPassword: "//*[@id='input_password']",
    inputRequiredLinkId:  ".//*[@id='addApplication_link']",
    inputUriOverride: "//*[@id='input_uriOverride']",
    inputUsername: "//*[@id='input_username']",
    linkBackToCredentials: "//*[@id='back-button']",
    linkCredentialsTab: "//*[@id='credentials_tab']",
    linkPrivilegedApp: "//*[@id='dashboard-aggregates']/div[3]/section/div/h4/a",
    linkSelectEnv: "//span[2]",
    linkSelectProd: "//label[@id='production_label']",
    linkSelectTest: "//label[@id='test_label']",
    linkSettings: "//a[@id='settings_link']",
    linksHome: "//a[contains(@href, '/#/dashboard')]",
    linksRequiredLinkHome: ".//*[contains(@href, '/#/dashboard')]",
    linksSelectApplication: ".//input[@type='checkbox']",
    linksViewApplication: ".//*[@id='applicationsCount_link']",
    manWizardAppCreate: "//*[@id='addApplication_link']/div/span",
    publishedMessages: "//*[@id='dashboard-aggregates']/div[1]/header",
    resourceGroup: "//div[contains(@class,'group-cards')]",
    resourceName: "//div[contains(@class, 'group-cards')]//div[contains(@class, 'card')][h4/a/span[text()='TEMPLATE']]/h4/a",
    resourceNameInCardsByTemplate: "//div[contains(@class, 'group-cards')]//div[contains(@class, 'card')][h4/a/span[text()='TEMPLATE']]/h4/a/span",
    resultRow: "//td[text()='TEMPLATE']",
    saveButtonForApplicationAdd: "//button[@name='save']",
    searchDialog: "//*[contains(@class, 'search-button')]",
    sectionSearch: "//span[contains(@class, 'section-title')][not(@aria-hidden)][text()='TEMPLATE']",
    selectAll: "//*[@id='checkboxAll']",
    tabArchiveHtml: "/html/body/div[2]/div[2]/section/section/div/md-tabs/md-tabs-wrapper/md-tabs-canvas/md-pagination-wrapper/md-tab-item[2]",
    tabQueueHtml: "/html/body/div[2]/div[2]/section/section/div/md-tabs/md-tabs-wrapper/md-tabs-canvas/md-pagination-wrapper/md-tab-item[1]",
    userprofilecard: "//*[@id='user_profile_link']",
    signout: "//*[@id='sign_out_button']",
    errorsLinkDashboard: '//*[@id="errorsCount_link"]/div/span',
    tableResultHeader: '//*[contains(@class, "search-results")]//th',
    errorsLinkFirstRowDateTime: '//*[contains(@class, "title-column")]/a',
    errorsOverviewLabels: '//*[contains(@class, "single-wrapper")]//label',
    errorsOverviewTexts: '//*[contains(@class, "single-wrapper")]//span[not(contains(@class, "ng-hide"))]',
    filterBtn: '//*[contains(@class, "filter")]',
    resultCount: '//*[contains(@class, "results-found")]',
    noRecordsFound: '//*[contains(@class, "alert-td-fullspan")]',
    clearSearch: '//*[contains(@class, "secondary float-left")]',
    dropdownPerPage: '//*[@id="perPage"]',
    dropdownPerPageLast: '//*[@id="perPage"]/option[last()]'
}
