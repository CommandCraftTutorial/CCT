require('dotenv').config()
const express = require('express')
const cors = require('cors')

const stageRouter = require('./routes/stage')
const userRouter = require('./routes/user')

const app = express()

const dungeonRouter = require('./routes/dungeon')

app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL || '*'
  ]
}))
app.use(express.json())

app.use('/api/stages', stageRouter)
app.use('/api/users', userRouter)
app.use('/api/dungeon', dungeonRouter)

app.listen(3000, () => {
  console.log('서버 실행 중: http://localhost:3000')
})