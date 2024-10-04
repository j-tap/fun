import Home from '@/views/Home.vue'
import GamesCrocodile from '@/views/games/Crocodile.vue'
import GamesJeopardy from '@/views/games/jeopardy/index.vue'
import GamesJeopardyPlayer from '@/views/games/jeopardy/Player.vue'
import LearningReadRu from '@/views/learning/ReadRu/index.vue'
import LearningReadEs from '@/views/learning/ReadEs/index.vue'

export default [
  { name: 'home', path: '/', component: Home },

  { name: 'game-crocodile', path: '/games/crocodile', component: GamesCrocodile },
  { name: 'game-jeopardy', path: '/games/jeopardy', component: GamesJeopardy },
  { name: 'game-jeopardy-player', path: '/games/jeopardy/player', component: GamesJeopardyPlayer },

  { name: 'learning-read-ru', path: '/learning/read-ru', component: LearningReadRu },

  { name: 'learning-read-es', path: '/learning/read-es', component: LearningReadEs },
]
