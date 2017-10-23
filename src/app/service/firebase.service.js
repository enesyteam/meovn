meovn.service('firebaseService', ["$firebaseArray", "$filter", function ($firebaseArray, $filter) { 

	var ref = firebase.database().ref();
    ordersArr = $firebaseArray(ref.child('orders'));
    commentsArr = $firebaseArray(ref.child('comments'));
    sourcesArr = $firebaseArray(ref.child('sources'));
    statusesArr = $firebaseArray(ref.child('statuses'));
    sellersArr = $firebaseArray(ref.child('members'));
    packsArr = $firebaseArray(ref.child('packs'));

    var getAllOrders = function(){
		return ordersArr.$loaded();
	};
    var getAllSources = function(){
		return sourcesArr.$loaded();
	};
	var getAllPacks = function(){
		return packsArr.$loaded();
	};

	var getOrder = function(id){
		return ordersArr.$getRecord(id);
	}

	var updateOrder = function(order){
		return ordersArr.$save(order);
	};

	var init = function(){
		getAllOrders();
		getAllSources();
		getAllPacks();
	};

	return{
		init			: init,
		getAllOrders    : getAllOrders,
		getOrder    	: getOrder,
		updateOrder		: updateOrder,
		getAllSources	: getAllSources,
		getAllPacks		: getAllPacks,
	}

}]);