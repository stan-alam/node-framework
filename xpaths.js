
	var  Okta_Single_SignOn = {

         signInUserName: "//*[@id='user-signin']",
         signInPassword: "//*[@id='pass-signin']",
         signInButton:   "//*[@id='signin-button']"


	}


	var CommonModal = {
		inputTitleId: "Add Application",
    inputRequiredLinkId:  ".//*[@id='addApplication_link']"
    linksSelectApplication: ".//input[@type='checkbox']"
    linksViewApplication: ".//*[@id='applicationsCount_link']"
    buttonDeleteApplication: ".//button[contains(@data-hint,'Delete')]"
    buttonConfirmDeleteApplication: ".//button[@id='delete_confirm_button']"

	}


   var common = {
      t : true

   }


  var addRecordModal = {


  }


  var dashboard = {



  }



var groupCards = {




}


var records = {


}


var recordEntry = {



}


var table = {



}


	module.exports = {

		//addRecords:    addRecords,
    	Okta_Single_SignOn: Okta_Single_SignOn,
        CommonModal:        CommonModal,
    	common:      		common,
    	addRecordModal:   	addRecordModal,
    	dashboard:          dashboard,
       	groupCards:   		groupCards,
       	records:            records,
    	recordEntry:  		recordEntry,
    	table: 				table

    }