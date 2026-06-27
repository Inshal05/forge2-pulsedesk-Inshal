import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <BarChart3 size={24} aria-hidden="true" />
          <span>PulseDesk</span>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/" onClick={() => setSidebarOpen(false)}>
            <LayoutDashboard size={18} aria-hidden="true" />
            Dashboard
          </NavLink>
          <NavLink to="/tickets" onClick={() => setSidebarOpen(false)}>
            <ClipboardList size={18} aria-hidden="true" />
            Tickets
          </NavLink>
          <NavLink to="/tickets/new" onClick={() => setSidebarOpen(false)}>
            <Plus size={18} aria-hidden="true" />
            Create Ticket
          </NavLink>
        </nav>
      </aside>

      {sidebarOpen ? (
        <button
          className="sidebar-scrim"
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            type="button"
            aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setSidebarOpen((open) => !open)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="topbar-user">
            <span>{user?.name || user?.email || 'User'}</span>
            <small>{user?.role || 'Support'}</small>
          </div>

          <button className="button button-ghost" type="button" onClick={handleLogout}>
            <LogOut size={18} aria-hidden="true" />
            Logout
          </button>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
