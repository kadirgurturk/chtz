const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

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


app.use(errorConverter)

app.use(errorHandler)

const setupSocket = require('./services/socket');
setupSocket(server);

app.listen(port, () =>{
    console.log(`Example app listening on port ${port}`)
})
