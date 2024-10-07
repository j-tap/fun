const fs = require('fs')
const http = require('http')
const https = require('https')
const express = require('express')
const { Server } = require('socket.io')
const initWs = require('./ws')

require('dotenv').config()

const port = process.env.WS_PORT
const app = express()
let server

if (process.env.NODE_ENV === 'production') {
  const sslOptions = {
    key: fs.readFileSync(process.env.SSL_PATH_KEY),
    cert: fs.readFileSync(process.env.SSL_PATH_CERT),
  }
  server = https.createServer(sslOptions, app)
  console.log(`Используем HTTPS на wss://localhost:${port}`)
}
else {
  server = http.createServer(app)
  console.log(`Используем HTTP на ws://localhost:${port}`)
}

const ws = new Server(server, {
  cors: { origin: '*' },
})

server.listen(port, () => {
  console.log(`Сервер WS запущен на порту ${port}`);
})

initWs(ws)