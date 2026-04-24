import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:3000/api' })

export const getStage = (id) => api.get(`/stages/${id}`)
export const submitCommand = (stageId, command, userId) =>
  api.post(`/stages/${stageId}/submit`, { command, userId })