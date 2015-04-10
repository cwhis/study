'use strict';
var app = angular.module('mainApp', ['ngRoute','ngTouch']);
app.config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/users/signup.html',
            controller: 'SignUpCtrl'
        })
        .when('/login', {
            templateUrl: 'views/users/login.html',
            controller: 'LoginCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

   //$locationProvider.html5Mode(true);
}]).run(function(){

})
