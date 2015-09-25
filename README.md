#Osedea

Coding Challenge Solution By Rabih El-Zahr

###Step 1

I created a new bower configuration file ".bowerrc" in the project root that specifies the directory of bower components to be in "public/components". The configuration file contains the following content:

	{
	  "directory" : "public/components"
	}

###Step 3

I modified the "bower.json" file to include the latest version of "angular-osd-form" and "ng-lodash"

	{
	  "name": "coding-challenge",
	  "version": "0.0.0",
	  "authors": [
	    "Angus <donald.macisaac@mail.mcgill.ca>"
	  ],
	  "license": "MIT",
	  "ignore": [
	    "**/.*",
	    "node_modules",
	    "bower_components",
	    "test",
	    "tests"
	  ],
	  "dependencies": {
	    "angular": "~1.4.1",
	    "angular-osd-form": "*",
	    "ng-lodash": "*"
	  }
	}

###Step 3

I executed "bower install" to install the latest version of "angular-osd-form", "ng-lodash" and "ng-messages"

###Step 4

I modified "views/layout.jade" file to include script tag for "angular-osd-form" and "ng-lodash" 

	doctype html
	html
	  head
	    title="!!!"
	    link(rel='stylesheet', href='/stylesheets/style.css')
	    link(rel='stylesheet', href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css')
	  body(ng-app="app")
	    block content
	    script(src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js")
	    script(src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js")
	    script(src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js")
	    script(src="/javascripts/app.js")
	    script(src="/components/ng-lodash/build/ng-lodash.min.js")
	    script(src="/components/angular-osd-form/angular-osd-form.min.js")
	    script(src="/components/ng-messages/angular-messages.min.js")

###Step 5

I added "osdForm" and "ngLodash" modules to the Angular application module 'public/javascripts/app.js'

    var app = angular.module("app", [
    	'osdForm',
    	'ngLodash'
    ])

###Step 6

I created a service called 'authenticationService' that exposes a public interface called 'login'. The public interface is mapped to into a private method called 'authentcate' that performs asynchronous http request with the passed data 'userInfo' and handles the callback whether it's a success or failure.

    service('authenticationService', function( $http, $q ) {
	   
	    function authenticate(userInfo){
	    	var req = $http({method:"post", url:"/login", data: userInfo})
	    	return (req.then(handleSuccess,handleError));
	    }

	    function handleSuccess( response ) {
	        return response.data ;
	    }

	    function handleError( response ) {
	    	// If the response does contain error message, use expected error message 
	        if (angular.isObject(response.data) && 'undefined' !== typeof response.data.message) {
	        	// Otherwise, use default error message
	        	return( $q.reject( response.data.message ) );
	        }
	        else {
            	return( $q.reject( "An unknown error occurred." ) );
	        }
	    }

	    return({
	        login: authenticate,
	    });
	})

###Step 7

I created a controller called 'loginCtrl' that has an empty object 'data' to hold the user data and a method 'submit' that performs an asynchronous http request using the 'authenticationService' previously created. If the promise is resolved with success the controller logs 'Login success + userInfo' and if resolved with failure the controller logs 'Login failed + errorMessage'. 

	controller('loginCtrl', ['authenticationService', '$scope', 
		function(authenticationService, $scope){
			$scope.data = {};

			$scope.submit = function() {
				authenticationService.login($scope.data).then(function(res){
					console.log('Login success',res);
				})
				.catch(function (err) {
					console.log('Login failed',err);
				}); 
			}
		}
	]);

###Step 8

I modified the 'view/index.jade' template:
 - I linked the form to the 'loginCtrl' controller
 - I added a name to the form, linked the previously defined 'submit' method in the 'loginCtrl' controller to 'osd-submit' so that it will be triggered if all validations are okay and I prevented the default browser validation by adding 'novalidate'
 - I added osd-field tag to define 'username' and password as the fields to be validated
 - I modified the username input field to make it required, then I added the osd-error default tag inside the osd-field tag to display proper error messages if the user attempts to submit the form without specifiying a username
 - I modified the password input field to make it required, then I added the osd-error default tag inside the osd-field tag to display proper error messages if the user attempts to submit the form without specifiying a password 
 - I modified the password to have a minimum of 6 characters, then I added the osd-error with error-type 'minLength' inside the osd-field tag to display proper error messages if the user attempts to submit the form with a password that contains less than 6 characters

    <div ng-controller="loginCtrl">
        <form name="osedeaLogin" osd-submit="submit()" novalidate>
            <div class="form-group">
                <label class="control-label">Username</label>
                <osd-field attr="username">
                    <input type="text" name="username" class="form-control" ng-model="data.username" required="required" />
                    <osd-error msg="Username is required!"></osd-error>
                </osd-field>
            </div>
            <div class="form-group">
                <label class="control-label">Password</label>
                <osd-field attr="password">
                    <input type="password" name="password" minLength="6" maxlength="12" class="form-control" ng-model="data.password" required="required" />
                    <osd-error msg="Password is required!"></osd-error>
                    <osd-error error-type="minlength" msg="Password must contain atleast 6 characters"></osd-error>
                </osd-field>
            </div>
            <div class="form-group">
                <button class="btn btn-primary">
                    Submit
                </button>
            </div>
        </form>
    </div>

#Step 9

I added a new route in 'routes/index.js' to handle the login post

router.post('/login', function(req, res,next){
	var username=req.body.username,
		password=req.body.password;

	// Authorized user
	res.status(200).json({username: username, password: password});

	// Unauthorized user
	// res.status(401).json({message:'Unauthorized',username: username, password: password});

	// Unknown Error
	// res.status(400).json({username: username, password: password});
});

###Important note

Dependencies are not included in the code, you must execute the following commands in the application directory in order to run the solution:

    - Install node dependencies using 'npm install'
    - Install bower dependecies using 'bower install'
    - Start express sever using 'npm start'
    - Access the application by visiting 'http://localhost:3000/' in your browser
