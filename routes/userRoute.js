const express = require('express')
const router = express.Router()

const {auth} = require('../middleware/auth')
const upload = require('../middleware/multer')

const userController = require('../controllers/userController')


 router.post('/register' , upload.single('imagePath') , userController.register)

 router.post('/login' , userController.login)

 router.get('/getUserInfo' , auth , userController.getUserInfo)

 router.get('/userList' , auth , userController.userList)

 router.put('/updateUser/:ID' , auth , upload.single('imagePath') , userController.updateUser)


// router.delete('/delete/:ID' , )


module.exports = router








// const express = require('express')

// const userController = require('../controllers/userController')
// const {auth} = require('../middleware/auth')
// const upload = require('../middleware/multer')
// const router = express.Router()


//      router.post('/register' ,upload.single('imagePath') , userController.register)

