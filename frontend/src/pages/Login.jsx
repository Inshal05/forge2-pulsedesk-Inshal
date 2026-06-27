import { LogIn } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../utils/formatters'

function Login() {
  const [email, setEmail] = useState('admin@acme.test')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destination = location.state?.from?.pathname || '/'

  if (isAuthenticated) {
    return <Navigate to={destination} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      await login({ email: email.trim(), password })
      navigate(destination, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to sign in.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="login-card" aria-labelledby="login-title">
      <div className="login-mark">
        <LogIn size={30} aria-hidden="true" />
      </div>
      <h1 id="login-title">Sign in to PulseDesk</h1>
      <p>Manage support tickets, priorities, and customer follow-up.</p>

      <form onSubmit={handleSubmit}>
        <ErrorMessage message={error} />

        <label className="field">
          <span>Email</span>
          <input
            autoComplete="email"
            inputMode="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>

        <button className="button button-primary button-full" disabled={isLoading} type="submit">
          <LogIn size={18} aria-hidden="true" />
          {isLoading ? 'Signing in' : 'Sign in'}
        </button>
      </form>
    </section>
  )
}

export default Login
