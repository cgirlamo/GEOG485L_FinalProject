# ng-favicon
[ng-favicon](https://github.com/sarfarazansari/ng-favicon)  is an AngularJS module that let you easily get and display the favicon of any website. With the help of Google Shared Stuff that returns image with website's favicon by hostname.


## Download

You can download this by:

* Using bower: `bower install ng-favicon`
* Download the "ng-favicon.js" file and place it in your scripts folder.

## Usage

Add the "ng-favicon.js" script to your html file, then you could use this just as you would use any other directive.

#### Inject in your app
````js
angular.module("YOUR_APP_NAME", ["ng-favicon"]);
````

#### In Html page
````html
<favicon url="'http://github.com'" description="'GitHub'"></favicon>
````


### Enjoy!