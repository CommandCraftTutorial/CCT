// services/grader/grader.js

function gradeCommand(input, stage) {
  if (!input) return false
  const trimmed = input.trim()
  if (!trimmed) return false

  if (stage.answer_regex) {
    try {
      if (trimmed.includes('command not found')) return false
      const regex = new RegExp(stage.answer_regex.trim())
      const match = trimmed.match(regex)
      return !!(match && match[0] === trimmed)
    } catch (e) {
      console.error('정규식 패턴 오류:', e)
      return false
    }
  }

  if (stage.answer) {
    return trimmed.replace(/\s+/g, ' ') === stage.answer.trim().replace(/\s+/g, ' ')
  }

  return false
}

// ✅ 심화 시나리오형 채점
function gradeState(state, stage) {
  if (!stage.clearCondition) {
    return { passed: false, checks: [] }
  }

  const passed = stage.clearCondition(state)

  const checks = (stage.checks ?? []).map(c => ({
    label: c.label,
    passed: c.check(state),
    hint: c.hint
  }))

  return { passed, checks }
}

function gradeStudy(input, stage) {
  return { passed: gradeCommand(input, stage), mode: 'study' }
}

function gradeCompetition(input, stage, combo = 0, timeLeft = 30, wrongCount = 0, passedOverride = null) {
  const passed = passedOverride ?? gradeCommand(input, stage)
  if (!passed) return { passed: false, score: 0, combo: 0, mode: 'competition' }

  let score = 100
  const newCombo = combo + 1
  if (newCombo >= 3) score += 50
  if (newCombo >= 5) score += 50
  if (newCombo >= 10) score += 100
  score += timeLeft * 2

  const wrongPenalty = wrongCount * 10
  score = Math.max(0, score - wrongPenalty)

  return {
    passed: true,
    score,
    combo: newCombo,
    wrongCount,
    wrongPenalty,
    mode: 'competition'
  }
}

module.exports = { gradeCommand, gradeState, gradeStudy, gradeCompetition }
