
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

        name : {type : String , required :true},
        email : {type : String , required :true , unique : true},
        password : {type : String , required :true},
        contactNumber : {type : String , required :true},
        address : {type : String , required :true},
        imagePath : {type : String},
        member : {type : String ,
            enum : ['No' , 'Yes'],
            default : 'No'
        },
        role : {
            type : String , 
            enum : ['User' , 'Admin'],
            default : 'User'
        }
}
,{
        timestamps : true
})

module.exports  = mongoose.model('user', userSchema)