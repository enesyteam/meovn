meovn.directive('myEnter', function () {
    return function (scope, element, attrs) {

        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                    scope.submitComment(scope.selectedOrder);
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

meovn.directive('clickAnywhereButHere', ['$document', function ($document) {
    return {
        link: function postLink(scope, element, attrs) {
            var onClick = function (event) {
                var isChild = $(element).has(event.target).length > 0;
                var isSelf = element[0] == event.target;
                var isInside = isChild || isSelf;
                if (!isInside) {
                    scope.$apply(attrs.clickAnywhereButHere);
                }
            }
            scope.$watch(attrs.isActive, function(newValue, oldValue) {
                if (newValue !== oldValue && newValue == true) {
                    $document.bind('click', onClick);
                }
                else if (newValue !== oldValue && newValue == false) {
                    $document.unbind('click', onClick);
                }
            });
        }
    };
}]);

