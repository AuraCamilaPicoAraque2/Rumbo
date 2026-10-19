import api from './api.js'

export const getArticles = (params) => api.get('/articles', { params }).then((r) => r.data)
export const getArticle = (slug) => api.get(`/articles/${encodeURIComponent(slug)}`).then((r) => r.data)
export const getCategories = () => api.get('/categories').then((r) => r.data)

export const getComments = (slug) =>
  api.get(`/articles/${encodeURIComponent(slug)}/comments`).then((r) => r.data)
export const addComment = (slug, content) =>
  api.post(`/articles/${encodeURIComponent(slug)}/comments`, { content }).then((r) => r.data)
export const removeComment = (id) => api.delete(`/comments/${id}`)
