let canAnswer = false
let lastQuest = null
let lastAnsweredPlayer = null

function newQuest (socket, data, players) {
  let playersList = [...players]
  canAnswer = true

  if (lastAnsweredPlayer?.token && data.quest.id === lastQuest?.id) {
    playersList = playersList.filter(player => player.token !== lastAnsweredPlayer.token)
  }

  playersList.forEach(player => {
    player.socket.emit('can_ready', data)
  })

  lastQuest = data.quest
  console.info('Новый вопрос', data)
}

function playerReady (socket, data, admin, emitError) {
  if (canAnswer) {
    if (admin) {
      admin.socket.emit('player_quested', data)
      canAnswer = false
      lastAnsweredPlayer = data.player
    }
    else {
      emitError(socket, 'Администратор не найден')
    }
    console.info('Игрок готов', data)
  }
}

module.exports = {
  newQuest,
  playerReady,
  canAnswer,
}
