const mongoose = require("mongoose");
const DoctorSchema = mongoose.Schema({
    firstName:{
        type : String , 
        require : [ true , "please add your name"],
    },
    lastName:{
        type : String , 
        require : [ true , "please add your last name"],
    },
    email:{
        type : String , 
        require : [ true , "please add your last name"],
    },
    speciality:{
        type : String , 
        require : [ true , "please add your speciality"],
    },
    experince:{
        type : String , 
        require : [ true , "please add your experince"],
    },
    phoneNumber:{
        type : Number , 
        require : [ true , "please add your phone number"],
    },
    address:{
        type : String,
        require : [ true , "please add your address"],
    }
},
{
    timestamps : true ,
});
module.exports = mongoose.model("Doctor" , DoctorSchema);