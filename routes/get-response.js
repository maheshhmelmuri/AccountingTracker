/**
 * Created by mahesh.melmuri on 17/10/16.
 */

var request = require('request');
request('http://www.google.com', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body) // Print the google web page.
    }
})

module.exports = request;
