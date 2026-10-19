import api from './api.js'

export const getQuestions = () => api.get('/test/questions').then((r) => r.data)
export const submitTest = (answers) => api.post('/test/submit', { answers }).then((r) => r.data)
export const askAdvisor = (message) => api.post('/orientador', { message }).then((r) => r.data)
