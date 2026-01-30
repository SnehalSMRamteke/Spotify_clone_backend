const mongoose = require('mongoose')

const songSchema = new mongoose.Schema({
    userID:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    playlistId:{type:mongoose.Schema.Types.ObjectId,ref:'playlist'},
    song:{type:String,required:true},
    artist:{type:String,required:true},
    audiofile : {type : String},
    songImage: { type: String }, 
    createdBy:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    updatedBy:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
},{
    timestamps:true
})



module.exports = mongoose.model('song', songSchema)
