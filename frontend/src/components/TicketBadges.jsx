import Badge from './Badge'

const priorityTones = {
  Low: 'success',
  Medium: 'info',
  High: 'warning',
  Critical: 'danger',
}

const statusTones = {
  Open: 'info',
  'In Progress': 'warning',
  Resolved: 'success',
  Closed: 'neutral',
}

export function PriorityBadge({ priority }) {
  return <Badge tone={priorityTones[priority] || 'neutral'}>{priority || 'Unknown'}</Badge>
}

export function StatusBadge({ status }) {
  return <Badge tone={statusTones[status] || 'neutral'}>{status || 'Unknown'}</Badge>
}
