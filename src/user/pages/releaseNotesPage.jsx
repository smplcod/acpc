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
  return (
    <div>
      <h1>{title}</h1>
      <p>All times are shown in Asia/Bishkek time zone.</p>
      {grouped.map(group => (
        <div key={group.date}>
          <h2>{group.date}</h2>
          {group.items.map(rel => (
            <div key={rel.version}>
              <h3>
                {rel.version} ({rel.time})
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
          ))}
        </div>
      ))}
    </div>
  )
}
