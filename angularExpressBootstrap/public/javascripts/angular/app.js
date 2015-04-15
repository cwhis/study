'use strict';
var app = angular.module('app', ['ngRoute']);
app.config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {
    $routeProvider
        .when('/', {
        	templateUrl: 'views/tpl/production.html', 
        	controller: 'WelcomeCtrl'
        })
        .when('/login',{
        	templateUrl: 'views/tpl/login.html',
        	controller: 'loginCtrl'
        })
        .when('/home',{
        	templateUrl: 'views/tpl/home.html',
        	controller: 'homeCtrl'
        })
        .otherwise({redirectTo: '/'});
        $locationProvider.html5Mode('true');
}]);