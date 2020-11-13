const mongoose=require('mongoose')
 require('mongoose-double')(mongoose)

 let SchemaTypes = mongoose.Schema.Types;
let locationSchema=new mongoose.Schema(
    {
        id:{type: Number,
         ref: "Driver"},
        latitude:{type:SchemaTypes.Double},
        longitude:{type:SchemaTypes.Double},
        
        
    }
)
module.exports = mongoose.model("Location", locationSchema);