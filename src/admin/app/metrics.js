
function formatDate(date) {
  return date.toISOString().slice(0, 10)
}

function dateRange(start, end) {
  const res = []
  const d = new Date(start)
  const e = new Date(end)
  while (d <= e) {
    res.push(formatDate(d))
    d.setDate(d.getDate() + 1)
  }
  return res
}

export async function loadMetrics() {
  const [events, activity, users] = await Promise.all([
    fetch('/mocks/events.json').then(r => r.json()),
    fetch('/mocks/activity.json').then(r => r.json()),
    fetch('/mocks/users.json').then(r => r.json())
  ])

  const eventDates = events.map(e => e.ts.slice(0, 10))
  const activityDates = activity.map(a => a.date)
  const minDate = [ ...eventDates, ...activityDates ].sort()[0]
  const maxDate = [ ...eventDates, ...activityDates ].sort().slice(-1)[0]
  const dates = dateRange(minDate, maxDate)

  const eventsByDate = {}
  events.forEach(e => {
    const d = e.ts.slice(0, 10)
    if (!eventsByDate[d]) eventsByDate[d] = []
    eventsByDate[d].push(e)
  })

  const activityByDate = {}
  activity.forEach(a => {
    activityByDate[a.date] = a
  })

  const daily = []
  const seenUsers = new Set()
  dates.forEach(date => {
    const dayEvents = eventsByDate[date] || []
    const dauUsers = new Set(dayEvents.map(e => e.userId))
    const dau = dauUsers.size
    let newUsers = 0
    let returningUsers = 0
    dauUsers.forEach(u => {
      if (seenUsers.has(u)) returningUsers++
      else {
        newUsers++
        seenUsers.add(u)
      }
    })
    daily.push({ date, dau, newUsers, returningUsers })
  })

  // WAU, MAU, SMA7
  dates.forEach((date, i) => {
    const start7 = Math.max(0, i - 6)
    const wauSet = new Set()
    for (let j = start7; j <= i; j++) {
      (eventsByDate[dates[j]] || []).forEach(e => wauSet.add(e.userId))
    }
    daily[i].wau = wauSet.size

    const start30 = Math.max(0, i - 29)
    const mauSet = new Set()
    for (let j = start30; j <= i; j++) {
      (eventsByDate[dates[j]] || []).forEach(e => mauSet.add(e.userId))
    }
    daily[i].mau = mauSet.size

    let sum = 0
    let count = 0
    for (let j = start7; j <= i; j++) {
      sum += daily[j].dau
      count++
    }
    daily[i].sma7 = count ? sum / count : 0
  })

  // activity metrics
  daily.forEach(d => {
    const a = activityByDate[d.date] || {}
    d.visits = a.visits || 0
    d.signups = a.signups || 0
    d.logins = a.logins || 0
    d.sessions = a.sessions || 0
    d.errors = a.errors || 0
    d.conversion = a.conversion || 0
    d.conversion_calc = d.visits ? d.signups / d.visits : 0
    d.error_rate = d.sessions ? d.errors / d.sessions : 0
    d.errorsByCode = a.errorsByCode || {}
  })

  // subs per day
  daily.forEach(d => {
    const subs = (eventsByDate[d.date] || []).filter(e => e.type === 'subscribe')
    d.subs = subs.length
  })

  // logins by weekday
  const loginsByWeekday = Array(7).fill(0)
  events.filter(e => e.type === 'login').forEach(e => {
    const wd = new Date(e.ts).getUTCDay() // 0 Sun
    const idx = (wd + 6) % 7 // make Monday=0
    loginsByWeekday[idx]++
  })

  // error codes totals
  const errorTotals = {}
  activity.forEach(a => {
    Object.entries(a.errorsByCode || {}).forEach(([code, val]) => {
      errorTotals[code] = (errorTotals[code] || 0) + val
    })
  })

  // errors by page
  const errorPages = {}
  events.filter(e => e.type === 'error').forEach(e => {
    errorPages[e.page] = (errorPages[e.page] || 0) + 1
  })
  const errorPagesTop = Object.entries(errorPages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  // active users last 30 days
  const activeIds = new Set()
  const startIdx = Math.max(0, dates.length - 30)
  for (let i = startIdx; i < dates.length; i++) {
    (eventsByDate[dates[i]] || []).forEach(e => activeIds.add(e.userId))
  }
  const userMap = {}
  users.forEach(u => {
    userMap[u.id] = u
  })
  const profileDist = { device: {}, os: {}, browser: {} }
  activeIds.forEach(id => {
    const u = userMap[id]
    if (!u) return
    profileDist.device[u.device] = (profileDist.device[u.device] || 0) + 1
    profileDist.os[u.os] = (profileDist.os[u.os] || 0) + 1
    profileDist.browser[u.browser] = (profileDist.browser[u.browser] || 0) + 1
  })

  // retention cohorts
  function weekStart(dateStr) {
    const d = new Date(dateStr)
    const day = d.getUTCDay()
    const diff = (day === 0 ? -6 : 1) - day
    d.setDate(d.getDate() + diff)
    return formatDate(d)
  }
  const cohorts = {}
  users.forEach(u => {
    const cohort = weekStart(u.createdAt)
    if (!cohorts[cohort]) cohorts[cohort] = []
    cohorts[cohort].push(u)
  })
  const retention = Object.entries(cohorts).map(([cohort, arr]) => {
    const total = arr.length
    let r7 = 0, r14 = 0, r28 = 0
    arr.forEach(u => {
      const created = new Date(u.createdAt)
      const last = new Date(u.lastActiveAt)
      if (last - created >= 7 * 86400000) r7++
      if (last - created >= 14 * 86400000) r14++
      if (last - created >= 28 * 86400000) r28++
    })
    return {
      cohort,
      d7: total ? r7 / total : 0,
      d14: total ? r14 / total : 0,
      d28: total ? r28 / total : 0
    }
  })
  retention.sort((a, b) => a.cohort.localeCompare(b.cohort))

  // funnel totals
  const steps = ['visit', 'signup', 'verify', 'login', 'first_action', 'subscribe']
  const funnel = {}
  steps.forEach(s => {
    funnel[s] = events.filter(e => e.type === s).length
  })

  // subscription segments
  const subsEvents = events.filter(e => e.type === 'subscribe')
  const seg = { plan: {}, utmSource: {}, country: {} }
  subsEvents.forEach(e => {
    const u = userMap[e.userId]
    if (!u) return
    seg.plan[u.plan] = (seg.plan[u.plan] || 0) + 1
    seg.utmSource[u.utmSource] = (seg.utmSource[u.utmSource] || 0) + 1
    seg.country[u.country] = (seg.country[u.country] || 0) + 1
  })

  // cumulative users
  const userDates = users.map(u => u.createdAt)
  const minUserDate = userDates.sort()[0]
  const maxUserDate = userDates.slice(-1)[0]
  const userRange = dateRange(minUserDate, maxUserDate)
  const cumulativeUsers = []
  let running = 0
  const createdMap = {}
  users.forEach(u => {
    createdMap[u.createdAt] = (createdMap[u.createdAt] || 0) + 1
  })
  userRange.forEach(d => {
    running += createdMap[d] || 0
    cumulativeUsers.push({ date: d, value: running })
  })

  return {
    dates,
    daily,
    loginsByWeekday,
    errorTotals,
    errorPagesTop,
    profileDist,
    retention,
    funnel,
    seg,
    cumulativeUsers
  }
}
