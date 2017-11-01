meovn.directive('myEnter', function () {
    return function (scope, element, attrs) {
    	scope.isPageBusy = true;
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                    scope.submitComment(scope.selectedOrder);
                    scope.isPageBusy = false;
                });
                event.preventDefault();
            }
            else if(event.which === 27){
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                    scope.clearCommentData();
                });
            }
        });
    };
});

meovn.directive('requestEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.requestEnter);
                    scope.submitRequest(scope.selectedOrder);
                    scope.isPageBusy = false;
                });
                event.preventDefault();
            }
            else if(event.which === 27){
                scope.$apply(function (){
                    scope.$eval(attrs.requestEnter);
                    scope.requestContent = '';
                });
            }
        });
    };
});

meovn.directive('clickOutside', function ($document) {
        return {
           restrict: 'A',
           scope: {
               clickOutside: '&'
           },
           link: function (scope, el, attr) {

               $document.on('click', function (e) {
                   if (el !== e.target && !el[0].contains(e.target)) {
                        scope.$apply(function () {
                            scope.$eval(scope.clickOutside);
                        });
                    }
               });
           }
        }

    });

