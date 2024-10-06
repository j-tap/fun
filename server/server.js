const WebSocket = require('ws')

const server = new WebSocket.Server({ port: 8088 })
const clients = new Map()

server.on('connection', (ws) => {
  console.info('Новый клиент подключился')

  // Обработка при подключении
  ws.on('message', (json) => {
    const data = JSON.parse(json)
    let client = clients.get(ws)
    let adminGameWs = getAdmin(data?.game)
    let adminGame = clients.get(adminGameWs)

    console.log(`Получено от клиента: ${JSON.stringify(data)}`)
    /* проверка клиента на соответствие условий */
    if (!client && data.type === 'CONNECTION' && data.game && (
      (adminGame && adminGame.players.some(o => o.token === data.token)) ||
      (!adminGame && data.admin)
    )) {
      /* Добавление клиента */
      const clientData = { ...data }
      if (adminGame) {
        clientData.player = adminGame.players.find(o => o.token === data.token) || {}
      }
      clients.set(ws, clientData)
      client = clientData
    }
    else {
      ws.send(JSON.stringify({
        type: 'ERROR',
        message: 'Проверка не пройдена, подключение не удалось',
      }))

      return
    }

    adminGameWs = getAdmin(client.game)
    adminGame = clients.get(adminGameWs)

    const isAdmin = client.admin
    const clientsInGame = getClients(client.game)
    const dataWs = { ...client }

    /* Если клиент - админ */
    if (isAdmin) {
      /* Возвращаем всех подключенных клиентов игроков */
      dataWs.clients = clientsInGame.filter(player => !player.admin)
    }

    if (client.type === 'READY') {
      ws.send(JSON.stringify({
        ...dataWs,
        message: 'Вы выготовы отвечать',
      }))
    }
    else if (client.type === 'CONNECTION') {
      ws.send(JSON.stringify({
        ...dataWs,
        message: 'Вы подключились к серверу',
      }))

      if (!isAdmin) {
        adminGameWs.send(JSON.stringify({
          type: 'CONNECTED_CLIENT',
          token: client.token,
          message: `Новый клиент: ${client.player?.name || client.token}`,
          clients: getClients(client.game).filter(player => !player.admin),
        }))
      }
    }
    else {
      ws.send(JSON.stringify({
        type: 'ERROR',
        message: 'Неизвестный тип сообщения',
      }))
    }
  })

  ws.on('close', () => {
    const client = clients.get(ws)

    if (client) {
      clients.delete(ws)

      const adminGameWs = getAdmin(client.game)
      const message = `Клиент отключился: ${client.player?.name || client.token}`

      console.info(message)

      if (adminGameWs && !client.admin) {
        adminGameWs.send(JSON.stringify({
          type: 'DISCONNECTED_CLIENT',
          token: client.token,
          clients: getClients(client.game).filter(player => !player.admin),
          message,
        }))
      }
    } else {
      console.error('Не удалось найти информацию о клиенте')
    }
  })
})

console.info('Сервер WebSocket запущен на ws://localhost:8088')

function getClients (game) {
  return Array.from(clients.values())
    .filter(client => client.token && client.game === game)
}

function getAdmin (game) {
  return Array.from(clients.keys()).find((ws) => {
    const clientData = clients.get(ws)
    return clientData.admin && clientData.game === game
  })
}
