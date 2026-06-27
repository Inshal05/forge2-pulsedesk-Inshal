import { Save } from 'lucide-react'
import { useState } from 'react'
import ErrorMessage from './ErrorMessage'

const priorities = ['Low', 'Medium', 'High', 'Critical']
const statuses = ['Open', 'In Progress', 'Resolved', 'Closed']

function TicketForm({ initialValues, mode = 'create', onSubmit, isSubmitting, error }) {
  const [values, setValues] = useState({
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
    category: initialValues?.category ?? '',
    priority: initialValues?.priority ?? 'Medium',
    status: initialValues?.status ?? 'Open',
  })
  const [validationError, setValidationError] = useState('')

  function updateField(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!values.title.trim() || !values.description.trim() || !values.category.trim()) {
      setValidationError('Title, description, and category are required.')
      return
    }

    setValidationError('')
    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category.trim(),
      priority: values.priority,
    }

    if (mode === 'edit') {
      payload.status = values.status
    }

    onSubmit(payload)
  }

  return (
    <form className="form-panel" onSubmit={handleSubmit}>
      <ErrorMessage message={validationError || error} />

      <label className="field">
        <span>Title</span>
        <input name="title" value={values.title} onChange={updateField} required />
      </label>

      <label className="field">
        <span>Description</span>
        <textarea
          name="description"
          value={values.description}
          onChange={updateField}
          rows="7"
          required
        />
      </label>

      <div className="form-grid">
        <label className="field">
          <span>Category</span>
          <input name="category" value={values.category} onChange={updateField} required />
        </label>

        <label className="field">
          <span>Priority</span>
          <select name="priority" value={values.priority} onChange={updateField}>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>
      </div>

      {mode === 'edit' ? (
        <label className="field">
          <span>Status</span>
          <select name="status" value={values.status} onChange={updateField}>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="form-actions">
        <button className="button button-primary" disabled={isSubmitting} type="submit">
          <Save size={18} aria-hidden="true" />
          {isSubmitting ? 'Saving' : mode === 'edit' ? 'Update ticket' : 'Create ticket'}
        </button>
      </div>
    </form>
  )
}

export default TicketForm
