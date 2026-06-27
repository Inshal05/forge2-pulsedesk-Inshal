import api from './api'

export async function getTickets(page = 1) {
  const { data } = await api.get('/tickets', { params: { page } })
  return data
}

export async function getAllTickets() {
  const firstPage = await getTickets(1)
  const tickets = [...(firstPage.data ?? [])]
  const lastPage = firstPage.last_page ?? 1

  for (let page = 2; page <= lastPage; page += 1) {
    const result = await getTickets(page)
    tickets.push(...(result.data ?? []))
  }

  return tickets
}

export async function getTicket(id) {
  const { data } = await api.get(`/tickets/${id}`)
  return data.ticket
}

export async function createTicket(payload) {
  const { data } = await api.post('/tickets', payload)
  return data.ticket
}

export async function updateTicket(id, payload) {
  const { data } = await api.patch(`/tickets/${id}`, payload)
  return data.ticket
}

export async function deleteTicket(id) {
  const { data } = await api.delete(`/tickets/${id}`)
  return data
}
