const express = require('express')
const router = express.Router()
const db = require('../db')

// 유저 생성 또는 조회
router.post('/login', async (req, res) => {
  try {
    const { username } = req.body

    let user = await db('users').where({ username }).first()

    if (!user) {
      const [id] = await db('users').insert({ username }).returning('id')
      user = await db('users').where({ id }).first()
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

module.exports = router