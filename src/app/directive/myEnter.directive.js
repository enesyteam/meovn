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
        });
    };
});