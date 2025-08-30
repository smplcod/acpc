export async function loadAll() {
  const [events, activity, users] = await Promise.all([
    fetch('/mocks/events.json').then(r => r.json()),
    fetch('/mocks/activity.json').then(r => r.json()),
    fetch('/mocks/users.json').then(r => r.json())
  ])
  return { events, activity, users }
}

export function dateRange(start, end) {
  const dates = []
  const d = new Date(start)
  const endDate = new Date(end)
  while (d <= endDate) {
    dates.push(d.toISOString().slice(0, 10))
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return dates
}

export function groupEventsByDate(events) {
  const map = {}
  const firstSeen = {}
  events.forEach(e => {
    const date = e.ts.slice(0, 10)
    if (!map[date]) map[date] = { userIds: new Set(), types: {}, errorsByPage: {} }
    map[date].userIds.add(e.userId)
    map[date].types[e.type] = (map[date].types[e.type] || 0) + 1
    if (e.type === 'error') {
      map[date].errorsByPage[e.page] = (map[date].errorsByPage[e.page] || 0) + 1
    }
    if (!firstSeen[e.userId] || firstSeen[e.userId] > date) firstSeen[e.userId] = date
  })
  return { map, firstSeen }
}

export function computeDAU(dates, eventMap) {
  return dates.map(d => (eventMap[d] ? eventMap[d].userIds.size : 0))
}

export function computeWindowAU(dates, eventMap, window) {
  const result = []
  for (let i = 0; i < dates.length; i++) {
    const start = Math.max(0, i - window + 1)
    const users = new Set()
    for (let j = start; j <= i; j++) {
      const d = dates[j]
      if (eventMap[d]) eventMap[d].userIds.forEach(u => users.add(u))
    }
    result.push(users.size)
  }
  return result
}

export function computeSMA(values, window) {
  const res = []
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1)
    let sum = 0
    let count = 0
    for (let j = start; j <= i; j++) {
      sum += values[j]
      count++
    }
    res.push(count > 0 ? sum / count : 0)
  }
  return res
}

export function computeNewReturning(dates, events, firstSeen) {
  const map = {}
  events.forEach(e => {
    const date = e.ts.slice(0, 10)
    if (!map[date]) map[date] = { new: new Set(), returning: new Set() }
    if (firstSeen[e.userId] === date) map[date].new.add(e.userId)
    else map[date].returning.add(e.userId)
  })
  return dates.map(d => ({
    new: map[d] ? map[d].new.size : 0,
    returning: map[d] ? map[d].returning.size : 0
  }))
}

export function loginsByWeekday(events) {
  const counts = Array(7).fill(0)
  events.forEach(e => {
    if (e.type === 'login') {
      const day = new Date(e.ts).getUTCDay() // 0 Sun
      const idx = (day + 6) % 7 // 0 Mon
      counts[idx]++
    }
  })
  return counts
}

export function subsPerDay(dates, eventMap) {
  return dates.map(d => (eventMap[d] ? eventMap[d].types.subscribe || 0 : 0))
}

export function funnelTotals(eventMap) {
  const totals = { visit: 0, signup: 0, verify: 0, login: 0, first_action: 0, subscribe: 0 }
  Object.values(eventMap).forEach(day => {
    Object.keys(totals).forEach(t => {
      totals[t] += day.types[t] || 0
    })
  })
  return totals
}

export function errorEventsByPage(eventMap) {
  const pageCounts = {}
  Object.values(eventMap).forEach(day => {
    Object.entries(day.errorsByPage).forEach(([page, count]) => {
      pageCounts[page] = (pageCounts[page] || 0) + count
    })
  })
  return Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
}

export function activityMapByDate(activity) {
  const map = {}
  activity.forEach(a => {
    map[a.date] = a
  })
  return map
}

export function conversionCalc(dates, activityMap) {
  return dates.map(d => {
    const a = activityMap[d]
    return a && a.visits > 0 ? a.signups / a.visits : 0
  })
}

export function errorRate(dates, activityMap) {
  return dates.map(d => {
    const a = activityMap[d]
    return a && a.sessions > 0 ? a.errors / a.sessions : 0
  })
}

export function sessionsPerDay(dates, activityMap) {
  return dates.map(d => (activityMap[d] ? activityMap[d].sessions : 0))
}

export function signupsPerDay(dates, activityMap) {
  return dates.map(d => (activityMap[d] ? activityMap[d].signups : 0))
}

export function visitsPerDay(dates, activityMap) {
  return dates.map(d => (activityMap[d] ? activityMap[d].visits : 0))
}

export function loginsPerDay(dates, activityMap) {
  return dates.map(d => (activityMap[d] ? activityMap[d].logins : 0))
}

export function errorsByCodePerDay(dates, activityMap) {
  const codes = {}
  dates.forEach(d => {
    const a = activityMap[d]
    if (a && a.errorsByCode) {
      Object.keys(a.errorsByCode).forEach(code => {
        if (!codes[code]) codes[code] = []
      })
    }
  })
  const codeNames = Object.keys(codes)
  codeNames.forEach(code => {
    codes[code] = dates.map(d => (activityMap[d] && activityMap[d].errorsByCode ? activityMap[d].errorsByCode[code] || 0 : 0))
  })
  return { codes: codeNames, data: codes }
}

export function errorTotalsByCode(activity) {
  const totals = {}
  activity.forEach(a => {
    Object.entries(a.errorsByCode || {}).forEach(([code, count]) => {
      totals[code] = (totals[code] || 0) + count
    })
  })
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1])
  let cumulative = 0
  const totalErrors = entries.reduce((s, [, c]) => s + c, 0)
  const cumPct = entries.map(([code, count]) => {
    cumulative += count
    return { code, count, pct: (cumulative / totalErrors) * 100 }
  })
  return { entries, cumPct }
}

export function retentionCohorts(users) {
  const cohorts = {}
  users.forEach(u => {
    const created = u.createdAt
    const week = weekKey(created)
    if (!cohorts[week]) cohorts[week] = { total: 0, d7: 0, d14: 0, d28: 0 }
    cohorts[week].total++
    const createdDate = new Date(created)
    const last = new Date(u.lastActiveAt)
    if (last - createdDate >= 7 * 86400000) cohorts[week].d7++
    if (last - createdDate >= 14 * 86400000) cohorts[week].d14++
    if (last - createdDate >= 28 * 86400000) cohorts[week].d28++
  })
  const weeks = Object.keys(cohorts).sort()
  const data = weeks.map(w => cohorts[w])
  return { weeks, data }
}

function weekKey(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z')
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

export function platformDistribution(users) {
  const dims = {
    device: {},
    os: {},
    browser: {}
  }
  users.forEach(u => {
    dims.device[u.device] = (dims.device[u.device] || 0) + 1
    dims.os[u.os] = (dims.os[u.os] || 0) + 1
    dims.browser[u.browser] = (dims.browser[u.browser] || 0) + 1
  })
  return dims
}

export function subscriptionSegments(events, users) {
  const userMap = {}
  users.forEach(u => (userMap[u.id] = u))
  const seg = { plan: {}, utmSource: {}, country: {} }
  events.forEach(e => {
    if (e.type === 'subscribe') {
      const u = userMap[e.userId]
      if (!u) return
      seg.plan[u.plan] = (seg.plan[u.plan] || 0) + 1
      seg.utmSource[u.utmSource] = (seg.utmSource[u.utmSource] || 0) + 1
      seg.country[u.country] = (seg.country[u.country] || 0) + 1
    }
  })
  return seg
}

export function cumulativeUsers(users) {
  const dates = users.map(u => u.createdAt).sort()
  const start = dates[0]
  const end = dates[dates.length - 1]
  const range = dateRange(start, end)
  const counts = {}
  users.forEach(u => {
    counts[u.createdAt] = (counts[u.createdAt] || 0) + 1
  })
  let total = 0
  const cum = range.map(d => {
    total += counts[d] || 0
    return total
  })
  return { dates: range, values: cum }
}

