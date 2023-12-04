

const axios = require('axios');
const { request, response } = require('express');
var express = require('express');
var app = express();
const API = '1WJx2Eibp_Vdi3hEcT202uCPPyi588uLuN3NRWl10CW-5aRpbs8kVXYWlGMMQH0RtbP6B-BAOHLW_JPKsuVRIvOy5G_X-tYl5-qtJpS3VEegoMvbsumRoOTsdZwzY3Yx';

// app.use(express.static(path.join(__dirname,'/dist/frontend')));

app.get('/', (req,res) => {
    // res.sendFile(path.join(__dirname,'/dist/frontend/index.html'));
    // console.log(path.join(__dirname,'/dist/frontend/index.html'));
  });

app.get('/getautocomplete', function(req, res){
    // console.log(req.query);
    let {Keyword} = req.query;
    let url = `https://api.yelp.com/v3/autocomplete?text=${Keyword}`;
    axios.get(url, {
        headers: {
            Authorization: `Bearer ${API}`
            }
            }).then((response) => {
                return res.json(response.data);
            }).catch((error) => {
                return res.json(error);
            })
} )

app.get('/fetchsecondtabledata', (req,res)=>{
    // console.log(req.query);
    let {term,radius,categories,latitude,longitude} = req.query;
    
    radius = String(Number((Number)(radius)*1609));
    // console.log(radius);
    // console.log(term,radius,categories,latitude,longitude);
    let url = `https://api.yelp.com/v3/businesses/search?term=${term}&latitude=${latitude}&longitude=${longitude}&categories=${categories}&radius=${radius}&limit=10`;
    // console.log(url);

    axios.get(url, {
        headers: {
            Authorization: `Bearer ${API}`
            }
            }).then((response) => {
                console.log(response.data.businesses);
                return res.json(response.data);
            }).catch((error) => {
                return res.json(error);
            })
})

app.get('/getcarddata', (req,res)=>{
    // console.log(req.query);
    let {id} = req.query;
    let url = `https://api.yelp.com/v3/businesses/${id}`;
    console.log(url);
    axios.get(url, {
        headers: {
            Authorization: `Bearer ${API}`
            }
            }).then((response) => {
                // console.log(response.data);
                return res.json(response.data);
            }).catch((error) => {
                return res.json(error);
            })
})

app.get('/getreviews',(req,res)=>{
    
    let {id} = req.query;
    let url = `https://api.yelp.com/v3/businesses/${id}/reviews`;
    console.log(url);
    axios.get(url, {
        headers: {
            Authorization: `Bearer ${API}`
            }
            }).then((response) => {
                // console.log(response.data);
                return res.json(response.data);
            }).catch((error) => {
                return res.json(error);
            })
})
    
app.listen(8080, function(req, res) {
    console.log("Backend Application listening at http://localhost:8080"); 
})