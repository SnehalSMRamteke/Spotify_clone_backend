const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema({
    userID:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    playlist:{type:String,required:true},
    playlistcover:  {type : String},
    createdBy:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    updatedBy:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
},{
    timestamps:true
})



module.exports = mongoose.model('playlist', playlistSchema)
