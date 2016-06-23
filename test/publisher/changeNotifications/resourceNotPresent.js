"use strict"
let resourceNotPresent = function(){ 
  return {
   "publisher": {  
      "applicationName":"Banner",
      "id":"c4b6181e-f4aa-4448-adc5-681ee48fa071"
   }, 
   "operation": "created",
   "contentType": "resource-representation",
   "content":{
    "metadata": { "dataOrigin": "Elevate" },
    "guid": "ca60d2ff-ab8a-4d45-94f4-cf5979823bda",
    "abbreviation": "CS",
    "title": "Computer Science 101",
    "description": "The fundamentals of computer science. Computers may be studied in its own right ( pure ones and zeros )."
    }
 };
};

module.exports={ rnp: resourceNotPresent };