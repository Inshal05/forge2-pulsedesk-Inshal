import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import TicketForm from '../components/TicketForm'
import { createTicket } from '../services/ticketService'
import { getErrorMessage } from '../utils/formatters'

function CreateTicket() {
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(payload) {
    setIsSubmitting(true)
    setError('')

    try {
      const ticket = await createTicket(payload)
      navigate(`/tickets/${ticket.id}`)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to create ticket.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader title="Create Ticket" description="Capture a new customer support request." />
      <TicketForm error={error} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </>
  )
}

export default CreateTicket
