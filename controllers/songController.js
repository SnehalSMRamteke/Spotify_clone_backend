const bcrypt = require("bcryptjs")
const jwt  = require('jsonwebtoken')
const Songs = require('../models/songModel')
const Playlist = require("../models/playlistModel")
const Favourite = require("../models/favouriteModel")

require('dotenv').config()

 BASEURL = 'http://localhost:7005/uploads/'

const songs = async(req,res)=>{
        try {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const playlistId = req.body?.playlistId;
    const song = req.body?.song;
    //const songImage = req.body?.songImage;
    const artist = req.body?.artist;

    console.log("contro000ler" ,req.user.id ,playlistId , song , artist) 

            if (!playlistId || !song) {
            return res.status(400).send({
                msg: "playlistId and song are required",
                success: false,
            });
            }

   
        const createdBy = req.user.id
        console.log(createdBy)
        const userID = req.user.id;

        const audiofile = req.files?.audiofile
        ? req.files.audiofile[0].filename
        : null;

        const songImage = req.files?.songImage
        ? req.files.songImage[0].filename
        : null;

        console.log(audiofile , "audiofile")

        console.log(songImage , "songImage")

        const newSongs= await Songs.create({ audiofile, playlistId, song , songImage , artist, userID, createdBy })
          await newSongs.save()

        if (!newSongs) {
            res.status(400).send({ msg: "Songs not Added", success: false })
        }
            res.status(200).send({ msg: "Songs added successfully", success: true })

    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: "Server Error" })
    }
}



const songsplayuser = async(req,res)=>{
  try {
    // {playlistId: "697e630243b00685d73a0d3c", songId: "69788be6b2c30318d08f373f"}
    // playlistId:"697e630243b00685d73a0d3c"
    // songId: "69788be6b2c30318d08f373f"

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const playlistId = req.body?.playlistId;
    const songId = req.body?.songId;
    //const songImage = req.body?.songImage;
   // const artist = req.body?.artist;

    console.log("userid" ,req.user.id ) 
    console.log("playlist id " ,playlistId ) 
    console.log("songId id " ,songId ) 

      if (!playlistId || !songId) {
        return res.status(400).send({
            msg: "playlistId and song are required",
            success: false,
        });
      }

          const createdBy = req.user.id
          console.log("user ",createdBy)
          const userID = req.user.id;

          // const audiofile = req.files?.audiofile
          // ? req.files.audiofile[0].filename
          // : null;

          // const songImage = req.files?.songImage
          // ? req.files.songImage[0].filename
          // : null;

          const songdetails = await Songs.findById(songId)

          //console.log(audiofile , "audiofile")
          //console.log(songImage , "songImage")
          console.log(songdetails , "songdetails")
          console.log(songdetails.song , "songdetails")
          const audiofile = songdetails.audiofile;
          const song = songdetails.song;
          const songImage = songdetails.songImage;
          const artist = songdetails.artist;

    const newSongs= await Songs.create({ audiofile, playlistId, song , songImage , artist, userID, createdBy })
    await newSongs.save()

  if (!newSongs) {
      res.status(400).send({ msg: "Songs not Added", success: false })
  }
      res.status(200).send({ msg: "Songs added successfully", success: true })

} catch (error) {
  console.log(error)
  res.status(500).send({ msg: "Server Error" })
}
}



const getSongs = async(req,res)=>{

        try {
    
            //  const songs = await Songs.find() 
            //  console.log("songs ",songs);

            const songs = await Songs.find()
                                .populate("createdBy", "name email")     // 👤 user details
                                .populate("playlistId", "playlist")     // 🎵 playlist name
                                .sort({ createdAt: -1 });

            //songs.audiofile = BASEURL + songs.audiofile

            // const updatedSongs = songs.map((song) => ({
            //                             ...song._doc,
            //                             audiofile: song.audiofile
            //                                 ? BASEURL + song.audiofile
            //                                 : null,
            //                             }));

            const updatedSongs = songs.map(song => ({
                                ...song._doc,
                                audiofile: BASEURL + song.audiofile,
                                songImage: song.songImage
                                    ? BASEURL + song.songImage
                                    : BASEURL + "default-song.jpg",
                                }));
    
            res.status(200).send({ Allsongs: updatedSongs, success: true })
    
        } catch (error) {
            console.log(error)
            res.status(500).send({ msg: "Server Error" })
        }
}


const getSongById = async(req,res)=>{

  //  const PlayID = req.params.ID;
  //  console.log( req.params.ID, "SongID");
   const { id } = req.params; //
   console.log(id, "Playlist ID");

        try {
            
             const songs = await Songs.find({playlistId : id})

             // ✅ Add BASEURL to audiofile
                const updatedSongs = songs.map(song => ({
                ...song._doc,
                audiofile: BASEURL + song.audiofile
                    
                }));
             const playlists = await Playlist.findById(id)
                console.log("playlists" ,playlists.playlist)
                const playlistname = playlists.playlist
             console.log(updatedSongs)

             res.status(200).send({ songbyId: updatedSongs , playlistname:playlistname, success: true })

        } catch (error) {
            console.log(error)
            res.status(500).send({ msg: "Server Error" })
        }

}



const updatesong = async (req, res) => {//(id,{song , artist});
  try {
   const {song , artist} = req.body;
    console.log(req.body)
     console.log("paramsong ",req.params.id)
     createdBy = req.user.id
     console.log(createdBy)

    const updatedPlaylist = await Songs.findOneAndUpdate( { _id: req.params.id},{ song , artist, createdBy: req.user.id},{ new: true } );

    if (!updatedPlaylist) {
      return res.status(404).json({
        success: false,
        msg: "Song not found or unauthorized"
      });
    }

    res.status(200).json({
      success: true,
      msg: "Song updated successfully",
      playlist: updatedPlaylist
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};


const addFavourite = async (req, res) => {
  try {

    const userId = req.user.id;
    const songId = req.params.id; //songid
    console.log(songId , "...." ,userId)

    const fav = await Favourite.create({ userId, songId });
    await fav.save()

    res.status(200).send({ success: true, fav ,msg : "Added to ♥"});

  } catch (err) {
      console.log(err);
    
      return res.json({ success: false, msg: "Already in favourites" });
    
   // res.status(500).json({ success: false, msg: err.message });
  }
};

const favDelete = async (req, res) => {
  try {
    const userId = req.user.id;
    const songId = req.params.id;  //songid

    console.log("&&&&&&&&&&&&&&&",userId , songId);
    

    await Favourite.findOneAndDelete({ userId , _id: songId});

    res.status(200).send({ success: true, msg: "Removed from favourites" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const getMyFavourites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favs = await Favourite.find({ userId })
                                .populate("songId");
    console.log(favs ,"/////");
    

    const updatedfavs = favs.map(song => ({
                                ...song._doc,
                                audiofile: BASEURL + song.songId.audiofile,
                                songImage: song.songId.songImage
                                    ? BASEURL + song.songId.songImage
                                    : BASEURL + "default-song.jpg",
                                }));

                              console.log("updatedfavs-------",updatedfavs);
                              

    res.status(200).send({ success: true, favs :updatedfavs });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};



module.exports = {songs , getSongs , getSongById ,addFavourite , favDelete ,getMyFavourites ,updatesong , songsplayuser}
