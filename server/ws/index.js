const jeopardy = require('./jeopardy')
const clients = new Map()

module.exports = (ws) => {
  // disconnectAllClients()

  ws.on('connection', (socket) => {
    console.info('Новый клиент подключился')

    socket.on('join_admin', (data) => {
      if (!clients.has(socket)) {
        const admin = getGameAdmin(data)

        if (!admin && data.admin) {
          clients.set(socket, data)
          socket.emit('joined')
          console.info('Админ присоединился', data)
        }
        else {
          emitError(socket, 'Присоединение администратора не удалось', data)
        }
      }
    })

    socket.on('join_player', (data) => {
      if (!clients.has(socket)) {
        const admin = getGameAdmin(data)

        if (admin && isExistToken(admin, data)) {
          clients.set(socket, data)
          const player = admin.players.find(o => o.token === data.token)
          const tokens = getTokens()

          socket.emit('joined', { ...data, player })
          admin.socket.emit('joined_player', { client: { ...data, player }, tokens })
          console.info('Игрок присоединился', data)
        }
        else {
          emitError(socket, 'Присоединение игрока не удалось', data)
        }
      }
    })

    socket.on('update_players', (data) => {
      const admin = getGameAdmin(data)

      if (admin) {
        const oldPlayers = admin.players || []
        const newPlayers = data.players

        admin.players = newPlayers
        clients.set(admin.socket, admin)

        oldPlayers.forEach(oldPlayer => {
          if (!newPlayers.some(newPlayer => newPlayer.token === oldPlayer.token)) {
            const client = getPlayerWithSocket(oldPlayer.token)

            if (client) {
              client.socket.disconnect()
              clients.delete(client.socket)
              console.info(`Игрок ${oldPlayer.token} был отключен`)
            }
          }
        })

        newPlayers.forEach(player => {
          const client = getPlayerWithSocket(player.token)

          if (client) {
            client.socket.emit('updated_player', player)
          }
        })

        console.info('Игроки обновлены', data)
      }
    })

    /* jeopardy */
    socket.on('new_quest', (data) => jeopardy.newQuest(socket, data, getPlayersWithSocket(data)))
    socket.on('player_ready', (data) => jeopardy.playerReady(socket, data, getGameAdmin(data), emitError))

    socket.on('disconnecting', (reason) => {
      const client = clients.get(socket)
      const admin = getGameAdmin({ game: client?.game })

      socket.emit('disconnected', { reason })

      clients.delete(socket)

      if (admin) {
        const player = admin.players.find(o => o.token === client?.token)
        const tokens = getTokens()

        admin.socket.emit('left_player', { token: client?.token, player, tokens })
      }

      console.info('Клиент отключился', client)
    })
  })
}

function getTokens () {
  return Array.from(clients).map(([, o]) => o.token)
}

function getPlayerWithSocket (token) {
  for (const [socket, clientData] of clients) {
    if (clientData.token === token) {
      return { ...clientData, socket }
    }
  }
  return null
}

function getPlayersWithSocket (data) {
  return Array.from(clients)
    .filter(([socket, clientData]) => clientData.game === data?.game)
    .map(([socket, clientData]) => ({ ...clientData, socket }))
}

function getGameAdmin (data) {
  for (const [socket, clientData] of clients) {
    if (clientData.admin && clientData.game === data?.game) {
      return { ...clientData, socket }
    }
  }
  return null
}

function emitError (socket, message, data = '') {
  socket.emit('error', { message })
  console.error(message, data)
}

function isExistToken (admin, data) {
  return admin?.players.some(o => o.token === data?.token) || false
}

function disconnectAllClients () {
  ws.sockets.sockets.forEach((socket) => {
    socket.disconnect(true)
  })
  console.log('Все клиенты отключены')
}
