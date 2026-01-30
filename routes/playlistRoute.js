const express = require('express')
const router = express.Router()
const {auth} = require('../middleware/auth')
const upload = require('../middleware/multer')


const playlistController = require('../controllers/playlistController')


router.post('/createPlaylist' ,auth , upload.single("playlistcover"),  playlistController.createPlaylist)

router.get('/playlists' , playlistController.playlists)

router.put('/playlists/:id', auth, playlistController.updatePlaylist);

// router.delete('/playlists/:ID' , )

// router.post('/admin/upload' , )

// router.delete('/admin/songs/:ID' , )




//router.post('/api/users/favorites' , )




module.exports = router


// post /api/playlists
// get /api/playlists
// get /api/playlists/:id/add-song
// delete /api/playlists/:id
// post /api/users/favorites   // XX add to users <3 list


// post /api/admin/upload      (multer)
// delete /api/admin/songs/:id
