import { useState, useEffect } from 'react'

function toDay(dateStr) {
  return new Date(dateStr).toISOString().slice(0, 10)
}

function daysInRange(start, end) {
  const days = []
  let cur = new Date(start)
  const endDate = new Date(end)
  while (cur <= endDate) {
    days.push(cur.toISOString().slice(0, 10))
    cur.setUTCDate(cur.getUTCDate() + 1)
  }
  return days
}

export function useMetrics() {
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('/mocks/events.json').then(r => r.json()),
      fetch('/mocks/activity.json').then(r => r.json()),
      fetch('/mocks/users.json').then(r => r.json())
    ]).then(([events, activity, users]) => {
      const data = computeMetrics(events, activity, users)
      setMetrics(data)
    })
  }, [])

  return metrics
}

function computeMetrics(events, activity, users) {
  const eventDays = events.map(e => toDay(e.ts))
  const activityDays = activity.map(a => a.date)
  const allDays = daysInRange(
    eventDays.concat(activityDays).sort()[0],
    eventDays.concat(activityDays).sort().slice(-1)[0]
  )

  const eventsByDay = {}
  events.forEach(e => {
    const d = toDay(e.ts)
    ;(eventsByDay[d] ||= []).push(e)
  })

  const activityByDay = {}
  activity.forEach(a => {
    activityByDay[a.date] = a
  })

  allDays.forEach(d => {
    if (!activityByDay[d])
      activityByDay[d] = {
        date: d,
        visits: 0,
        signups: 0,
        logins: 0,
        sessions: 0,
        errors: 0,
        conversion: 0,
        errorsByCode: {}
      }
    if (!eventsByDay[d]) eventsByDay[d] = []
  })

  const dau = allDays.map(d => new Set(eventsByDay[d].map(e => e.userId)).size)

  const userFirstDay = {}
  events.forEach(e => {
    const d = toDay(e.ts)
    if (!userFirstDay[e.userId] || userFirstDay[e.userId] > d)
      userFirstDay[e.userId] = d
  })

  const wau = allDays.map((d, idx) => {
    const start = Math.max(0, idx - 6)
    const ids = new Set()
    for (let i = start; i <= idx; i++) {
      eventsByDay[allDays[i]].forEach(e => ids.add(e.userId))
    }
    return ids.size
  })

  const mau = allDays.map((d, idx) => {
    const start = Math.max(0, idx - 29)
    const ids = new Set()
    for (let i = start; i <= idx; i++) {
      eventsByDay[allDays[i]].forEach(e => ids.add(e.userId))
    }
    return ids.size
  })

  const dauSMA7 = dau.map((_, idx) => {
    const start = Math.max(0, idx - 6)
    const slice = dau.slice(start, idx + 1)
    const sum = slice.reduce((a, b) => a + b, 0)
    return +(sum / slice.length).toFixed(2)
  })

  const newReturning = allDays.map(d => {
    const users = Array.from(new Set(eventsByDay[d].map(e => e.userId)))
    let n = 0
    users.forEach(u => {
      if (userFirstDay[u] === d) n++
    })
    return { new: n, returning: users.length - n }
  })

  const visits = allDays.map(d => activityByDay[d].visits)
  const signups = allDays.map(d => activityByDay[d].signups)
  const logins = allDays.map(d => activityByDay[d].logins)

  const sessions = allDays.map(d => activityByDay[d].sessions)
  const conversion = allDays.map(d => {
    const a = activityByDay[d]
    return a.visits ? +(a.signups / a.visits).toFixed(3) : 0
  })
  const errorRate = allDays.map(d => {
    const a = activityByDay[d]
    return a.sessions ? +(a.errors / a.sessions).toFixed(3) : 0
  })

  const stickiness = allDays.map((d, idx) => (mau[idx] ? +(dau[idx] / mau[idx]).toFixed(3) : 0))

  const loginsByWeekday = Array(7).fill(0)
  events
    .filter(e => e.type === 'login')
    .forEach(e => {
      const wd = new Date(e.ts).getUTCDay()
      loginsByWeekday[wd]++
    })

  const errorsByCodePerDay = {}
  const codeTotals = {}
  allDays.forEach(d => {
    const codes = activityByDay[d].errorsByCode
    errorsByCodePerDay[d] = {}
    Object.keys(codes).forEach(code => {
      errorsByCodePerDay[d][code] = codes[code]
      codeTotals[code] = (codeTotals[code] || 0) + codes[code]
    })
  })

  const errorEventsByPage = {}
  events
    .filter(e => e.type === 'error')
    .forEach(e => {
      errorEventsByPage[e.page] = (errorEventsByPage[e.page] || 0) + 1
    })
  const errorPagesTop = Object.entries(errorEventsByPage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const funnelTypes = ['visit', 'signup', 'verify', 'login', 'first_action', 'subscribe']
  const funnelTotals = {}
  funnelTypes.forEach(t => {
    funnelTotals[t] = events.filter(e => e.type === t).length
  })

  const subsPerDayMap = {}
  events
    .filter(e => e.type === 'subscribe')
    .forEach(e => {
      const d = toDay(e.ts)
      subsPerDayMap[d] = (subsPerDayMap[d] || 0) + 1
    })
  const subsPerDay = allDays.map(d => subsPerDayMap[d] || 0)

  const subsSegments = { plan: {}, utmSource: {}, country: {} }
  events
    .filter(e => e.type === 'subscribe')
    .forEach(e => {
      const u = users.find(u => u.id === e.userId) || {}
      ;['plan', 'utmSource', 'country'].forEach(k => {
        const val = u[k] || 'unknown'
        subsSegments[k][val] = (subsSegments[k][val] || 0) + 1
      })
    })

  function startOfWeek(dateStr) {
    const d = new Date(dateStr)
    const day = d.getUTCDay()
    const diff = (day + 6) % 7
    d.setUTCDate(d.getUTCDate() - diff)
    return d.toISOString().slice(0, 10)
  }

  const retentionMap = {}
  users.forEach(u => {
    const week = startOfWeek(u.createdAt)
    ;(retentionMap[week] ||= { total: 0, d7: 0, d14: 0, d28: 0 })
    retentionMap[week].total++
    const created = new Date(u.createdAt)
    const last = new Date(u.lastActiveAt)
    if (last - created >= 7 * 864e5) retentionMap[week].d7++
    if (last - created >= 14 * 864e5) retentionMap[week].d14++
    if (last - created >= 28 * 864e5) retentionMap[week].d28++
  })
  const retention = Object.entries(retentionMap).map(([week, v]) => ({
    week,
    d7: +(v.d7 / v.total).toFixed(2),
    d14: +(v.d14 / v.total).toFixed(2),
    d28: +(v.d28 / v.total).toFixed(2)
  }))

  const platform = { device: {}, os: {}, browser: {} }
  users.forEach(u => {
    ;['device', 'os', 'browser'].forEach(k => {
      const val = u[k] || 'unknown'
      platform[k][val] = (platform[k][val] || 0) + 1
    })
  })

  const signupsPerDay = allDays.map(d => activityByDay[d].signups)

  const cumulativeUsers = (() => {
    const dates = users.map(u => u.createdAt).sort()
    if (!dates.length) return []
    const days = daysInRange(dates[0], dates[dates.length - 1])
    let total = 0
    const counts = days.map(d => {
      users.forEach(u => {
        if (u.createdAt === d) total++
      })
      return total
    })
    return { days, counts }
  })()

  return {
    days: allDays,
    dau,
    wau,
    mau,
    dauSMA7,
    newReturning,
    visits,
    signups,
    logins,
    sessions,
    conversion,
    errorRate,
    stickiness,
    loginsByWeekday,
    errorsByCodePerDay,
    codeTotals,
    errorPagesTop,
    funnelTotals,
    subsPerDay,
    subsSegments,
    retention,
    platform,
    signupsPerDay,
    cumulativeUsers
  }
}

