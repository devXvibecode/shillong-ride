import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { CalendarCheck, IndianRupee, CheckCircle2, Clock } from 'lucide-react'
import StatCard from '../components/StatCard'

function fmtShort(n) { return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }) }
function getRevenue(b) { return b.priceBreakdown?.total || b.priceBreakdown?.groupTotal || 0 }

export default function Dashboard({ bookings, loading }) {
  const stats = useMemo(() => {
    const total = bookings.length
    const pending = bookings.filter(b => b.status === 'pending').length
    const active = bookings.filter(b => b.status === 'approved' || b.status === 'assigned').length
    const completed = bookings.filter(b => b.status === 'completed').length
    const cancelled = bookings.filter(b => b.status === 'cancelled' || b.status === 'rejected').length
    const totalRevenue = bookings.reduce((s, b) => s + getRevenue(b), 0)
    return { total, pending, active, completed, cancelled, totalRevenue }
  }, [bookings])

  const monthlyData = useMemo(() => {
    const months = {}
    bookings.forEach(b => {
      if (!b.createdAt) return
      const m = new Date(b.createdAt).toLocaleString('en-IN', { month: 'short', year: '2-digit' })
      months[m] = (months[m] || 0) + getRevenue(b)
    })
    return Object.entries(months).slice(-6).map(([month, revenue]) => ({ month, revenue }))
  }, [bookings])

  const statusData = useMemo(() => [
    { name: 'Pending', value: stats.pending, color: '#D97706' },
    { name: 'Active', value: stats.active, color: '#2563EB' },
    { name: 'Completed', value: stats.completed, color: '#059669' },
    { name: 'Cancelled', value: stats.cancelled, color: '#DC2626' },
  ].filter(d => d.value > 0), [stats])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-slate-200 rounded-xl animate-pulse" />)}
        </div>
        <div className="h-64 bg-slate-200 rounded-xl animate-pulse" />
        <div className="h-48 bg-slate-200 rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Bookings" value={stats.total} icon={CalendarCheck} color="blue" />
        <StatCard label="Total Revenue" value={fmtShort(stats.totalRevenue)} icon={IndianRupee} color="green" />
        <StatCard label="Completed Trips" value={stats.completed} icon={CheckCircle2} color="purple" />
        <StatCard label="Pending / Active" value={stats.pending + stats.active} icon={Clock} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Monthly Revenue (Last 6)</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#2563EB" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 text-center py-12">No revenue data yet</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Booking Status</h3>
          {statusData.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-3">
                {statusData.map(s => (
                  <div key={s.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-slate-600">{s.name}</span>
                    <span className="font-semibold text-slate-800">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No bookings yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
