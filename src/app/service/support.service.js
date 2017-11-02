meovn.service('supportService', ["$firebaseArray", "$filter", function ($firebaseArray, $filter) { 
	var ref = firebase.database().ref();

	var getRequestItemsForUser = function(uid){
		var requests = [];
		// console.log(order.id);
		ref.child('requests').orderByChild('fromSeller')
		.equalTo(uid)
		.once('value', function(snapshot){
			// console.log(snapshot.val());
			angular.forEach(snapshot.val(), function(value, key){
				requests.push(value);
				// console.log(value);
			});
		 	// return res;
		 });
		return requests;
	}
	var getUserRequests = function(uid){
        var endTime = new Date(); // today
        var startTime = new Date(); // yesterday
        startTime.setDate(startTime.getDate() - 1);
        endTime.setDate(endTime.getDate());
        console.log('get orders from: ' + startTime + ' to ' + endTime);
        startTime = startTime.getTime();
        endTime = endTime.getTime();
        var res = [];

        ref.child('requests')
		.orderByChild('fromSeller')
		.equalTo(uid)
        .once('value', function(snap) {
           // console.log(startTime);
           snap.forEach(function(item){
           		// console.log(item.val().created_at);
           		if(item.val().created_at > startTime){
					res.push(item.val());
           		}
                
           });
           
        });
        return res;
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
		getUserRequests : getUserRequests,
	}
}]);




