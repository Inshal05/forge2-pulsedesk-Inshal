export function formatDate(value) {
  if (!value) {
    return 'Not set'
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function getErrorMessage(error, fallback = 'Something went wrong.') {
  const validationErrors = error?.response?.data?.errors

  if (validationErrors) {
    return Object.values(validationErrors).flat().join(' ')
  }

  return error?.response?.data?.message || error?.message || fallback
}
