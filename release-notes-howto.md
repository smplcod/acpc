# release-notes-howto

## Purpose
- Maintain a human-readable and machine-readable log of releases.
- Record every change in both English and Russian.

## JSON Schema
```json
{
  "releaseNotes": [
    {
      "version": "0.0.1",
      "date": "2025-08-29",
      "time": "13:30:00",
      "timezone": "Asia/Bishkek",
      "changes": [
        { "description": "Added feature", "weight": 40 }
      ],
      "changes-ru": [
        { "description": "Добавлена функция", "weight": 40 }
      ]
    }
  ]
}
```

### Keys
- `releaseNotes` – array of release objects sorted chronologically.
- `version` – semantic version (`MAJOR.MINOR.PATCH`). Increment only the PATCH part for each release.
- `date` – release date in `YYYY-MM-DD` format.
- `time` – release time in `HH:mm:ss` format.
- `timezone` – IANA timezone name (e.g., `Asia/Bishkek`).
- `changes` – English descriptions of changes.
- `changes-ru` – Russian translations of `changes`.
- Each change object has `description` and `weight` (20–80 in steps of 10; higher means more important).

### Rules
1. Append a new release object for every user-facing change set.
2. List changes in the same order in `changes` and `changes-ru`.
3. Use past tense and keep descriptions under 80 characters.
4. Validate JSON with `jq` before committing.

Following this guide keeps release notes simple, bilingual, and properly versioned.

