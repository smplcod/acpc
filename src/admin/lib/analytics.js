import { parseISO, addDays, formatISO } from 'date-fns'

function dateKey(ts) {
  return ts.slice(0, 10)
}

export function prepareEventMetrics(events) {
  const byDate = {}
  const firstSeen = {}
  const funnel = { visit: 0, signup: 0, verify: 0, login: 0, first_action: 0, subscribe: 0 }
  const subsPerDay = {}
  const errorsByPage = {}
  const loginsByWeekday = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 }

  events.forEach(ev => {
    const d = dateKey(ev.ts)
    if (!byDate[d]) byDate[d] = { users: new Set(), events: [] }
    byDate[d].users.add(ev.userId)
    byDate[d].events.push(ev)
    if (funnel[ev.type] !== undefined) funnel[ev.type]++
    if (ev.type === 'subscribe') subsPerDay[d] = (subsPerDay[d] || 0) + 1
    if (ev.type === 'error') {
      errorsByPage[ev.page] = (errorsByPage[ev.page] || 0) + 1
    }
    if (ev.type === 'login') {
      const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(ev.ts).getUTCDay()]
      loginsByWeekday[wd] = (loginsByWeekday[wd] || 0) + 1
    }
  })

  const dates = Object.keys(byDate).sort()
  const daily = dates.map(d => ({ date: d, dau: byDate[d].users.size, users: byDate[d].users }))

  daily.forEach((d, i) => {
    const wauSet = new Set()
    for (let j = Math.max(0, i - 6); j <= i; j++) daily[j].users.forEach(u => wauSet.add(u))
    d.wau = wauSet.size
    const mauSet = new Set()
    for (let j = Math.max(0, i - 29); j <= i; j++) daily[j].users.forEach(u => mauSet.add(u))
    d.mau = mauSet.size
    const slice = daily.slice(Math.max(0, i - 6), i + 1)
    d.sma7 = slice.reduce((sum, v) => sum + v.dau, 0) / slice.length
  })

  daily.forEach(d => {
    let n = 0
    let r = 0
    d.users.forEach(u => {
      if (firstSeen[u]) r++
      else {
        firstSeen[u] = d.date
        n++
      }
    })
    d.newUsers = n
    d.returning = r
  })

  const weekdayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const loginsByWeek = weekdayOrder.map(w => ({ day: w, value: loginsByWeekday[w] }))

  const topPages = Object.entries(errorsByPage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([page, value]) => ({ page, value }))

  return { daily, subsPerDay, funnel, loginsByWeek, errorsByPage: topPages }
}

export function prepareActivityMetrics(activity) {
  const daily = activity.map(a => ({
    date: a.date,
    sessions: a.sessions,
    signups: a.signups,
    visits: a.visits,
    logins: a.logins,
    errors: a.errors,
    errorsByCode: a.errorsByCode || {},
    conversion: a.visits ? a.signups / a.visits : 0,
    errorRate: a.sessions ? a.errors / a.sessions : 0
  }))

  const errorCodes = {}
  daily.forEach(d => {
    Object.entries(d.errorsByCode).forEach(([code, val]) => {
      errorCodes[code] = (errorCodes[code] || 0) + val
    })
  })

  return { daily, errorCodes }
}

export function prepareRetention(users) {
  const cohorts = {}
  users.forEach(u => {
    const created = parseISO(u.createdAt)
    const weekStart = formatISO(addDays(created, -((created.getUTCDay() + 6) % 7)), { representation: 'date' })
    if (!cohorts[weekStart]) cohorts[weekStart] = { total: 0, d7: 0, d14: 0, d28: 0 }
    cohorts[weekStart].total++
    const last = parseISO(u.lastActiveAt)
    const diff = (last - created) / 86400000
    if (diff >= 7) cohorts[weekStart].d7++
    if (diff >= 14) cohorts[weekStart].d14++
    if (diff >= 28) cohorts[weekStart].d28++
  })

  return Object.entries(cohorts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([week, c]) => ({
      week,
      d7: (c.d7 / c.total) * 100,
      d14: (c.d14 / c.total) * 100,
      d28: (c.d28 / c.total) * 100
    }))
}

export function cumulativeUsers(users) {
  const counts = {}
  users.forEach(u => {
    counts[u.createdAt] = (counts[u.createdAt] || 0) + 1
  })
  const dates = Object.keys(counts).sort()
  let sum = 0
  return dates.map(d => {
    sum += counts[d]
    return { date: d, value: sum }
  })
}

export function subscriptionSegments(subEvents, users) {
  const userMap = {}
  users.forEach(u => {
    userMap[u.id] = u
  })
  const plan = {}
  const utm = {}
  const country = {}
  subEvents.forEach(ev => {
    const u = userMap[ev.userId] || {}
    plan[u.plan] = (plan[u.plan] || 0) + 1
    utm[u.utmSource] = (utm[u.utmSource] || 0) + 1
    country[u.country] = (country[u.country] || 0) + 1
  })
  const toPct = obj => {
    const total = Object.values(obj).reduce((a, b) => a + b, 0)
    return Object.entries(obj).map(([k, v]) => ({ name: k, value: (v / total) * 100 }))
  }
  return { plan: toPct(plan), utm: toPct(utm), country: toPct(country) }
}

export function dateExtent(dates) {
  if (dates.length === 0) return ''
  return `${dates[0]} to ${dates[dates.length - 1]}`
}

