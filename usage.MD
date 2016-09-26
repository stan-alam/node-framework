#adminFunctions

This is Functions used for administration calls for permissions

##Methods

###allTenantsFlag

Convert allTenant Permissions on a Tenant

**Returns**: _Object_ - response from hub-admin-api

**Params**:  
*   jwt _String_

    - Token to be used in API request
*   permission _String_

    - [enable/disable] value for tenant Flag


###sharedDataCheck

Convert sharedDataCheck append any shared If needed to Next Step

**Returns**: _Object_ - response modified options with shared data Information

**Params**:  
*   options _Object_

    - Token to be used in API request


###updateModel

Convert updateModel modify a json object

**Returns**: _Object_ - response modified options with shared data Information

**Params**:  
*   newAttributes _Object_

    - List of attributes needed for updating


#authFunctions

This is Functions used for authentication and token manipulations

##Methods

###getUiToken

Pull the UI JWT from browser cookie.

**Returns**: _String_ - JWT - value of UI authentication token

**Params**:  
*   driver _String_

    - Selenium driver


###openJWT

Open JWT and get the contents of the token.

**Returns**: _Object_ - Returns - Contents of JWT

**Params**:  
*   jwtToken _String_

    - Encrypted JWT


###closeJWT

Close JWT Convert an Object to a Signed JWT for API Calls

**Returns**: _String_ - Returns - Encrypted and signed JWT

**Params**:  
*   token _Object_

    - Contents of JWT


###getAccessToken

Call to convert an application apikey to an Access Token

**Returns**: _String_ - Returns Encrypted and signed JWT from auth service

**Params**:  
*   ApiKey _Guid_

    - Application ApiKey from application configuration


###getEPAToken

Modify JWT to add Ethos to Tenant Name

**Returns**: _String_ - Encrypted and signed JWT with Tenant name having Ethos Prepended

**Params**:  
*   jwt _String_

    - Contents of JWT


###expireToken

Modify JWT to be expired

**Returns**: _String_ - Encrypted and signed JWT that is expired

**Params**:  
*   jwt _String_

    - Contents of JWT


#configFunctions

This is Functions used for making calls to hub-configuration-api

##Methods

###createApplications

Call to create a number of applications

**Returns**: _Array_ - Array of Objects for each response body and statusCode

**Params**:  
*   count _Integer_

    - Number of applications you are looking to create
*   JWT _String_

    - Token to be used when making calls to config
*   listAppNames _Array_

    - Empty Array or an Array of string as application names
*   responses _Array_

    - Always an Empty array


###deleteApplications

Call to delete one application

**Returns**: _Object_ - Objects containing statusCode

**Params**:  
*   id _Guid_

    - Application ID to be deleted
*   JWT _String_

    - Token to be used when making calls to config


###addPublishingResource

Modify an application to make authoritative for a resource

**Returns**: _Array_ - Array of Objects for each response body and statusCode

**Params**:  
*   JWT _String_

    - Token to be used when making calls to config
*   application _Object_

    - whole object of the application to assign a resource too
*   resourceName _String/array_

    - resource name as a string or an array of resource names


###addSubscribingResources

Call to add Subscriptions to an application

**Returns**: _Array_ - Array of Objects for each response body and statusCode

**Params**:  
*   JWT _String_

    - Token to be used when making calls to config
*   application _Object_

    - Application Object to add Resource as subscription
*   resourceName _String/array_

    - Resource name or array of resource names


###getConfiguration

Call to get array of objects for each Configuration

**Returns**: _Array_ - Array of applications from configuration

**Params**:  
*   JWT _String_

    - Token to be used when making calls to config


###addCredentials

Call to Add Credentials for EPA's

**Returns**: __ - result statuscode and body from configuration

**Params**:  
*   appId _Guid_

    - Application ID to add credentials too
*   username _String_

    - Username for Credentials
*   password _String_

    - Password for Credentials
*   title _String_

    - Title for Credentials
*   jwt _String_

    - Bearer Token for making call


#errorFunctions

This is Functions used for making calls to error-reporting-service

##Methods

###sendErrorMessages

Call to send an Error Message to service

**Returns**: _Array_ - Array of responses for each request to error service

**Params**:  
*   jwt _String_

    - Token to use when sending error Message
*   payload _Object_

    - The error Message Payload that is to be sent to error service
*   count _Integer_

    - Number of requests to send to error service
*   responses _Array_

    - Array of responses from error service


###sendMessageBadMediaType

Call to send an Send bad media type to any endpoint

**Returns**: _Array_ - Array of responses for each request to error service

**Params**:  
*   jwt _String_

    - Token to use when sending
*   endpoint _String_

    - Which endpoint to make call too
*   payload _Object_

    - The error Message Payload that is to be sent to error service


###sendMessageExpiredToken

Call to send an Send an expired token to any endpoint

**Returns**: _Array_ - Array of responses for each request to error service

**Params**:  
*   jwt _String_

    - Token to use when sending
*   endpoint _String_

    - Which endpoint to make call too
*   payload _Object_

    - The error Message Payload that is to be sent to error service


#mqsFunctions

This is Functions used for making calls to hub-message-queue-service

##Methods

###callConsumeAll

Call to MQS using Consume All

**Returns**: _Object_ - response from MQS body with status code

**Params**:  
*   JWT _String_

    - Token to be used when making calls to config
*   lastId _LastId_

    - last process ID


###callConsume

Call to MQS using Consume

**Returns**: _Object_ - response from MQS including body and status code

**Params**:  
*   JWT _String_

    - Token to be used when making calls to config
*   lastId _LastId_

    - last process ID


#preSetup

This is Function that setups a working environment for users to start using used for making calls to a already setup config

##Methods

###setup

setup this is for setting up a default environment for running tests on

**Returns**: _Object_ - driver - selenium driver

**Params**:  
*   driver _Object_

    - selenium driver


###cleanUp

clean Up just to remove everything added by setup

**Returns**: _Object_ - driver - selenium driver

**Params**:  
*   driver _Object_

    - selenium driver
*   setupData _Object_

    - Data used for removing


#pubFunctions

This is Functions used for making calls to hub-publish-api

##Methods

###createChangeNotification

Call to create a change notification using default framework

**Returns**: _Object_ - Generated Change Notification

**Params**:  
*   resourceName _String_

    - Resource the Change notification will be attached too


###sendChangeNotifications

Call to create a send change notification to Publisher

**Returns**: _Array_ - Array of responses for each request to publisher

**Params**:  
*   jwt _String_

    - Token to use when sending change notification to publisher
*   payload _Object_

    - The change notification that is to be sent to publisher
*   count _Integer_

    - Number of requests to send to publisher
*   responses _Array_

    - Array of responses from publisher


