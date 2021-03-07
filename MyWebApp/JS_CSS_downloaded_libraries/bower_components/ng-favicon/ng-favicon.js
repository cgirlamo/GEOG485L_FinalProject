angular.module("ng-favicon", [])
.directive("favicon", function() {
	var directive = {
		restrict: "E",
		replace: true,
		template: '<img ng-src="{{faviconUrl}}" alt="{{description}}">',
		scope: {
			url: "=",
			description: "="
		},
		link: link
	}

	function link(scope, element, attrs) {

		function createFaviUrl(url) {
			var provider = "https://www.google.com/s2/favicons?domain=%s";
			return provider.replace(/%s/g, url);
		}

		function init() {
			if (isSubdomain(scope.url)){
				var url = splitMainDomain(scope.url);
				scope.faviconUrl = createFaviUrl(url);
			}
			else{
				var url = purifyUrl(scope.url);
				scope.faviconUrl = createFaviUrl(url);
			}
		};

		function isSubdomain(url){
			
			// IF THERE, REMOVE WHITE SPACE FROM BOTH ENDS
		  url = url.replace(new RegExp(/^\s+/),""); // START
		  url = url.replace(new RegExp(/\s+$/),""); // END

		  // IF FOUND, CONVERT BACK SLASHES TO FORWARD SLASHES
		  url = url.replace(new RegExp(/\\/g),"/");

		  // IF THERE, REMOVES 'http://', 'https://' or 'ftp://' FROM THE START
		  url = url.replace(new RegExp(/^http\:\/\/|^https\:\/\/|^ftp\:\/\//i),"");

		  // IF THERE, REMOVES 'www.' FROM THE START OF THE STRING
		  url = url.replace(new RegExp(/^www\./i),"");

		  // REMOVE COMPLETE STRING FROM FIRST FORWARD SLASH ON
		  url = url.replace(new RegExp(/\/(.*)/),"");

		  // REMOVES '.??.??' OR '.???.??' FROM END - e.g. '.CO.UK', '.COM.AU'
		  if (url.match(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i))) {
		    url = url.replace(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i),"");

		    // REMOVES '.??' or '.???' or '.????' FROM END - e.g. '.US', '.COM', '.INFO'
		  } else if (url.match(new RegExp(/\.[a-z]{2,4}$/i))) {
		    url = url.replace(new RegExp(/\.[a-z]{2,4}$/i),"");
		  }

		  // CHECK TO SEE IF THERE IS A DOT '.' LEFT IN THE STRING
		  var subDomain = (url.match(new RegExp(/\./g))) ? true : false;

		  return(subDomain);
		}

		function splitMainDomain(url){
			var urlObj = new URL(url);
			// would be true. dot found in url
			if(urlObj.host.indexOf('.') !== -1){
			  var urlArr = urlObj.host.split('.');
			  return  urlObj.protocol + '//' +urlArr[1] +'.'+ urlArr[2] ;
			}
			else{
				return  urlObj.protocol + '//' + urlObj.host;
			}
		}

		function purifyUrl(url){
			var urlObj = new URL(url);
			return  urlObj.protocol + '//' + urlObj.host;
		}

		// init func
		init();
	}

	return directive;
});