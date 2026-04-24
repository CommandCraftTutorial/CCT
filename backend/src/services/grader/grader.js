function gradeCommand(input, stage) {
  const trimmed = input.trim()

  if (stage.answer_regex) {
    const regex = new RegExp(stage.answer_regex)
    return regex.test(trimmed)
  }

  return trimmed === stage.answer
}

module.exports = { gradeCommand }