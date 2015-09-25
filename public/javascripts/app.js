(function () {

    'use strict';

    var app = angular.module("app", [
    	'osdForm',
    	'ngLodash'
    ])
    .service('authenticationService', function( $http, $q ) {
	   
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

	.controller('loginCtrl', ['authenticationService', '$scope', 
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
})();
