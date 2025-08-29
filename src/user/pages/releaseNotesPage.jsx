import { useEffect } from 'react'
import data from '../../../release-notes.json'
import './releaseNotesPage.css'

export default function ReleaseNotesPage() {
  const title = 'Release Notes'
  useEffect(() => {
    document.title = `${title} | ACPC`
  }, [title])
  const releases = data.releaseNotes
    .filter(rel => rel.version)
    .sort(
      (a, b) =>
        new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`),
    )
  const grouped = releases.reduce((acc, rel) => {
    const group = acc.find(g => g.date === rel.date)
    if (group) group.items.push(rel)
    else acc.push({ date: rel.date, items: [rel] })
    return acc
  }, [])
  const timeZoneOffset = Intl.DateTimeFormat('en-US', {
    timeZone: releases[0]?.timezone,
    timeZoneName: 'short',
  })
    .formatToParts()
    .find(p => p.type === 'timeZoneName')
    .value.replace('GMT', 'UTC')
  return (
    <div>
      <h1>{title}</h1>
      <p>All times are shown in the {timeZoneOffset} time zone</p>
      {grouped.map(group => (
        <div key={group.date}>
          <h2>{group.date}</h2>
          {group.items.map(rel => {
            const time = rel.time.slice(0, 5)
            return (
              <div key={rel.version}>
                <h3>
                  {rel.version}, {time}
                </h3>
                <ul>
                  {rel.changes.map((ch, i) => (
                    <li key={i}>
                      {ch.description}
                      <div className="tags">
                        <div className="tags-variant-21">
                          <span>{ch.type}</span>
                        </div>
                        <div className="tags-variant-20">
                          <span>{ch.scope}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
