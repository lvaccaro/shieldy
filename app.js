var restify = require('restify');
var mongo=require('./mongo.js');
var gcm=require('./notification_topic.js');
var cors = require('cors');

var add_resource = function (req, res, next) {
	var query = {};
	query [req.params.name]= parseInt(require('url').parse(req.url,true).query.value) ;
	query.date=new Date();
	console.log("add_single_resource: "+JSON.stringify(query));
	mongo.resources_insert(req.params.uuid,JSON.parse(JSON.stringify(query)) , function(data){
		console.log(data);
		// check constrains
		check_constrains (req.params.uuid,req.params.name,parseInt(require('url').parse(req.url,true).query.value), function(data){	
			console.log(data);
			res.json(200, {'violated': data});
	  		next();
		});
	
  	});
}

var add_resources=function (req, res, next) {
	var query = require('url').parse(req.url,true).query;
	var array= {};
	Object.keys(query).forEach(function (key) {
   		// do something with obj[key]
   		console.log("{"+key+":"+query[key]+"},");
   		array[key]=parseInt(query[key]);
	});
	array["date"]=new Date();
	console.log("add_multi_resources: "+JSON.stringify(array));
	mongo.resources_insert(req.params.uuid,JSON.parse(JSON.stringify(array)));
	res.json(200, {});
  	next();
}

var get_resources=function (req, res, next) {
	console.log("get_resources: ");
	mongo.resources_get(req.params.uuid,req.params.name, function(data){
		console.log(JSON.stringify(data));
		res.json(200, data);
  		next();
	});
}


var get_resource_stats=function (req, res, next) {
	console.log("uuid: "+req.params.uuid+" get_resource_last: "+req.params.name);
	mongo.resource_get_stats(req.params.uuid,req.params.name, function(data){
		console.log(JSON.stringify(data));
		res.json(200, data);
  		next();
	});
}


var get_resource=function (req, res, next) {
	console.log("get_resource: "+req.params.name);
	mongo.resource_get(req.params.uuid,req.params.name, function(data){
		console.log(JSON.stringify(data));
		res.json(200, data);
  		next();
	});
}

var get_constrain=function (req, res, next) {
	console.log("get_constrain: "+req.params.name);
	mongo.constrain_get(req.params.uuid,req.params.name, function(data){
		console.log(JSON.stringify(data));
		res.json(200, data);
		next();
	});
}
var get_constrains=function (req, res, next) {
	console.log("get_constrains: ");
	mongo.constrains_get(req.params.uuid,req.params.name, function(data){
		console.log(JSON.stringify(data));
		res.json(200, data);
  		next();
	});
}


var check_constrains = function (uuid,name, value, next){
	console.log("check_constrains");
	mongo.constrain_get(uuid,name, function(data){
		if (data[name]>value){
			gcm.send(data.token,data.name,"Alert resource "+name+" = "+value);
			next(false);
		}else
  			next(true);
	});
}
var get_metrics=function (req, res, next) {
        console.log("get_metrics: "+req.params.uuid);
        mongo.metrics_get(req.params.uuid, function(data){
                console.log(JSON.stringify(data));
                res.json(200, data);
                next();
        });
}

var get_uuids=function (req, res, next) {
        mongo.uuids_get( function(data){
                console.log(JSON.stringify(data));
                res.json(200, data);
                next();
        });
}



var server = restify.createServer();
server.use( cors())
server.put('/:uuid/data/:name', add_resource);
server.put('/:uuid/data', add_resources);

server.get('/:uuid/data', get_resources);
server.get('/:uuid/data/:name', get_resource);

server.get('/:uuid/stats/:name', get_resource_stats);
server.get('/:uuid/metrics',get_metrics)
server.get('/:uuid/constrains/:name', get_constrain);
server.get('/:uuid/constrains', get_constrains);
server.get('/', get_uuids);



// GCM notification
//var gcm=require('./notification_topic.js');
//gcm.gcm();

 
 
// SERVER LISTENING 
server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
