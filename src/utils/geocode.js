const request = require('request')
const path = require('path')
const fs = require('fs');
const _ = require('lodash');
const publicDirectoryPath = path.join(__dirname,'../json')


const geocode = (address, callback) => {   

    let bene = JSON.parse(fs.readFileSync(publicDirectoryPath + '/zipcode.json', 'utf-8'))
  
    let zipCodeobj = _.find(bene, function(o) { return o.fields.zip ==  address; });
    if(!zipCodeobj){
        callback('Please enter a valid Massachusets Zipcode')
    }else{
        callback(null,{
            latitude:zipCodeobj.fields.latitude,
            longitude:zipCodeobj.fields.longitude,
            place_name:zipCodeobj.fields.city
        })
    }   
}

module.exports = geocode
