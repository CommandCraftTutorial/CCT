const express = require('express')
const router = express.Router()
const db = require('../db')

// 유저 생성 또는 조회
router.post('/login', async (req, res) => {
  try {
    const { username } = req.body

    let user = await db('users').where({ username }).first()

    if (!user) {
      const result = await db('users').insert({ username }).returning('*')
      user = result[0]
    }

    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 유저 진행 상황 업데이트
router.patch('/:id/progress', async (req, res) => {
  try {
    const { current_stage, score } = req.body
    await db('users').where({ id: req.params.id }).update({ current_stage, score })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 리더보드 조회
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await db('users')
      .select('id', 'username', 'current_stage', 'score')
      .orderBy('score', 'desc')
      .limit(100)
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router