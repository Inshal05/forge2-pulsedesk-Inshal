import api from './api'

export async function login(credentials) {
  const { data } = await api.post('/login', credentials)
  return data
}
