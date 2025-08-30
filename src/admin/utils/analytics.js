import { useEffect, useState } from 'react'

const fmt = d => d.toISOString().slice(0, 10)

const getDates = (start, end) => {
  const arr = []
  for (let dt = new Date(start); dt <= end; dt.setUTCDate(dt.getUTCDate() + 1)) {
    arr.push(fmt(new Date(dt)))
  }
  return arr
}

const getISOWeek = date => {
  const tmp = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7)
  return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

export function useAnalytics() {
  const [data, setData] = useState(null)
  useEffect(() => {
    Promise.all([
      fetch('/mocks/activity.json').then(r => r.json()),
      fetch('/mocks/events.json').then(r => r.json()),
      fetch('/mocks/users.json').then(r => r.json())
    ]).then(([activity, events, users]) => {
      const activityMap = Object.fromEntries(activity.map(a => [a.date, a]))
      const eventByDate = {}
      const firstSeen = new Map()
      const errorPageCounts = {}
      const errorTotals = {}
      const subsByDate = {}
      const funnelTypes = ['visit', 'signup', 'verify', 'login', 'first_action', 'subscribe']
      const funnelTotals = Object.fromEntries(funnelTypes.map(t => [t, 0]))
      const dauSets = {}
      const loginsByWeekday = Array(7).fill(0)
      events.forEach(ev => {
        const date = ev.ts.slice(0, 10)
        if (!eventByDate[date]) eventByDate[date] = []
        eventByDate[date].push(ev)
        if (!dauSets[date]) dauSets[date] = new Set()
        dauSets[date].add(ev.userId)
        if (!firstSeen.has(ev.userId) || date < firstSeen.get(ev.userId)) firstSeen.set(ev.userId, date)
        if (ev.type === 'login') {
          const day = (new Date(ev.ts).getUTCDay() + 6) % 7
          loginsByWeekday[day]++
        }
        if (ev.type === 'error') {
          errorPageCounts[ev.page] = (errorPageCounts[ev.page] || 0) + 1
          const code = ev.code || 'unknown'
          errorTotals[code] = (errorTotals[code] || 0) + 1
        }
        if (ev.type === 'subscribe') {
          subsByDate[date] = (subsByDate[date] || 0) + 1
        }
        if (funnelTotals[ev.type] !== undefined) funnelTotals[ev.type]++
      })
      const allDates = getDates(new Date(Math.min(...activity.map(a => Date.parse(a.date)))), new Date(Math.max(...activity.map(a => Date.parse(a.date)))))
      const dau = allDates.map(d => (dauSets[d] ? dauSets[d].size : 0))
      const wau = allDates.map((d, i) => {
        const start = Math.max(0, i - 6)
        const set = new Set()
        for (let j = start; j <= i; j++) {
          dauSets[allDates[j]]?.forEach(u => set.add(u))
        }
        return set.size
      })
      const mau = allDates.map((d, i) => {
        const start = Math.max(0, i - 29)
        const set = new Set()
        for (let j = start; j <= i; j++) {
          dauSets[allDates[j]]?.forEach(u => set.add(u))
        }
        return set.size
      })
      const sma7 = dau.map((_, i) => {
        const start = Math.max(0, i - 6)
        const slice = dau.slice(start, i + 1)
        const avg = slice.reduce((a, b) => a + b, 0) / slice.length
        return avg
      })
      const newUsers = allDates.map(d => {
        let c = 0
        dauSets[d]?.forEach(u => {
          if (firstSeen.get(u) === d) c++
        })
        return c
      })
      const returningUsers = dau.map((v, i) => v - newUsers[i])
      const conversion = allDates.map(d => {
        const a = activityMap[d]
        return a && a.visits ? (a.signups / a.visits) * 100 : 0
      })
      const errorRate = allDates.map(d => {
        const a = activityMap[d]
        return a && a.sessions ? a.errors / a.sessions : 0
      })
      const sessions = allDates.map(d => activityMap[d]?.sessions || 0)
      const visits = allDates.map(d => activityMap[d]?.visits || 0)
      const signups = allDates.map(d => activityMap[d]?.signups || 0)
      const logins = allDates.map(d => activityMap[d]?.logins || 0)
      const errorsByCode = { '401': [], '408': [], '500': [], 'JS:TypeError': [] }
      allDates.forEach(d => {
        const e = activityMap[d]?.errorsByCode || {}
        Object.keys(errorsByCode).forEach(code => {
          errorsByCode[code].push(e[code] || 0)
        })
      })
      const stickiness = dau.map((v, i) => (mau[i] ? v / mau[i] : 0))
      const subsPerDay = allDates.map(d => subsByDate[d] || 0)
      const errorPageTop = Object.entries(errorPageCounts).sort((a, b) => b[1] - a[1]).slice(0, 10)
      const errorCodeTotals = Object.entries(errorTotals).sort((a, b) => b[1] - a[1])
      const totalErrors = errorCodeTotals.reduce((a, [, c]) => a + c, 0)
      let cum = 0
      const pareto = errorCodeTotals.map(([code, c]) => {
        cum += c
        return { code, count: c, cumPct: totalErrors ? (cum / totalErrors) * 100 : 0 }
      })
      const userMap = new Map(users.map(u => [u.id, u]))
      const subsEvents = events.filter(e => e.type === 'subscribe')
      const seg = { plan: {}, utmSource: {}, country: {} }
      subsEvents.forEach(e => {
        const u = userMap.get(e.userId)
        if (!u) return
        seg.plan[u.plan] = (seg.plan[u.plan] || 0) + 1
        seg.utmSource[u.utmSource] = (seg.utmSource[u.utmSource] || 0) + 1
        seg.country[u.country] = (seg.country[u.country] || 0) + 1
      })
      const cohortMap = {}
      users.forEach(u => {
        const created = new Date(u.createdAt + 'T00:00:00Z')
        const last = new Date(u.lastActiveAt + 'T00:00:00Z')
        const week = getISOWeek(created)
        const diff = (last - created) / 86400000
        if (!cohortMap[week]) cohortMap[week] = { total: 0, d7: 0, d14: 0, d28: 0 }
        cohortMap[week].total++
        if (diff >= 7) cohortMap[week].d7++
        if (diff >= 14) cohortMap[week].d14++
        if (diff >= 28) cohortMap[week].d28++
      })
      const cohortWeeks = Object.keys(cohortMap).sort()
      const cohorts = cohortWeeks.map(week => {
        const c = cohortMap[week]
        return {
          week,
          d7: c.total ? (c.d7 / c.total) * 100 : 0,
          d14: c.total ? (c.d14 / c.total) * 100 : 0,
          d28: c.total ? (c.d28 / c.total) * 100 : 0
        }
      })
      const deviceCounts = {}
      const osCounts = {}
      const browserCounts = {}
      users.forEach(u => {
        deviceCounts[u.device] = (deviceCounts[u.device] || 0) + 1
        osCounts[u.os] = (osCounts[u.os] || 0) + 1
        browserCounts[u.browser] = (browserCounts[u.browser] || 0) + 1
      })
      const sum = obj => Object.values(obj).reduce((a, b) => a + b, 0)
      const pct = obj => {
        const total = sum(obj) || 1
        return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, (v / total) * 100]))
      }
      const platforms = { device: pct(deviceCounts), os: pct(osCounts), browser: pct(browserCounts) }
      const createdCounts = {}
      users.forEach(u => {
        createdCounts[u.createdAt] = (createdCounts[u.createdAt] || 0) + 1
      })
      const createdDates = Object.keys(createdCounts).sort()
      let cumUsers = 0
      const cumulativeUsers = createdDates.map(d => {
        cumUsers += createdCounts[d]
        return { date: d, count: cumUsers }
      })
      setData({
        dates: allDates,
        dau,
        wau,
        mau,
        sma7,
        newUsers,
        returningUsers,
        conversion,
        errorRate,
        sessions,
        visits,
        signups,
        logins,
        loginsByWeekday,
        errorsByCode,
        stickiness,
        subsPerDay,
        funnelTotals,
        pareto,
        errorPageTop,
        seg,
        cohorts,
        platforms,
        cumulativeUsers
      })
    })
  }, [])
  return data
}

