const express = require('express')
const router = express.Router()
const db = require('../db')
const { applyCommand } = require('../services/simulator/gitSimulator')
const { gradeCommand, gradeState, gradeStudy, gradeCompetition } = require('../services/grader/grader')
const engineManager = require('../services/simulator/engineManager')
const { getStateStageById } = require('../services/stages/stateStages')

const executeCommand = engineManager.executeCommand || (() => ({ output: '', feedback: '', state: {} }))
const checkGoal = engineManager.checkGoal || (() => false)
const resetSession = engineManager.resetSession || (() => {})

// 1. 스테이지 전체 조회
router.get('/', async (req, res) => {
  try {
    const { category, difficulty } = req.query
    const stages = await db('stages')
      .where({ category, difficulty })
      .orderBy('id', 'asc')
    res.json(stages)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 2. 카테고리별 난이도 통계
router.get('/stats/:category', async (req, res) => {
  try {
    const { category } = req.params
    const stats = await db('stages')
      .where({ category })
      .select('difficulty')
      .count('* as count')
      .groupBy('difficulty')
    res.json(stats)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: '통계 로딩 실패' })
  }
})

// 3. 랜덤 스테이지 조회 ✅ /:id 보다 위에
router.get('/random', async (req, res) => {
  try {
    const stages = await db('stages').select('*')
    const random = stages[Math.floor(Math.random() * stages.length)]
    res.json(random)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 4. 상태 기반 스테이지 목록 조회 ✅ /:id 보다 위에
router.get('/state/category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params
    const stages = await db('stages')
      .where({ category: categoryName })
      .orderBy('id', 'asc')
    res.json(stages || [])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 5. 상태 기반 단일 스테이지 조회 ✅ /:id 보다 위에
router.get('/state/:id', async (req, res) => {
  try {
    const stage = await db('stages').where({ id: req.params.id }).first()
    if (!stage) return res.status(404).json({ error: 'Stage not found' })
    res.json(stage)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 6. 카테고리별 스테이지 조회 ✅ /:id 보다 위에
router.get('/category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params
    const difficulty = req.query.difficulty
      ? decodeURIComponent(req.query.difficulty)
      : null

    console.log(`[조회 요청] 카테고리: ${categoryName}, 난이도: ${difficulty}`)

    const stages = await db('stages')
      .where({ category: categoryName, difficulty: difficulty })
      .select('*')
      .orderBy('id', 'asc')

    res.json(stages || [])
  } catch (err) {
    console.error('[서버 에러]:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// 7. 기존 명령어 채점
router.post('/:id/submit', async (req, res) => {
  try {
    const { command, userId, mode, combo, timeLeft } = req.body
    console.log(`[제출 데이터] stageId: ${req.params.id}, command: ${command}, userId: ${userId}`)

    const stage = await db('stages').where({ id: req.params.id }).first()
    if (!stage) {
      console.log(`❌ [제출 실패] stages 테이블에서 ID ${req.params.id} 번 스테이지를 찾을 수 없습니다.`)
      return res.status(404).json({ error: `Stage ${req.params.id} not found` })
    }

    const engineResult = executeCommand(userId, command, stage.category)
    let passed = false

    if (stage.goal) {
      passed = checkGoal(userId, stage) === true
    } else {
      passed = gradeCommand(command, stage)
    }

    const feedback = !passed && engineResult.feedback ? engineResult.feedback : null

    res.json({
      passed,
      output: engineResult.output,
      feedback,
      state: engineResult.state,
      nextStageId: passed ? Number(req.params.id) + 1 : null
    })
  } catch (err) {
    console.error('🔥 [백엔드 내부 에러 발생]:', err)
    res.status(500).json({ error: err.message })
  }
})

// 8. 상태 기반 초기화
router.post('/:id/state-reset', async (req, res) => {
  try {
    const { userId, category } = req.body
    const stageId = req.params.id
    console.log(`[상태 리셋] userId: ${userId}, category: ${category}, stageId: ${stageId}`)

    const stage = getStateStageById(stageId)
    const initialFiles = stage?.initialFiles ?? []
    resetSession(userId, stageId, initialFiles)

    res.json({ success: true, message: '가상 저장소가 초기화되었습니다.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 9. 상태 기반 명령어 제출 ✅ 심화는 clearCondition, 나머지는 기존 방식
router.post('/:id/state-submit', async (req, res) => {
  try {
    const { command, userId, category } = req.body
    const stageId = req.params.id
    console.log(`[상태 제출] stageId: ${stageId}, command: ${command}, userId: ${userId}`)

    const jsStage = getStateStageById(stageId)

    if (jsStage) {
      // ✅ stateStages.js에 있으면 시나리오형 채점
      const engineResult = executeCommand(userId, command, category, stageId)
      const result = gradeState(engineResult.state, jsStage)

      return res.json({
        passed: result.passed,
        checks: result.checks,
        output: engineResult.output,
        feedback: engineResult.feedback ?? null,
        state: engineResult.state,
      })
    }

    const dbStage = await db('stages').where({ id: stageId }).first()
    if (!dbStage) return res.status(404).json({ error: `Stage ${stageId} not found` })

    const engineResult = executeCommand(userId, command, category, stageId)

    let passed = false
    let feedback = null

    if (dbStage.goal) {
      const goalResult = checkGoal(userId, dbStage, stageId)
      passed = goalResult === true
      feedback = typeof goalResult === 'object' ? goalResult.feedback : null
    } else {
      passed = gradeCommand(command, dbStage)
    }

    res.json({
      passed,
      checks: [],
      output: engineResult.output,
      feedback: feedback ?? engineResult.feedback ?? null,
      state: engineResult.state,
    })
  } catch (err) {
    console.error('🔥 백엔드 에러:', err)
    res.status(500).json({ error: err.message })
  }
})

// 10. 단일 스테이지 조회 ✅ 반드시 맨 아래
router.get('/:id', async (req, res) => {
  try {
    const stage = await db('stages').where({ id: req.params.id }).first()
    if (!stage) return res.status(404).json({ error: 'Stage not found' })
    res.json(stage)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router