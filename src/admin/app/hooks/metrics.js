export function computeMetrics(activity, events, users) {
  const days = activity.map(a => a.date).sort();
  const activityMap = {};
  activity.forEach(a => {
    activityMap[a.date] = a;
  });

  const eventsByDate = {};
  const firstEventDate = {};
  events.forEach(ev => {
    const date = ev.ts.slice(0, 10);
    (eventsByDate[date] ||= []).push(ev);
    if (ev.userId != null) {
      if (!firstEventDate[ev.userId] || firstEventDate[ev.userId] > date) {
        firstEventDate[ev.userId] = date;
      }
    }
  });

  const userSetsByDate = {};
  Object.entries(eventsByDate).forEach(([date, evs]) => {
    const set = new Set();
    evs.forEach(ev => {
      if (ev.userId != null) set.add(ev.userId);
    });
    userSetsByDate[date] = set;
  });

  const dau = {};
  days.forEach(d => {
    dau[d] = userSetsByDate[d] ? userSetsByDate[d].size : 0;
  });

  const wau = {};
  const mau = {};
  const datesSorted = [...days].sort();
  for (let i = 0; i < datesSorted.length; i++) {
    const d = datesSorted[i];
    const w7 = new Set();
    for (let j = Math.max(0, i - 6); j <= i; j++) {
      userSetsByDate[datesSorted[j]]?.forEach(u => w7.add(u));
    }
    wau[d] = w7.size;
    const w30 = new Set();
    for (let j = Math.max(0, i - 29); j <= i; j++) {
      userSetsByDate[datesSorted[j]]?.forEach(u => w30.add(u));
    }
    mau[d] = w30.size;
  }

  const dauArray = datesSorted.map(d => dau[d]);
  function sma(arr, window) {
    return arr.map((_, idx) => {
      const start = Math.max(0, idx - window + 1);
      const subset = arr.slice(start, idx + 1);
      return subset.reduce((a, b) => a + b, 0) / subset.length;
    });
  }
  const dauSMA7Array = sma(dauArray, 7);
  const dauSMA7 = {};
  datesSorted.forEach((d, idx) => {
    dauSMA7[d] = dauSMA7Array[idx];
  });

  const newReturning = {};
  datesSorted.forEach(d => {
    const newSet = new Set();
    (eventsByDate[d] || []).forEach(ev => {
      if (ev.userId != null && firstEventDate[ev.userId] === d) newSet.add(ev.userId);
    });
    const newCount = newSet.size;
    const dauVal = dau[d];
    newReturning[d] = { new: newCount, returning: Math.max(dauVal - newCount, 0) };
  });

  const visitsSignupsLogins = datesSorted.map(d => ({
    date: d,
    visits: activityMap[d]?.visits || 0,
    signups: activityMap[d]?.signups || 0,
    logins: activityMap[d]?.logins || 0,
  }));

  const conversion = {};
  const conversionDelta = {};
  datesSorted.forEach(d => {
    const a = activityMap[d];
    const calc = a && a.visits ? a.signups / a.visits : 0;
    conversion[d] = calc;
    conversionDelta[d] = calc - (a?.conversion || 0);
  });
  const conversionArray = datesSorted.map(d => ({
    date: d,
    sessions: activityMap[d]?.sessions || 0,
    conversion: conversion[d],
    delta: conversionDelta[d],
  }));

  const stickiness = datesSorted.map(d => ({
    date: d,
    value: mau[d] > 0 ? dau[d] / mau[d] : 0,
  }));

  const errorRate = datesSorted.map(d => ({
    date: d,
    value: activityMap[d] && activityMap[d].sessions
      ? activityMap[d].errors / activityMap[d].sessions
      : 0,
  }));

  const errorsByCode = datesSorted.map(d => ({
    date: d,
    ...(activityMap[d]?.errorsByCode || {}),
  }));

  const totalErrorsByCode = {};
  errorsByCode.forEach(day => {
    Object.entries(day).forEach(([code, count]) => {
      if (code !== 'date') totalErrorsByCode[code] = (totalErrorsByCode[code] || 0) + count;
    });
  });

  const paretoErrors = Object.entries(totalErrorsByCode)
    .sort((a, b) => b[1] - a[1])
    .map(([code, count], idx, arr) => {
      const total = arr.reduce((sum, [, c]) => sum + c, 0);
      const cumulative = arr.slice(0, idx + 1).reduce((sum, [, c]) => sum + c, 0) / total;
      return { code, count, cumulative };
    });

  const errorsByPageMap = {};
  events.forEach(ev => {
    if (ev.type === 'error') {
      errorsByPageMap[ev.page] = (errorsByPageMap[ev.page] || 0) + 1;
    }
  });
  const errorsByPage = Object.entries(errorsByPageMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([page, count]) => ({ page, count }));

  const signupsSubscribes = datesSorted.map(d => ({
    date: d,
    signups: activityMap[d]?.signups || 0,
    subscribes: 0,
  }));
  const subscribesPerDay = {};
  events.forEach(ev => {
    if (ev.type === 'subscribe') {
      const d = ev.ts.slice(0, 10);
      subscribesPerDay[d] = (subscribesPerDay[d] || 0) + 1;
    }
  });
  signupsSubscribes.forEach(item => {
    item.subscribes = subscribesPerDay[item.date] || 0;
  });

  const funnelSteps = ['visit', 'signup', 'verify', 'login', 'first_action', 'subscribe'];
  const funnelCounts = {};
  funnelSteps.forEach(s => (funnelCounts[s] = 0));
  events.forEach(ev => {
    if (funnelCounts[ev.type] != null) funnelCounts[ev.type]++;
  });
  const funnel = funnelSteps.map(name => ({ name, value: funnelCounts[name] }));

  const userById = {};
  users.forEach(u => {
    userById[u.id] = u;
  });
  const segments = { plan: {}, utmSource: {}, country: {} };
  events.forEach(ev => {
    if (ev.type === 'subscribe') {
      const u = userById[ev.userId];
      if (!u) return;
      segments.plan[u.plan] = (segments.plan[u.plan] || 0) + 1;
      segments.utmSource[u.utmSource] = (segments.utmSource[u.utmSource] || 0) + 1;
      segments.country[u.country] = (segments.country[u.country] || 0) + 1;
    }
  });
  const segmentData = {
    plan: Object.entries(segments.plan).map(([name, value]) => ({ name, value })),
    utmSource: Object.entries(segments.utmSource).map(([name, value]) => ({ name, value })),
    country: Object.entries(segments.country).map(([name, value]) => ({ name, value })),
  };

  function isoWeek(dateStr) {
    const date = new Date(dateStr);
    const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
    return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  }
  const cohorts = {};
  users.forEach(u => {
    const cohort = isoWeek(u.createdAt);
    if (!cohorts[cohort]) cohorts[cohort] = { total: 0, d7: 0, d14: 0, d28: 0 };
    cohorts[cohort].total++;
    const created = new Date(u.createdAt);
    const last = new Date(u.lastActiveAt);
    if (last - created >= 7 * 86400000) cohorts[cohort].d7++;
    if (last - created >= 14 * 86400000) cohorts[cohort].d14++;
    if (last - created >= 28 * 86400000) cohorts[cohort].d28++;
  });
  const cohortData = Object.entries(cohorts)
    .map(([cohort, v]) => ({
      cohort,
      d7: v.total ? v.d7 / v.total : 0,
      d14: v.total ? v.d14 / v.total : 0,
      d28: v.total ? v.d28 / v.total : 0,
    }))
    .sort((a, b) => a.cohort.localeCompare(b.cohort));

  function aggregate(arr, key) {
    const res = {};
    arr.forEach(u => {
      res[u[key]] = (res[u[key]] || 0) + 1;
    });
    return Object.entries(res).map(([name, value]) => ({ name, value }));
  }
  const activeUsers = users.filter(u => u.status === 'active');
  const deviceDist = aggregate(activeUsers, 'device');
  const osDist = aggregate(activeUsers, 'os');
  const browserDist = aggregate(activeUsers, 'browser');

  const cumulative = [];
  const sortedUsers = [...users].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  let count = 0;
  let idx = 0;
  datesSorted.forEach(d => {
    while (idx < sortedUsers.length && sortedUsers[idx].createdAt <= d) {
      count++;
      idx++;
    }
    cumulative.push({ date: d, value: count });
  });

  const growth = datesSorted.map(d => ({
    date: d,
    dau: dau[d],
    wau: wau[d],
    mau: mau[d],
    dauSMA7: dauSMA7[d],
  }));

  const newReturningArr = datesSorted.map(d => ({
    date: d,
    new: newReturning[d].new,
    returning: newReturning[d].returning,
  }));

  return {
    days: datesSorted,
    growth,
    newReturning: newReturningArr,
    visitsSignupsLogins,
    conversion: conversionArray,
    stickiness,
    cohortData,
    deviceDist,
    osDist,
    browserDist,
    errorRate,
    errorsByCode,
    paretoErrors,
    errorsByPage,
    signupsSubscribes,
    funnel,
    segmentData,
    cumulative,
  };
}

export default async function loadMetrics() {
  const [a, e, u] = await Promise.all([
    fetch('/mocks/activity.json').then(r => r.json()),
    fetch('/mocks/events.json').then(r => r.json()),
    fetch('/mocks/users.json').then(r => r.json()),
  ]);
  return computeMetrics(a, e, u);
}
