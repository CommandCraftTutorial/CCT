import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:3000/api' })

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

export const getLeaderboard = () =>
  api.get('/users/leaderboard')

export const getDungeonStages = () =>
  api.get('/dungeon')

export const getDungeonStage = (id) =>
  api.get(`/dungeon/${id}`)

export const sendDungeonCommand = (stageId, command, userId) =>
  api.post(`/dungeon/${stageId}/command`, { command, userId })