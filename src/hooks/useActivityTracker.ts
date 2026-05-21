import { useEffect, useState } from 'react'
import { startSession, endSession, getStats, getLiveMs } from '../lib/activityTracker'
import type { ActivityStats } from '../lib/activityTracker'

export function useActivityTracker(): ActivityStats {
  const [stats, setStats] = useState<ActivityStats>(() => getStats(getLiveMs()))

  useEffect(() => {
    startSession()

    // Refresh stats every second so the displayed time ticks up live
    const ticker = setInterval(() => {
      setStats(getStats(getLiveMs()))
    }, 1000)

    function handleVisibility() {
      if (document.visibilityState === 'hidden') {
        // Tab hidden / phone locked — end the current session
        endSession()
        setStats(getStats())
      } else {
        // Tab visible again — start a new session
        startSession()
        setStats(getStats(getLiveMs()))
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(ticker)
      endSession()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return stats
}
