const express = require('express')
const router = express.Router()
const db = require('../db')
const { gradeCommand } = require('../services/grader/grader')
const { applyCommand } = require('../services/simulator/gitSimulator')

// 카테고리별 스테이지 조회
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params
    const { difficulty } = req.query
    
    let query = db('stages').where({ category })
    if (difficulty) query = query.where({ difficulty })
    
    const stages = await query.select('id', 'title', 'mission', 'difficulty', 'category')
    res.json(stages)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 스테이지 전체 조회
router.get('/', async (req, res) => {
  try {
    const stages = await db('stages').select('id', 'title', 'mission', 'difficulty')
    res.json(stages)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 특정 스테이지 조회
router.get('/:id', async (req, res) => {
  try {
    const stage = await db('stages').where({ id: req.params.id }).first()
    if (!stage) return res.status(404).json({ error: 'Stage not found' })
    res.json(stage)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 명령어 채점
router.post('/:id/submit', async (req, res) => {
  try {
    const { command, userId } = req.body
    const stage = await db('stages').where({ id: req.params.id }).first()

    if (!stage) return res.status(404).json({ error: 'Stage not found' })

    const passed = gradeCommand(command, stage)
    const output = applyCommand(userId, command, stage.category)  // category 추가

    res.json({
      passed,
      output,
      nextStageId: passed ? Number(req.params.id) + 1 : null
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router