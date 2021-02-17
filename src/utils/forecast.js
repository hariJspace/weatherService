
const request = require('request')
const express = require("express");
const app = express(); 

const forecast = (url, callback) => {
   const options = {
    url: url,
    headers: {'User-Agent': 'foo'},
    json:true
  };

    request(options, function (error, response, body) {
        if (error) {
            callback('Unable to connect to weather App')
        }else if (body && body.properties && body.properties.forecast) {
           let forcastUrl = body.properties.forecast
            const options1 = {
                url: forcastUrl,
                headers: {'User-Agent': 'foo'},
                json:true
              };
            request(options1, function (error, response, body) {
                if (error) {
                callback('Unable to connect to weather App')
                }else if(body && body.properties && body.properties.periods)  {
                    callback(null,{
                        body  : body.properties.periods
                  })
                }
            })

        }
    });
      
}

module.exports = forecast