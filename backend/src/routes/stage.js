const express = require('express')
const router = express.Router()
const db = require('../db')
const { gradeCommand } = require('../services/grader/grader')
const { applyCommand } = require('../services/simulator/gitSimulator')

//카테고리별 난이도 통계 가져오기
router.get('/stats/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const stats = await db('stages')
      .where({ category })
      .select('difficulty') // '기초', '중급', '심화' 컬럼 추출
      .count('* as count')
      .groupBy('difficulty');
    console.log(`${category} 통계 결과:`, stats);
    // 결과값 예시: [{ difficulty: '기초', count: 10 }, { difficulty: '중급', count: 10 }, ...]
    res.json(stats); 
  } catch (err) {
    res.status(500).json({ error: '데이터를 가져오지 못했습니다.' });
  }
});

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

// 카테고리별 난이도 통계 가져오기
router.get('/stats/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    // Knex를 사용해 해당 카테고리의 난이도별 개수 카운트
    const stats = await db('stages')
      .where({ category })
      .select('difficulty')
      .count('* as count')
      .groupBy('difficulty');

    // 결과 예시: [{ difficulty: '기초', count: 66 }, ...]
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '통계 로딩 실패' });
  }
});

// 데이터 수 계산
router.get('/stats/:category', async (req, res) => {
  const { category } = req.params;
  
  const stats = await db('stages')
    .where({ category })
    .select('difficulty')
    .count('* as count')
    .groupBy('difficulty');

  // 결과 예시: [{ difficulty: '기초', count: 15 }, { difficulty: '중급', count: 12 }, ...]
  res.json(stats);
});

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