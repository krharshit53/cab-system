const mongoose=require('mongoose')
 require('mongoose-double')(mongoose)

 

let driverSchema=new mongoose.Schema(
    {
        
        id:{type:Number,default:0,unique:true},
        name: {type:String,required:true,unique:true},
        email: {type:String,required:true,unique:true},
        phone_number: {type:Number,required:true,unique:true},
        license_number: {type:String,required:true,unique:true},
        car_number:{type:String,required:true,unique:true},
        
    }
)
module.exports = mongoose.model("Driver", driverSchema);