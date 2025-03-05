const express = require('express');
const app = express();
require('dotenv').config()
const checktJwt = require('./middlewares/jwt')
const port = process.env._PORT
const { errorHandler, errorConverter } = require('./middlewares/error')

const connectDB = require('./config/mongoDb')


connectDB()

app.use(express.json())

app.use('/api/user', require('./routes/user.route'))

//Jwt check
app.use(checktJwt.checkAuthenticate)

app.use('/api/welcome', require('./routes/welcome/welcome.route'))
app.use('/api/conversation', require('./routes/conversation.router'))
app.get('/', (req, res) => {
    res.send('Hello World!')
})





//Error Keepers
app.use(errorConverter)

app.use(errorHandler)


app.listen(port, () =>{
    console.log(`Example app listening on port ${port}`)
})
