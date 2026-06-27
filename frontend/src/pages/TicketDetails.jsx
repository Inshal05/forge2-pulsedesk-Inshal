import { Edit, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import { PriorityBadge, StatusBadge } from '../components/TicketBadges'
import { deleteTicket, getTicket } from '../services/ticketService'
import { formatDate, getErrorMessage } from '../utils/formatters'

function TicketDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function loadTicket() {
      setIsLoading(true)
      setError('')

      try {
        setTicket(await getTicket(id))
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load ticket.'))
      } finally {
        setIsLoading(false)
      }
    }

    loadTicket()
  }, [id])

  async function handleDelete() {
    const confirmed = window.confirm(`Delete ticket ${ticket.ticket_number}? This cannot be undone.`)

    if (!confirmed) {
      return
    }

    setIsDeleting(true)
    setError('')

    try {
      await deleteTicket(ticket.id)
      navigate('/tickets')
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to delete ticket.'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Ticket Details"
        description="Review ticket information and ownership."
        actions={
          ticket ? (
            <>
              <Link className="button button-ghost" to={`/tickets/${ticket.id}/edit`}>
                <Edit size={18} aria-hidden="true" />
                Edit
              </Link>
              <button className="button button-danger" disabled={isDeleting} onClick={handleDelete} type="button">
                <Trash2 size={18} aria-hidden="true" />
                Delete
              </button>
            </>
          ) : null
        }
      />

      <ErrorMessage message={error} />

      {isLoading ? (
        <LoadingState label="Loading ticket" />
      ) : ticket ? (
        <section className="details-panel">
          <div className="details-title">
            <div>
              <span>{ticket.ticket_number}</span>
              <h2>{ticket.title}</h2>
            </div>
            <div className="badge-row">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
          </div>

          <div className="details-description">
            <h3>Description</h3>
            <p>{ticket.description}</p>
          </div>

          <dl className="details-grid">
            <div>
              <dt>Category</dt>
              <dd>{ticket.category}</dd>
            </div>
            <div>
              <dt>Created At</dt>
              <dd>{formatDate(ticket.created_at)}</dd>
            </div>
            <div>
              <dt>Due Date</dt>
              <dd>{formatDate(ticket.due_at)}</dd>
            </div>
            <div>
              <dt>Assigned User</dt>
              <dd>{ticket.assignee?.name || ticket.assignee?.email || 'Unassigned'}</dd>
            </div>
          </dl>
        </section>
      ) : null}
    </>
  )
}

export default TicketDetails
