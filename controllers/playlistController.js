const bcrypt = require("bcryptjs")
const jwt  = require('jsonwebtoken')

const Playlist = require('../models/playlistModel')

require('dotenv').config()
BASEURL = 'http://localhost:7005/uploads/'

const createPlaylist = async(req,res)=>{
        try {
        const { playlist } = req.body
    
        console.log("contro000ler" ,req.user.id ,playlist)
   
        createdBy = req.user.id
        const userID = req.user.id;
        console.log(createdBy)

        playlistcover = req.file ? req.file.filename  :  null
        console.log(playlistcover , "playlistcover")

        const newPlaylist= await Playlist.create({ playlist, playlistcover, userID, createdBy })
          await newPlaylist.save()

        if (!newPlaylist) {
            res.status(400).send({ msg: "Playlist not created", success: false })
        }
            res.status(200).send({ msg: "Playlist created successfully", success: true })

    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: "Server Error" })
    }
}


const playlists = async(req,res)=>{
        try {

         //const plays = await Playlist.find() 

         const plays = await Playlist.find()
                                    .populate("createdBy", "name email") // 🔥 fetch user name
                                    .populate("updatedBy", "name")
                                    .sort({ createdAt: -1 });
         console.log("plays ",plays);

                        // ✅ Add BASEURL to playlistcover
                        const updatedPlays = plays.map(play => ({
                        ...play._doc,
                        playlistcover: play.playlistcover
                            ? BASEURL + play.playlistcover
                            : BASEURL + "default-playlist.jpg",
                        }));

//   const plays = req.user.role === "admin"
//   ? await Playlist.find().populate("createdBy", "name")
//   : await Playlist.find({ createdBy: req.user.id }).populate("createdBy", "name");


        res.status(200).send({ Allplays: updatedPlays, success: true })

    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: "Server Error" })
    }
}



const updatePlaylist = async (req, res) => {
  try {
   const { playlist } = req.body;
    console.log(req.body)
     console.log("paramsong ",req.params.id)
     createdBy = req.user.id
     consol.log(createdBy)

    const updatedPlaylist = await Playlist.findOneAndUpdate( { _id: req.params.id},{ playlist , createdBy: req.user.id},{ new: true } );

    if (!updatedPlaylist) {
      return res.status(404).json({
        success: false,
        msg: "Playlist not found or unauthorized"
      });
    }

    res.status(200).json({
      success: true,
      msg: "Playlist updated successfully",
      playlist: updatedPlaylist
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};



module.exports = {createPlaylist , playlists ,updatePlaylist}