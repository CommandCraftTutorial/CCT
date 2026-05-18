const API_URL = import.meta.env.VITE_API_URL

export async function getStateStagesByCategory(category) {
  const res = await fetch(`${API_URL}/stages/state/category/${category}`)
  if (!res.ok) throw new Error('상태 기반 스테이지 목록 조회 실패')
  return res.json()
}

export async function getStateStage(stageId) {
  const res = await fetch(`${API_URL}/stages/state/${stageId}`)
  if (!res.ok) throw new Error('상태 기반 스테이지 조회 실패')
  return res.json()
}

export async function resetStateStage(stageId, userId, category = 'git') {
  const res = await fetch(`${API_URL}/stages/${stageId}/state-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, category }),
  })

  if (!res.ok) throw new Error('상태 초기화 실패')
  return res.json()
}

export async function submitStateCommand(stageId, userId, command, category = 'git') {
  const res = await fetch(`${API_URL}/stages/${stageId}/state-submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      category,
      command,
    }),
  })

  if (!res.ok) throw new Error('상태 기반 명령어 제출 실패')
  return res.json()
}