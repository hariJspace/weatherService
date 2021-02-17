const express = require('express')
const path = require('path')
const app = express()
const hbs =  require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const port = process.env.PORT || 3000
const moment = require('moment')


const publicDirectoryPath = path.join(__dirname,'../public')

//Setup static directory  to serve
app.use(express.static(publicDirectoryPath)) //customize your server

//router Weather
app.get('/weather', (req,res) => {
    if(!req.query.zipCode) {
          return res.send({
              error: 'Address is required field'
          })
    }

    if(req.query.zipCode.length < 5 ){
        return res.send({
            error: 'Zipcode should be 5 digits'
        })
    }

    let validZipCode = validateZipCode(req.query.zipCode)
    if(validZipCode){

        geocode(req.query.zipCode, (error,  {latitude,longitude,place_name} = {}) => {
            console.log(latitude,longitude,error)
            if (error){
                res.send({
                    error: 'Please enter a valid MA zipcode'
                })
            }else if (latitude,longitude){
                let geCodeUrl =  'https://api.weather.gov/points/' + encodeURIComponent(latitude) + ',' + encodeURIComponent(longitude)
                forecast(geCodeUrl,(error,{body} ={}) => {
                    console.log("body::::",body)
                      if(error){
                        res.send({
                            error: 'unable to get the forecast'
                        })
                      }else if(body) {
                        res.setHeader('content-type', 'text/plain')
                        res.write('Weather forecast for ' + place_name +' MA,' + ' ' +req.query.zipCode + ':\n\n')
                        body.map((weatherItem,index) => {
                            res.write(weatherItem.name + ',' + ' ' + moment(weatherItem.startTime).format('MM/DD') + ': ' + weatherItem.temperature+' '+weatherItem.temperatureUnit +' ' + weatherItem.windSpeed +' '+weatherItem.windDirection +' '+weatherItem.shortForecast +'\n')          
                        })
                        res.end();
                      }
                })
            }

 })
}else{
    return res.send({
        error: 'Zipcode should be numeric'
    })
}
    
    
})

function validateZipCode(elementValue){
    var zipCodePattern = /^\d{5}$/;
     return zipCodePattern.test(elementValue);
}





app.listen(port , () => {
    console.log('servers is started at ',port)
})

