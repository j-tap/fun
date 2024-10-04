const WebSocket = require('ws')

const server = new WebSocket.Server({ port: 8088 })
const clients = new Map()

server.on('connection', (ws) => {
  console.info('Новый клиент подключился')

  ws.send('сервер принял подключение')

  ws.on('message', (json) => {
    const data = JSON.parse(json)
    let client = clients.get(ws)

    if (!client) {
      clients.set(ws, data)
      client = data
    }

    const playersInGame = Array.from(clients.values())
      .filter(player => player.game === client.game)

    if (client.admin) {
      ws.send(JSON.stringify(playersInGame))
    }
    else {
      const adminsInGame = Array.from(clients.entries())
        .filter(([_, clientData]) => clientData.admin && clientData.game === client.game)

      adminsInGame.forEach(([adminWs, _]) => {
        adminWs.send(JSON.stringify(playersInGame))
      })

      const msg = `Игра: ${client.game}, токен: ${client.token}`
      ws.send(msg)
    }

    console.log(`Получено от клиента: ${JSON.stringify(data)}`)
  })

  ws.on('close', () => {
    const client = clients.get(ws)

    if (client) {
      console.info(`Клиент отключился: Игра: ${client.game}, Токен: ${client.token}`)
      clients.delete(ws)
    } else {
      console.error('Не удалось найти информацию о клиенте')
    }
  })
})

console.info('Сервер WebSocket запущен на ws://localhost:8088')
