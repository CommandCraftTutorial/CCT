const express = require('express')
const router = express.Router()
const db = require('../db')
const { applyDungeonCommand, checkGoal, initDungeonSession } = require('../services/simulator/dungeonSimulator')

// 던전 스테이지 목록
router.get('/', async (req, res) => {
  try {
    const stages = await db('dungeon_stages')
      .select('id', 'title', 'story', 'order_num')
      .orderBy('order_num')
    res.json(stages)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 특정 던전 스테이지
router.get('/:id', async (req, res) => {
  try {
    const stage = await db('dungeon_stages').where({ id: req.params.id }).first()
    if (!stage) return res.status(404).json({ error: 'Stage not found' })
    res.json(stage)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 명령어 실행
router.post('/:id/command', async (req, res) => {
  try {
    const { command, userId } = req.body
    const stage = await db('dungeon_stages').where({ id: req.params.id }).first()
    if (!stage) return res.status(404).json({ error: 'Stage not found' })

    const result = applyDungeonCommand(userId, stage.id, command, stage.filesystem)
    const passed = checkGoal(result.state, stage, result)

    res.json({
      output: result.output,
      passed,
      currentPath: result.state.currentPath,
      nextStageId: passed ? Number(req.params.id) + 1 : null,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router