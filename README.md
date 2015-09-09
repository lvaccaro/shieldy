# Shieldy #
High-performance real-time monitoring and tracking remote systems.

### Ready to start ###
1. Assign a uuid to each system to monitor.
2. Upload the current value of resources  
2. Set your constrain on resources and your contacts.
3. The system contact you with email or push notification. 


### Interface ###
* `GET /`   
Return the uuids assigned to the remote system    
ex. [{"xxx"},{"yyy"},{"zzz"}]
* `GET /:uuid/data`    
Return all the data of all resources of a single system    
ex. [{_id:"12456789", date:"datetime", cpu:70 },{_id:"987654321", date:"datetime", mem:70 }]    
* `GET /:uuid/data/:resource`    
Return all the data of a single resource     
ex. [{_id:"12456789", date:"datetime", cpu:40 },{_id:"555555555", date:"datetime", cpu:70 }]    
* `GET /:uuid/metrics`    
Return all the key metrics uploaded of a system     
ex. [{"cpu"}, {"mem"}, {"hdtemp"}]    
* `GET /:uuid/stats/:resource`    
Return the statistics for a single resource     
ex. [{"_id":"cpu"},{"min":10}, {"max":90}, {"avg":50}, {"last":70}]    
* `GET /:uuid/constrains`    
Return all the constrains of each resources     
ex. [{"cpu":"99"} , {"mem":"90"}]    
* `GET /:uuid/constrains/:resource`    
Return the constrain of a single resource     
ex. [{"cpu":"99"}]    
* `PUT /:uuid/data/:resource?value=***`    
Insert new value of a resource    
ex. /:uuid/data/cpu?value=70    
* `PUT /:uuid/data/`    
Insert more values for more resource    
params: [{"cpu":70},{"mem":50}]    

### Run ###
`node app.js`

### Server Configuration ###
- mongodb
- server port : 8080

### License ###
##### GPL2 #####


