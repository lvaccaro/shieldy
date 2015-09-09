var request = require('request');

exports.send = function(token,vm_name,message) {
request({
        method: 'POST',
        uri : 'https://gcm-http.googleapis.com/gcm/send',
        headers: {
            'Content-Type': 'application/json',
            'Authorization':'key=AIzaSyCdAPmgmugiahoOIBRQUEIa3WVnHXUU7sY'
        },
        body : JSON.stringify({
            "to" : "/topics/global",
            "data" : {
                "message" : message,
                "messageFrom" : vm_name             
            },

        })
    }, function(error, response, body){
        if(error){
            return console.error('message not sent!', error);
        }
        console.log(body);
        res.send({"sent" : "true"});
    });
}
