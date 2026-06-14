import { useState, useEffect, useCallback } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import AdminGuard from './AdminGuard'
import Dashboard from './tabs/Dashboard'
import Bookings from './tabs/Bookings'
import Catalog from './tabs/Catalog'
import Restaurants from './tabs/Restaurants'
import Homestays from './tabs/Homestays'
import Riders from './tabs/Riders'
import RoutesTab from './tabs/Routes'
import Images from './tabs/Images'
import GroupTypes from './tabs/GroupTypes'
import Activity from './tabs/Activity'
import { getPlaces, getCircuits, getHomestays } from '../engines/dataService'
import { clearCache } from '../engines/dataService'
import { fetchAllBookings } from '../engines/bookingSyncService'
import { loadActivityLog } from '../engines/storageService'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [places, setPlaces] = useState([])
  const [circuits, setCircuits] = useState([])
  const [homestays, setHomestays] = useState([])
  const [bookings, setBookings] = useState([])
  const [activityLog, setActivityLog] = useState(() => loadActivityLog())
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [p, c, h, b] = await Promise.all([
        getPlaces(), getCircuits(), getHomestays(), fetchAllBookings(),
      ])
      setPlaces(p || [])
      setCircuits(c || [])
      setHomestays(h || [])
      setBookings(b || [])
      setActivityLog(loadActivityLog())
    } catch (e) {
      console.error('Admin load error:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData, refreshKey])

  const refresh = useCallback(async () => {
    clearCache()
    setRefreshKey(k => k + 1)
  }, [])

  return (
    <AdminGuard>
      <HashRouter>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar onMenuClick={() => setSidebarOpen(true)} onSync={refresh} />
            <main className="flex-1 overflow-auto p-4 lg:p-6">
              <Routes>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<Dashboard bookings={bookings} loading={loading} />} />
                <Route path="/admin/bookings" element={<Bookings bookings={bookings} places={places} onRefresh={loadData} />} />
                <Route path="/admin/catalog" element={<Catalog places={places} circuits={circuits} />} />
                <Route path="/admin/restaurants" element={<Restaurants />} />
                <Route path="/admin/homestays" element={<Homestays homestays={homestays} circuits={circuits} />} />
                <Route path="/admin/riders" element={<Riders />} />
                <Route path="/admin/routes" element={<RoutesTab places={places} circuits={circuits} />} />
                <Route path="/admin/images" element={<Images circuits={circuits} />} />
                <Route path="/admin/groups" element={<GroupTypes />} />
                <Route path="/admin/activity" element={<Activity log={activityLog} />} />
              </Routes>
            </main>
          </div>
        </div>
      </HashRouter>
    </AdminGuard>
  )
}
