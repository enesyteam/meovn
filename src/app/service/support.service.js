meovn.service('supportService', ["$firebaseArray", "$filter", function ($firebaseArray, $filter) { 
	var ref = firebase.database().ref();

	var getRequestItemsForUser = function(uid){
		var requests = [];
		// console.log(order.id);
		ref.child('requests').orderByChild('fromSeller').equalTo(uid).once('value', function(snapshot){
			// console.log(snapshot.val());
			angular.forEach(snapshot.val(), function(value, key){
				requests.push(value);
				// console.log(value);
			});
		 	// return res;
		 });
		return requests;
	}

	// create new request
	var submitRequest = function(r){
		 var re = ref.child('requests');
		 re.push(r);
	};

	var getNewRequestId = function(){
		return ref.child('requests').push().key;
	}

	// return
	return {
		getRequestItemsForUser : getRequestItemsForUser,
		getNewRequestId : getNewRequestId,
		submitRequest : submitRequest,
	}
}]);




