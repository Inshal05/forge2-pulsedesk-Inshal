import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import TicketForm from '../components/TicketForm'
import { getTicket, updateTicket } from '../services/ticketService'
import { getErrorMessage } from '../utils/formatters'

function EditTicket() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  async function handleSubmit(payload) {
    setIsSubmitting(true)
    setError('')

    try {
      const updatedTicket = await updateTicket(id, payload)
      navigate(`/tickets/${updatedTicket.id}`)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to update ticket.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader title="Edit Ticket" description="Update ticket fields and current status." />

      {isLoading ? (
        <LoadingState label="Loading ticket" />
      ) : ticket ? (
        <TicketForm
          error={error}
          initialValues={ticket}
          isSubmitting={isSubmitting}
          mode="edit"
          onSubmit={handleSubmit}
        />
      ) : (
        <ErrorMessage message={error} />
      )}
    </>
  )
}

export default EditTicket
