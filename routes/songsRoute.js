const express = require('express')
const router = express.Router()
const songController  =  require('../controllers/songController')
const {auth} = require('../middleware/auth')
const upload = require('../middleware/multer')



router.post('/songs' , auth, upload.fields([
    { name: "audiofile", maxCount: 1 },
    { name: "songImage", maxCount: 1 } ]),  songController.songs)

router.get('/songs/:id' , songController.getSongById)

router.get('/songs' , songController.getSongs)

router.put('/songs/:id' , auth ,songController.updatesong)


router.post('/favourites/:id' , auth, songController.addFavourite)

router.get('/favourites' , auth ,  songController.getMyFavourites)



// router.get('/getAlbums' , )

// router.get('/getAlbums/:ID' , )

// router.put('/updateSong/:ID' , )

router.delete('/favourites/:id' , auth , songController.favDelete)




module.exports = router