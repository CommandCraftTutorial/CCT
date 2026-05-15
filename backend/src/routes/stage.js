const express = require('express')
const router = express.Router()
const db = require('../db')
const { applyCommand } = require('../services/simulator/gitSimulator')
const { gradeCommand, gradeStudy, gradeCompetition } = require('../services/grader/grader')


// 스테이지 전체 조회
router.get('/', async (req, res) => {
  try {
    const stages = await db('stages').select('id', 'title', 'mission', 'difficulty')
    res.json(stages)
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

router.get('/category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    
    // 🔍 1. 한글 파라미터 안전하게 디코딩 (기초 -> 기초)
    const difficulty = req.query.difficulty 
      ? decodeURIComponent(req.query.difficulty) 
      : null;

    // 🔍 2. 서버 터미널에 어떤 값으로 검색하는지 로그 찍기
    console.log(`[조회 요청] 카테고리: ${categoryName}, 난이도: ${difficulty}`);

    const stages = await db('stages')
      .where({ category: categoryName, difficulty: difficulty })
      .select('*');

    // 데이터가 없으면 빈 값 대신 명확하게 에러 메시지 주기
    if (!stages || stages.length === 0) {
      console.log(`[조회 실패] 데이터를 찾을 수 없습니다.`);
      return res.status(404).json({ error: '일치하는 스테이지가 없습니다.' });
    }

    res.json(stages);
  } catch (err) {
    console.error("[서버 에러]:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 랜덤 스테이지 조회
router.get('/random', async (req, res) => {
  try {
    const stages = await db('stages').select('*')
    const random = stages[Math.floor(Math.random() * stages.length)]
    res.json(random)
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

// 명령어 채점 및 제출
router.post('/:id/submit', async (req, res) => {
  try {
    const { command, userId } = req.body;
    const stage = await db('stages').where({ id: req.params.id }).first();

    if (!stage) {
      return res.status(404).json({ error: 'Stage not found' });
    }

    // 1. 채점 엔진(grader.js)을 통해 합격 여부(true/false) 판단
    const passed = gradeCommand(command, stage);

    // 2. 가상 터미널 환경에 명령어 반영
    const output = applyCommand(userId, command, stage.category);

    // 3. 점수 및 콤보 시스템 계산 (경쟁 모드용 로직이 있다면 연동)
    // 현재 result가 정의되지 않았으므로 임시로 passed 기준 score와 combo를 세팅하거나, 
    // 팀원분이 만들어둔 점수 계산 함수가 있다면 그것과 엮어야 합니다.
    const score = passed ? 100 : 0; // 예시 점수
    const combo = passed ? 1 : 0;   // 예시 콤보

    res.json({
      passed: passed,               // result.passed 대신 직접 생성한 passed 사용
      score: score,                 // result.score 대신 변수 사용
      combo: combo,                 // result.combo 대신 변수 사용
      output: output,
      nextStageId: passed ? Number(req.params.id) + 1 : null
    });
  } catch (err) {
    console.error("[채점 API 에러]:", err.message); // 터미널에 에러 원인 출력
    res.status(500).json({ error: err.message });
  }
});


module.exports = router