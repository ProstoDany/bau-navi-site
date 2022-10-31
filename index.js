const express = require('express')
const { Socket } = require('socket.io')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

server.listen(3000)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
//devdddd
users = []
connections = []

io.on('connection', (socket) => {
    console.log("Success connection")
    console.log("Test git1111")
    connections.push(socket)

    socket.on('disconnect', (data) => {
        console.log("disconnection")
        connections.splice(connections.indexOf(socket), 1)
    })

    socket.on('send_msg', (data) => {
        console.log(data)
         
        io.emit('recive_msg', {msg: data})
    })
})