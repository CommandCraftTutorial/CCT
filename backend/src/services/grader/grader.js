function gradeCommand(input, stage) {
  // 1. 입력값이 없으면 바로 탈락
  if (!input) return false  // command → input 으로 수정

  // 2. 앞뒤 공백 제거
  const trimmed = input.trim()
  if (!trimmed) return false

  // 3. 정규표현식 채점
  if (stage.answer_regex) {
    try {
      const regex = new RegExp(stage.answer_regex)
      return regex.test(trimmed)
    } catch (e) {
      console.error('정규식 패턴 오류:', e)
      return false
    }
  }

  // 4. 일반 정답 채점
  if (stage.answer) {
    const normalizedInput = trimmed.replace(/\s+/g, ' ')
    const normalizedAnswer = stage.answer.trim().replace(/\s+/g, ' ')
    return normalizedInput === normalizedAnswer
  }

  return false
}

// 학습 모드 채점 (힌트 차감 없음)
function gradeStudy(input, stage) {
  return {
    passed: gradeCommand(input, stage),
    mode: 'study'
  }
}

// 경쟁 모드 채점 (콤보, 시간 보너스 계산)
function gradeCompetition(input, stage, combo = 0, timeLeft = 30) {
  const passed = gradeCommand(input, stage)

  if (!passed) {
    return {
      passed: false,
      score: 0,
      combo: 0,
      mode: 'competition'
    }
  }

  // 기본 점수
  let score = 100

  // 콤보 보너스 (3콤보 이상부터 +50)
  const newCombo = combo + 1
  if (newCombo >= 3) score += 50
  if (newCombo >= 5) score += 50
  if (newCombo >= 10) score += 100

  // 시간 보너스 (남은 시간 * 2)
  score += timeLeft * 2

  return {
    passed: true,
    score,
    combo: newCombo,
    mode: 'competition'
  }
}

module.exports = { gradeCommand, gradeStudy, gradeCompetition }