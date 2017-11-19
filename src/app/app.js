
	var meovn = angular.module('meovn', ['ui.router', 'cfp.hotkeys', 'ngAnimate', 'toastr', 'firebase', 
		'facebook', 'CopyToClipboard', 'angular-web-notification', '720kb.tooltips', 'highcharts-ng', 'perfect_scrollbar'])
  .constant('days', 3)
  .constant('appVersion', '3.0.0')
  .constant('releaseDate', 'Nov-20, 2017')
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
    				url        : 'order/:id/:mobile/seller_id=:seller',
            controller : 'DetailController',
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
    })
  .run(themeRun);

  function themeRun($rootScope, appVersion, releaseDate){
    $rootScope.appVersion = appVersion;
    $rootScope.releaseDate = releaseDate;
  }

meovn.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);