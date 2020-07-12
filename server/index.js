const express = require('express')
const path = require('path')
const cors = require('cors')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
server.listen(3000)

app.use(express.static(path.join(path.parse(__dirname).dir, '/client', '/dist')))
app.use(cors())

app.get('/', function(req, res){
    res.sendFile(path.join(path.parse(__dirname).dir, '/client', '/dist', 'index.html'))
})

let audioMessages = []
let connections = []

app.get('/voices', function(req, res){
    res.send(audioMessages)
})

io.sockets.on('connection', (socket)=>{
    connections.push(socket)
    socket.broadcast.emit('user', connections.length)
    socket.on('disconnect', data =>{
        socket.broadcast.emit('user', connections.length)
        connections.splice(connections.indexOf(socket), 1)
    })

    socket.on('audioMessage', addNewMsg(socket))
})

function addNewMsg(socket){
    return function (data) {
        audioMessages.push({
            timeStamp: new Date().toString(),
            audioBlob: data
        })
        socket.broadcast.emit('audioMessage', data)
    }
}
   