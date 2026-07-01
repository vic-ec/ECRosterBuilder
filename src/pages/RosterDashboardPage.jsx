import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const STATUS_STYLES = {
  draft:     'bg-flagAmber-bg text-flagAmber',
  published: 'bg-success-bg text-success',
  archived:  'bg-canvas-sunken text-ink-muted',
}

const STATUS_LABELS = {
  draft:     'Draft',
  published: 'Published',
  archived:  'Archived',
}

export default function RosterDashboardPage() {
  const navigate = useNavigate()
  const [rosters, setRosters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadRosters()
  }, [])

  async function loadRosters() {
    setLoading(true)
    const { data, error } = await supabase
      .from('roster_months')
      .select('*')
      .order('year', { ascending: false })
      .order('month', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setRosters(data)
    }
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Rosters</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Generate, edit, and publish monthly shift rosters
          </p>
        </div>
        <button
          onClick={() => navigate('/roster/generate')}
          className="btn-primary"
        >
          <PlusIcon className="h-4 w-4" />
          Generate new roster
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="card mb-4 border-flagRed bg-flagRed-bg p-4">
          <p className="text-sm text-flagRed">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <p className="text-sm text-ink-muted">Loading rosters…</p>
      )}

      {/* Empty state */}
      {!loading && !error && rosters.length === 0 && (
        <div className="card p-12 text-center">
          <CalendarIcon className="mx-auto mb-3 h-10 w-10 text-ink-muted opacity-40" />
          <p className="font-medium text-ink">No rosters yet</p>
          <p className="mt-1 text-sm text-ink-muted">
            Click "Generate new roster" to create your first one.
          </p>
          <button
            onClick={() => navigate('/roster/generate')}
            className="btn-primary mx-auto mt-5"
          >
            Generate new roster
          </button>
        </div>
      )}

      {/* Roster list */}
      {!loading && rosters.length > 0 && (
        <div className="card divide-y divide-slate-line overflow-hidden">
          {rosters.map((roster) => (
            <button
              key={roster.id}
              onClick={() => navigate(`/roster/${roster.id}`)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-canvas-sunken"
            >
              <div>
                <p className="font-medium text-ink">
                  {MONTH_NAMES[roster.month]} {roster.year}
                </p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  Created {new Date(roster.created_at).toLocaleDateString('en-ZA', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                  {roster.carry_forward && ' · carry-forward used'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[roster.status]}`}>
                  {STATUS_LABELS[roster.status]}
                </span>
                <ChevronRightIcon className="h-4 w-4 text-ink-muted" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function PlusIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )
}
function CalendarIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path strokeLinecap="round" d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  )
}
function ChevronRightIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}
