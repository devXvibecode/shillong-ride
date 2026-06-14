import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, CalendarCheck, MapPin, Utensils, Home, Bike,
  Route, Image, Users, Activity, X, ChefHat
} from 'lucide-react'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/admin/catalog', label: 'Catalog', icon: MapPin },
  { to: '/admin/restaurants', label: 'Restaurants', icon: Utensils },
  { to: '/admin/homestays', label: 'Homestays', icon: Home },
  { to: '/admin/riders', label: 'Riders', icon: Bike },
  { to: '/admin/routes', label: 'Routes', icon: Route },
  { to: '/admin/images', label: 'Images', icon: Image },
  { to: '/admin/groups', label: 'Groups', icon: Users },
  { to: '/admin/activity', label: 'Activity', icon: Activity },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`
        fixed top-0 left-0 h-full w-56 bg-white border-r border-slate-200 z-50
        transform transition-transform duration-200
        lg:translate-x-0 lg:static lg:z-auto
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200">
          <span className="text-sm font-bold text-slate-800">ShillongRide</span>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-2 space-y-0.5 overflow-y-auto" style={{ height: 'calc(100% - 56px)' }}>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`
              }
            >
              <link.icon className="w-4.5 h-4.5" />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
