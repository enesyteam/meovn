meovnSearch.directive('myEnter', function () {
    return function (scope, element, attrs) {

        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                    // scope.submitComment(scope.selectedOrder);
                    scope.searchOrder(event);
                });
                event.preventDefault();
            }
            else if(event.which === 27){
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                    // scope.clearCommentData();
                });
            }
        });
    };
});