
const express = require('express')
require('dotenv').config()

const connectDB = require('./config/db')

const userRoute = require('./routes/userRoute')
const playlistRoute = require('./routes/playlistRoute')
const songRoute = require('./routes/songsRoute')


const cors = require('cors')
const app = express()
const path = require('path')

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 7000

app.use('/api/user' , userRoute)
app.use('/api/play' , playlistRoute)
app.use('/api/song' , songRoute)


app.use('/uploads', express.static(path.join(__dirname , 'uploads')))

app.get('/' , (req, res) => res.send("Hello World!"))

app.listen(port, ()=> {
    console.log(`Server is running on http://localhost:${port}`)
})
