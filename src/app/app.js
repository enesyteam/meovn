
	var meovn = angular.module('meovn', ['ui.router', 'cfp.hotkeys', 'ngAnimate', 'toastr', 'firebase', 
		'facebook', 'CopyToClipboard', 'angular-web-notification', '720kb.tooltips', 'highcharts-ng', 'perfect_scrollbar'])
	.config(function($stateProvider,$locationProvider, $urlRouterProvider, FacebookProvider){
        $locationProvider.hashPrefix('');
        // use the HTML5 History API

        $urlRouterProvider.otherwise("/");
        $stateProvider
          .state('home',{
            url: '/',
                controller : 'OrdersController',
                templateUrl: "/templates/home.html"
              })
              .state('home.details', {
    				url        : 'order/:id/:mobile/seller=:seller',
            controller : 'OrdersController',
    				params     : { id : null,mobile: null, seller: null},
    				templateUrl: 'templates/order.html'
    			})
          .state('auth',{
            url: '/auth',
            controller : 'AuthController',
            templateUrl: "/templates/auth.html"
          });

        var myAppId = '1085772744867580';
            FacebookProvider.init(myAppId);
    });

