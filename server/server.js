const http = require('http')
const express = require('express')
const { Server } = require('socket.io')
const initWs = require('./ws')

require('dotenv').config()

const port = process.env.WS_PORT || 3000
const app = express()
const server = http.createServer(app)

const ws = new Server(server, {
  cors: { origin: process.env.CLIENT_DOMAIN },
})

server.listen(port, '0.0.0.0', () => {
  console.log(`WS server running on ws://0.0.0.0:${port}`)
})

initWs(ws)
