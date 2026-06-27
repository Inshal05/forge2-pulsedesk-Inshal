import { ClipboardList, Clock, Plus, RefreshCcw, ShieldCheck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import { StatusBadge } from '../components/TicketBadges'
import { useAuth } from '../hooks/useAuth'
import { getAllTickets } from '../services/ticketService'
import { formatDate, getErrorMessage } from '../utils/formatters'

function Dashboard() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  async function loadTickets() {
    setIsLoading(true)
    setError('')

    try {
      setTickets(await getAllTickets())
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load dashboard.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function loadInitialTickets() {
      try {
        setTickets(await getAllTickets())
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load dashboard.'))
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialTickets()
  }, [])

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter((ticket) => ticket.status === 'Open').length,
      active: tickets.filter((ticket) => ticket.status === 'In Progress').length,
      closed: tickets.filter((ticket) => ['Resolved', 'Closed'].includes(ticket.status)).length,
    }
  }, [tickets])

  const recentTickets = tickets.slice(0, 5)

  return (
    <>
      <PageHeader
        title={`Welcome${user?.name ? `, ${user.name}` : ''}`}
        description="A quick view of current support workload and recent ticket movement."
        actions={
          <Link className="button button-primary" to="/tickets/new">
            <Plus size={18} aria-hidden="true" />
            New ticket
          </Link>
        }
      />

      <ErrorMessage message={error} />

      {isLoading ? (
        <LoadingState label="Loading dashboard" />
      ) : (
        <>
          <section className="welcome-panel">
            <div>
              <h2>Support operations</h2>
              <p>Track intake, triage high-priority issues, and keep resolutions moving.</p>
            </div>
            <button className="button button-ghost" type="button" onClick={loadTickets}>
              <RefreshCcw size={18} aria-hidden="true" />
              Refresh
            </button>
          </section>

          <section className="stats-grid" aria-label="Ticket statistics">
            <article className="stat-card">
              <ClipboardList size={22} aria-hidden="true" />
              <span>Total tickets</span>
              <strong>{stats.total}</strong>
            </article>
            <article className="stat-card">
              <Clock size={22} aria-hidden="true" />
              <span>Open</span>
              <strong>{stats.open}</strong>
            </article>
            <article className="stat-card">
              <RefreshCcw size={22} aria-hidden="true" />
              <span>In progress</span>
              <strong>{stats.active}</strong>
            </article>
            <article className="stat-card">
              <ShieldCheck size={22} aria-hidden="true" />
              <span>Resolved or closed</span>
              <strong>{stats.closed}</strong>
            </article>
          </section>

          <section className="table-panel">
            <div className="section-heading">
              <h2>Recent tickets</h2>
              <Link to="/tickets">View all</Link>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Ticket Number</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>{ticket.ticket_number}</td>
                      <td>{ticket.title}</td>
                      <td>
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td>{formatDate(ticket.created_at)}</td>
                    </tr>
                  ))}
                  {!recentTickets.length ? (
                    <tr>
                      <td colSpan="4" className="table-empty">
                        No tickets yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  )
}

export default Dashboard
