import { Edit, Eye, Plus, RefreshCcw, Search, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import { PriorityBadge, StatusBadge } from '../components/TicketBadges'
import { deleteTicket, getTickets } from '../services/ticketService'
import { formatDate, getErrorMessage } from '../utils/formatters'

function Tickets() {
  const [tickets, setTickets] = useState([])
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  async function loadTickets(nextPage = page) {
    setIsLoading(true)
    setError('')

    try {
      const data = await getTickets(nextPage)
      setTickets(data.data ?? [])
      setPagination(data)
      setPage(data.current_page ?? nextPage)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load tickets.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function loadInitialTickets() {
      try {
        const data = await getTickets(1)
        setTickets(data.data ?? [])
        setPagination(data)
        setPage(data.current_page ?? 1)
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load tickets.'))
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialTickets()
  }, [])

  const filteredTickets = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) {
      return tickets
    }

    return tickets.filter((ticket) =>
      [ticket.ticket_number, ticket.title, ticket.category, ticket.status, ticket.priority]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    )
  }, [search, tickets])

  async function handleDelete(ticket) {
    const confirmed = window.confirm(`Delete ticket ${ticket.ticket_number}? This cannot be undone.`)

    if (!confirmed) {
      return
    }

    setDeletingId(ticket.id)
    setError('')

    try {
      await deleteTicket(ticket.id)
      await loadTickets(page)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to delete ticket.'))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Tickets"
        description="Search, triage, update, and remove support tickets."
        actions={
          <Link className="button button-primary" to="/tickets/new">
            <Plus size={18} aria-hidden="true" />
            New ticket
          </Link>
        }
      />

      <section className="toolbar">
        <label className="search-field">
          <Search size={18} aria-hidden="true" />
          <input
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search current page"
            type="search"
            value={search}
          />
        </label>
        <button className="button button-ghost" disabled={isLoading} onClick={() => loadTickets(page)} type="button">
          <RefreshCcw size={18} aria-hidden="true" />
          Refresh
        </button>
      </section>

      <ErrorMessage message={error} />

      {isLoading ? (
        <LoadingState label="Loading tickets" />
      ) : (
        <section className="table-panel">
          {tickets.length ? (
            <>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Ticket Number</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Created Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>{ticket.ticket_number}</td>
                        <td>{ticket.title}</td>
                        <td>{ticket.category}</td>
                        <td>
                          <StatusBadge status={ticket.status} />
                        </td>
                        <td>
                          <PriorityBadge priority={ticket.priority} />
                        </td>
                        <td>{formatDate(ticket.created_at)}</td>
                        <td>
                          <div className="row-actions">
                            <Link className="icon-button" to={`/tickets/${ticket.id}`} aria-label="View ticket">
                              <Eye size={17} />
                            </Link>
                            <Link className="icon-button" to={`/tickets/${ticket.id}/edit`} aria-label="Edit ticket">
                              <Edit size={17} />
                            </Link>
                            <button
                              className="icon-button danger"
                              disabled={deletingId === ticket.id}
                              onClick={() => handleDelete(ticket)}
                              type="button"
                              aria-label="Delete ticket"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!filteredTickets.length ? (
                      <tr>
                        <td colSpan="7" className="table-empty">
                          No tickets match your search.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <span>
                  Page {pagination?.current_page ?? page} of {pagination?.last_page ?? 1}
                </span>
                <div>
                  <button
                    className="button button-ghost"
                    disabled={!pagination?.prev_page_url}
                    onClick={() => loadTickets(page - 1)}
                    type="button"
                  >
                    Previous
                  </button>
                  <button
                    className="button button-ghost"
                    disabled={!pagination?.next_page_url}
                    onClick={() => loadTickets(page + 1)}
                    type="button"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState
              title="No tickets yet"
              message="Create the first ticket to start tracking support work."
              action={
                <Link className="button button-primary" to="/tickets/new">
                  <Plus size={18} aria-hidden="true" />
                  New ticket
                </Link>
              }
            />
          )}
        </section>
      )}
    </>
  )
}

export default Tickets
