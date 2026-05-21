/**
 * Lightweight session tracker.
 * Sessions are stored per-user in localStorage as an array of { date, duration } records.
 * The current in-progress session lives in module memory and is flushed on endSession().
 */

export type SessionRecord = {
  date: string    // 'YYYY-MM-DD'
  duration: number  // ms
}

export type ActivityStats = {
  totalMs: number
  daysLoggedIn: number
  avgMs: number
  sessionCount: number
}

let _userId = 'guest'
let _sessionStart: number | null = null

export function setActivityUser(uid: string) {
  _userId = uid
}

function key() {
  return `sb-activity-${_userId}`
}

function load(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(key())
    return raw ? (JSON.parse(raw) as SessionRecord[]) : []
  } catch {
    return []
  }
}

function persist(sessions: SessionRecord[]) {
  localStorage.setItem(key(), JSON.stringify(sessions))
}

export function startSession() {
  _sessionStart = Date.now()
}

/** Returns the current in-progress session duration in ms (0 if not started) */
export function getLiveMs(): number {
  return _sessionStart ? Date.now() - _sessionStart : 0
}

export function endSession() {
  if (!_sessionStart) return
  const duration = Date.now() - _sessionStart
  _sessionStart = null
  if (duration < 2000) return  // ignore sub-2-second blips
  const date = new Date().toISOString().split('T')[0]
  const sessions = load()
  persist([...sessions, { date, duration }])
}

/** Compute stats, optionally including the live in-progress session. */
export function getStats(liveMs = 0): ActivityStats {
  const sessions = load()
  const totalMs = sessions.reduce((sum, s) => sum + s.duration, 0) + liveMs
  const days = new Set(sessions.map(s => s.date))
  if (liveMs > 0) days.add(new Date().toISOString().split('T')[0])
  const sessionCount = sessions.length + (liveMs > 0 ? 1 : 0)
  const avgMs = sessionCount > 0 ? totalMs / sessionCount : 0
  return { totalMs, daysLoggedIn: days.size, avgMs, sessionCount }
}

/** Format milliseconds as "Xh Ym Zs" */
export function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}
