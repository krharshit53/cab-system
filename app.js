const express=require('express')
const app=express();
const bodyParser=require('body-parser')
const Driver=require('./Models/index')
const Location=require('./Models/location')
let mongoose = require('mongoose')
    
 
 mongoose.connect(process.env.MONGODB_URI ||'mongodb://127.0.0.1:27017/cabSystem', {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
let cnt=0;

app.post('/api/v1/driver/register/',(req,res)=>
{
    Driver.find({$or:[{email: req.body.email},{phone_number:req.body.phone_number},{license_number:req.body.license_number},{car_number:req.body.car_no}]}, 
        (err, value)=> 
 {
    if (value.length>0)
    {
        
        return res.status(400).json(
            {
                "status": "error",
                "reason": "duplicate value"
            } 
         )
    }
    if(req.body.phone_number.length!=10)
    {
        return res.status(400).json(
            {
                "status": "error",
                "reason": "phone number must be of 10 digit"
            } 
         )
    }

    

 
    var newdriver = new Driver({id:++cnt, name: req.body.name, email: req.body.email, phone_number: req.body.phone_number,license_number:req.body.license_number,car_number:req.body.car_no});
    Driver.create(newdriver, function (err, data) {
        if (err) {
             res.status(400).json(
                {
                    "status": "failure",
                    "reason": err
                } 
             )
        }
        else {
            res.status(201).json(
                {
                    "id": data.id,                   
                    "name": data.name,
                    "email": data.email,
                    "phone_number":data.phone_number,
                   "license_number": data.license_number,
                    "car_number":  data.car_number
                }
            );
            }
        })
    });
})

app.post('/api/v1/driver/:id/sendLocation/',(req,res)=>
{
      if(!req.body.latitude||!req.body.longitude)
      {
        res.status(400).json({ 
            "status": "failure",
            "reason": "longitude or latitude is null"
        })
      }
    Location.create({id:req.params.id,latitude:req.body.latitude,longitude:req.body.longitude},(err,data1)=>
    {
            if(err)
            {
                res.status(400).json({ 
                    "status": "failure",
                    "reason": err
                })
            }
            else
            {
                res.status(202).json({"status": "success"})
            }
    })
    
})
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }
app.post('/api/v1/passenger/available_cabs/',(req,res)=>
{
     let lat=req.body.latitude
     let long=req.body.longitude
     let map=[]
     Location.find({}, function(err, locations) {
        
       if(err)
       {
        res.status(400).json(
            {
                "status": "failure",
                "reason": err
            }
        )
       }
       else
       {
        
        locations.forEach(function(location) {
           if(getDistanceFromLatLonInKm(lat,long,location.latitude.value,location.longitude.value)<=4)
           {
               map.push(location.id)
           }
           
           
        })
        if(map.length>=1)
        {
        Driver.find(
            {
                id:{$in:map}},(err,data)=>
                {
                    if(err)
                    {
                        res.status(400).json(
                            {
                                "status": "failure",
                                "reason": err
                            }
                        )
                    }
                    else
                    {
                        let ans=[];
                        for(let i=0;i<data.length;i++)
                        {
                            let res={};
                            res.name=data[i].name,
                            res.car_number=data[i].car_number,
                            res.phone_number=data[i].phone_number
                            ans.push(res)
                        }
                        res.status(200).json(
                            {
                                "available_cabs":ans
                            }
                        )
                    }
                }
            
        )
            }

       else 
       {
             res.status(200).json(
                 {
                    "message": "No cabs available!"
                 }
             )
       }

      
       }
    
          
      });
})


app.listen(8080,()=>
{
    console.log(`http://localhost:${8080}`)
})