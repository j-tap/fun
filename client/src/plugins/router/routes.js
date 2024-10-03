import Home from '@/views/Home.vue'
import GamesCrocodile from '@/views/games/Crocodile.vue'
import GamesJeopardy from '@/views/games/jeopardy/index.vue'
import GamesJeopardyPlayer from '@/views/games/jeopardy/Player.vue'

export default [
  { path: '/', component: Home },
  { path: '/games/crocodile', component: GamesCrocodile },
  { path: '/games/jeopardy', component: GamesJeopardy },
  { path: '/games/jeopardy/player', component: GamesJeopardyPlayer },
]
