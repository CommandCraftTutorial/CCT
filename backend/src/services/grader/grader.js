function gradeCommand(input, stage) {
  // 1. 입력값이 없으면 바로 탈락
  if (!command) return false;

  // 2. 앞뒤 공백 제거 및 소문자화
  const trimmed = input.trim()

  // 3. 정규표현식이 있는 경우 
  if (stage.answer_regex) {
    try {
      // DB의 정규식 패턴으로 검사
      const regex = new RegExp(stage.answer_regex);
      return regex.test(trimmed);
    } catch (e) {
      console.error("정규식 패턴 오류:", e);
      return false;
    }
  }

  // 4. 일반 정답이 있는 경우
  if (stage.answer) {
    // 띄어쓰기가 여러 개여도 하나로 합치고 비교 (연속된 공백 처리)
    const normalizedInput = trimmed.replace(/\s+/g, ' ');
    const normalizedAnswer = stage.answer.trim().replace(/\s+/g, ' ');
    
    return normalizedInput === normalizedAnswer;
  }

  return false;
}

module.exports = { gradeCommand }