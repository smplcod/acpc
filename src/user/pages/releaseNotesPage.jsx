import { useEffect } from 'react'
import data from '../../../release-notes.json'

export default function ReleaseNotesPage() {
  const title = 'Release Notes'
  useEffect(() => {
    document.title = `${title} | ACPC`
  }, [title])
  const releases = [...data.releaseNotes].sort(
    (a, b) =>
      new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`),
  )
  return (
    <div>
      <h1>{title}</h1>
      {releases.map(rel => (
        <div key={rel.version}>
          <h2>
            {rel.version} – {rel.date} {rel.time} {rel.timezone}
          </h2>
          <ul>
            {rel.changes.map((ch, i) => (
              <li key={i}>{ch.description}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
