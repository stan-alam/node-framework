@echo off
color 0a
cd c:\Users\dwilson\tests\nodejs_testing_example
echo starting createApplications.js ...
node --harmony createApplications.js
echo creating applications: Banner, Colleague, Elevate and Pilot... done!
echo starting createResourcesOwnerBanner.js
node --harmony createResourcesOwnerBanner.js
echo Banner assigned resource subjects... done!
echo starting createSubscriptionsElevate.js
node --harmony createSubscriptionsElevate.js
echo  Elevate subscribed to subjects... done!
echo starting genBannerAccessToken.js
node --harmony genBannerAccessToken.js
echo  Banner Access Token generated... done!
cd test
echo starting publisher.js
mocha publisher.js
echo  publisher tests.. done!
echo exiting all publisher tests...







