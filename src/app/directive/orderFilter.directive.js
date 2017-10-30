meovn.filter('my_filter', function () {
  return function (items, scope) {
    return items.filter(function (item) {
    	console.log('filtering...');
    	// search
    	if(scope.searchText.length > 0){
    		return item.buyer_mobile.indexOf(scope.searchText) !== -1 || item.buyer_name.toUpperCase().indexOf(scope.searchText.toUpperCase()) !== -1;
    	}
    	// we need to filter orders by created_date
    	// since we only want to show orders that created_at today or yesterday
    	var today = Date.now();
    	var yesterday = Date.now()-1;

    	if(scope.showMyOrders && scope.activeStatus){
    		return (item.seller_will_call_id == scope.currentMember.id) 
    				&& (item.status_id == scope.activeStatus.id);

    	}
    	else if(scope.activeStatus){
    		return item.status_id == scope.activeStatus.id;
    	}
    	else if(scope.showMyOrders){
    		return item.seller_will_call_id == scope.currentMember.id;
    	}
    	else{
    		return item.created_at <= Date.now();
    	}
    });
  };
});