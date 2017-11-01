meovn.service('supportService', ["$firebaseArray", "$filter", function ($firebaseArray, $filter) { 
	var ref = firebase.database().ref();

	var getRequestItemsForOrder = function(order){
		var requests = [];
		// console.log(order.id);
		ref.child('requests').orderByChild('order_id').once('value', function(snapshot){
			// console.log(snapshot.val());
			angular.forEach(snapshot.val(), function(value, key){
				requests.push(value);
				// console.log(value);
			});
		 	// return res;
		 });
		return requests;
	}

	// return
	return {
		getRequestItemsForOrder : getRequestItemsForOrder,
	}
}]);




