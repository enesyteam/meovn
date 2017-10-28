
	var meovn = angular.module('meovn', ['ui.router', 'cfp.hotkeys', 'ngAnimate', 'toastr', 'firebase', 
		'facebook', 'CopyToClipboard', 'angular-web-notification', 'ngAudio', '720kb.tooltips', 'highcharts-ng'])
	.config(function($stateProvider, $urlRouterProvider, FacebookProvider){
        $urlRouterProvider.otherwise("/");
        $stateProvider
          .state('home',{
            url: '/',
            controller : 'OrdersController',
            templateUrl: "/templates/home.html"
          })
          .state('home.details', {
				url        : 'order/:id/seller=:seller',
				params     : { id : null, seller: null},
				templateUrl: 'templates/order-details.html'
			})
          .state('auth',{
            url: '/auth',
            controller : 'AuthController',
            templateUrl: "/templates/auth.html"
          });

        var myAppId = '1085772744867580';
            FacebookProvider.init(myAppId);
    });

