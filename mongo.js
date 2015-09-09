// MongoDB


var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
// Connection URL
var url = 'mongodb://localhost:27017/shieldy';

exports.constrain_get = function( uuid, name , callback ) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to server");
	
	  	var collection = db.collection('vms');
	
		collection.findOne( {token:uuid} , function(err, item) {
      			assert.equal(null, err);
      			db.close();
			var find=false;
			item.constrains.forEach(function(entry) {
				if (entry[name]!=undefined){
					callback(entry);
					find=true;
				}	
			});
			if (find==false)
   				callback({});
    		});
  
	});
}

exports.constrains_get = function( uuid,name , callback ) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to server");
	
	  	var collection = db.collection('vms');
	  	collection.findOne({token:uuid}, function(err, item) {
      		assert.equal(null, err);
      		db.close();
   			callback(item.constrains);
    	});
  
	});
}


exports.metrics_get = function( uuid, callback ) {
        MongoClient.connect(url, function(err, db) {
                assert.equal(null, err);
                console.log("Connected correctly to server");
		console.log(uuid);
                var collection = db.collection('vms');
                collection.findOne({token:uuid}, function(err, item) {
                assert.equal(null, err);
                db.close();
                callback(item.metrics);
        });

        });
}




exports.resources_insert = function( uuid,data , callback ) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to server");

			
	  	var collection = db.collection(uuid);
  		// Insert some resources
  		collection.insert([
  			  data
  		], function(err, result) {
    			console.log("error:"+err);
			console.log("Inserted: "+data);

			var collection = db.collection('vms');
			collection.findOne({token:uuid}, function(err, item) {
				console.log("update1: "+JSON.stringify(item));
				for(var key in data) {
					if (key!="_id" && key!="date" && item.metrics.indexOf(key)==-1)
						item.metrics.push(key);
				}
				console.log("update2: "+JSON.stringify(item));	
				/*collection.update(item,item,function(err,item){
					console.log("update: "+err+"-"+item);
					callback(result);
				});*/
				collection.updateOne({"_id":item._id},item,function(err,item){
                                        console.log("update: "+err+"-"+item);
                                        callback(result);
                                }); 
			});

  		});
  
	});
}



exports.resources_get = function( uuid,data , callback ) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to server");
	  	var collection = db.collection(uuid);
	  	collection.find({}).toArray(function(err, items) {
        	assert.equal(null, err);
        	db.close();
   			callback(items);
      	});
  
	});
}

exports.resource_get = function( uuid, resource_name , callback ) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to server");
	
	  	var collection = db.collection(uuid);
  		var first={};
  		first[resource_name.toString()]={ "$gt" : 0 };
  		var second={};
  		second["date"]=1;
  		second[resource_name.toString()]=1;
  		collection.find(first,second).toArray(function(err, items) {
        	assert.equal(null, err);
        	db.close();
   			callback(items);
      	});
	});
}

exports.uuids_get = function(  callback ) {
        MongoClient.connect(url, function(err, db) {
                assert.equal(null, err);
                console.log("Connected correctly to server");

                var collection = db.collection("vms");
                collection.find({},{'token':1}).toArray(function(err, items) {
                assert.equal(null, err);
                db.close();
                        callback(items);
        });
        });
}



exports.resource_get_stats = function( uuid,name , callback ) {
        MongoClient.connect(url, function(err, db) {
                assert.equal(null, err);
                console.log("Connected correctly to server");

                var collection = db.collection(uuid);
                //var first={};
                //first[resource_name.toString()]={ "$exists" : true };
                //var second={};
                //second["date"]=1;
                //second[resource_name.toString()]=1;
	        //collection.find({"min":{$min:"$cpu"}}).toArray(function(err, items) {
//{$group: {'_id':"cpu","min":{$min:"$cpu"},"max":{$max:"$cpu"},"avg":{$avg:"$cpu"} }}

		var fname="$"+name;	
		var first={$match: { name: {$exists:true} }};
		
		var first={};
		first['$match']={};
		first['$match'][name]={};
		first['$match'][name]['$exists']=true;

		var second={$group: {"_id": name ,"min":{$min:fname},"max":{$max:fname},"avg":{$avg:fname},"last":{$last:fname} }};

		var obj= [ first,second];

		collection.aggregate ( obj  ).toArray(function(err, items) {
                	assert.equal(null, err);
                	db.close();
                        callback(items);
        	});
        });

}
