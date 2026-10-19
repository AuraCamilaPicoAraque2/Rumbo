import api from './api.js'

const get = (url, params) => api.get(url, { params }).then((r) => r.data)

export const getCareers = (params) => get('/careers', params)
export const getCareerAreas = () => get('/careers/areas')
export const getCareer = (slug) => get(`/careers/${encodeURIComponent(slug)}`)
export const getUniversities = (params) => get('/universities', params)
export const getFinancing = (params) => get('/financing', params)
export const getAdmission = () => get('/admission')
export const getResources = (params) => get('/resources', params)
export const getWellbeing = () => get('/wellbeing')
export const getFaqs = () => get('/faqs')
