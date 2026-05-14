import axios from 'axios'

const api = axios.create({ 
  baseURL: 'https://cct-xeeo.onrender.com/api'
})

export const loginUser = (username) =>
  api.post('/users/login', { username })

export const getStages = () =>
  api.get('/stages')

export const getStage = (id) =>
  api.get(`/stages/${id}`)

export const submitCommand = (stageId, command, userId) =>
  api.post(`/stages/${stageId}/submit`, { command, userId })

export const updateProgress = (userId, current_stage, score) =>
  api.patch(`/users/${userId}/progress`, { current_stage, score })

//랭킹 대시보드
export const getLeaderboard = () =>
  api.get('/users/leaderboard')

//미니게임
export const getDungeonStages = () =>
  api.get('/dungeon')

export const getDungeonStage = (id) =>
  api.get(`/dungeon/${id}`)

export const sendDungeonCommand = (stageId, command, userId) =>
  api.post(`/dungeon/${stageId}/command`, { command, userId })

export const getStagesByCategory = (category, difficulty) =>
  api.get(`/stages/category/${category}?difficulty=${difficulty}`)