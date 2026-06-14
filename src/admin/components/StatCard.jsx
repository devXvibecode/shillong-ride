import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ label, value, trend, trendLabel, icon: Icon, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  }

  const iconColors = {
    blue: 'bg-blue-600', green: 'bg-green-600', yellow: 'bg-yellow-600',
    red: 'bg-red-600', purple: 'bg-purple-600',
  }

  return (
    <div className={`rounded-xl border p-5 ${colors[color] || colors.blue}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</p>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg ${iconColors[color]} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      {trend != null && (
        <div className="flex items-center gap-1 text-xs">
          {trend > 0 ? <TrendingUp className="w-3.5 h-3.5 text-green-600" /> : <TrendingDown className="w-3.5 h-3.5 text-red-600" />}
          <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
            {Math.abs(trend)}%
          </span>
          {trendLabel && <span className="opacity-60 ml-1">{trendLabel}</span>}
        </div>
      )}
    </div>
  )
}
