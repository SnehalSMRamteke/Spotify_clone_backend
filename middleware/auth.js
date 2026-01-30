const jwt = require('jsonwebtoken')
require('dotenv').config()


function auth(req, res, next) {

    if (!req.headers.authorization) {
        res.status(400).send({msg:"Token Not Found"})
    }

    console.log(req.headers.authorization);

    token = req.headers.authorization

    if (token.startsWith('Bearer')) {           // checks whether bearer is in the start of the token 

        token = token.split(' ')[1]             // splits second half of the token after a " "(space) and return 2nd object
        console.log("👍", token , "after removing bearer");

        decoded = jwt.decode(token, process.env.SECRET_KEY)
        console.log(decoded ,"-----")            // values get from payload during login user

        req.user = decoded
        

        next()
    } else {

        res.status(400).send({ msg: "Auth header Bearer missing", success: false })
    }
}


function user(req , res , next) {

    if (req.user.role == 'User') {
        console.log("USER")
        next()

    } else {
        res.status(400).send({msg : "You  are not Authorized"})
    }
}

function admin(req , res , next) {

    if (req.user.role == 'Admin') {
        console.log("ADMIN")
        next()

    } else {
        res.status(400).send({msg : "You  are not Authorized"})
    }
}


module.exports = { auth  , user , admin}