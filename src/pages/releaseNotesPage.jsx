import releaseNotes from '../../release-notes.json'

export default function ReleaseNotesPage() {
  const changes = [...releaseNotes.changes].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  )
  const groups = changes.reduce((acc, change) => {
    const date = change.timestamp.slice(0, 10)
    if (!acc[date]) acc[date] = []
    acc[date].push(change)
    return acc
  }, {})
  const dates = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a))
  return (
    <div>
      {dates.map(date => (
        <div key={date}>
          <h2>{date}</h2>
          {groups[date]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map(item => (
              <div key={item.id}>
                <h3>{item.timestamp.slice(11, 16)}</h3>
                <p>{item.description.en}</p>
                <p>{item.description.ru}</p>
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}
