let canAnswer = false

function newQuest(socket, data, players) {
  canAnswer = true
  console.log('newQuest players', players)
  players.forEach(player => {
    console.log('player', player)
    player.socket.emit('can_ready', data)
  })
  console.info('Новый вопрос', data)
}

function playerReady(socket, data, admin, emitError) {
  if (canAnswer) {
    if (admin) {
      admin.socket.emit('player_quested', data)
      canAnswer = false
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
