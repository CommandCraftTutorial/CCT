require('dotenv').config()
const express = require('express')
const cors = require('cors')

const stageRouter = require('./routes/stage')
const userRouter = require('./routes/user')

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/stages', stageRouter)
app.use('/api/users', userRouter)

app.listen(3000, () => {
  console.log('서버 실행 중: http://localhost:3000')
})