# release-notes-howto

## Purpose
- Keep a human-friendly and machine-readable history of all notable changes.
- Provide three built-in views: chronological entries, daily summaries, and an ultra-short digest.
- Record every message in English (`en`) and Russian (`ru`) to support bilingual interfaces.

## Recommended JSON Schema
```json
{
  "version": "1.0.0",
  "generated": "2024-01-15T12:00:00+00:00",
  "changes": [
    {
      "id": "2024-01-15T08:30:00+00:00-feat-ui",
      "timestamp": "2024-01-15T08:30:00+00:00",
      "version": "1.0.0",
      "type": "feat",
      "scope": "ui",
      "description": {
        "en": "Add dark-mode toggle",
        "ru": "Добавлен переключатель тёмной темы"
      }
    }
  ],
  "daily": {
    "2024-01-15": {
      "en": "Introduced dark mode and prepared release pipeline",
      "ru": "Добавлен тёмный режим и подготовлен релизный процесс"
    }
  },
  "ultrashort": {
    "en": "Dark mode arrives",
    "ru": "Появился тёмный режим"
  }
}
```

**Keys**
- `version`: current semantic version (MAJOR.MINOR.PATCH).
- `generated`: ISO 8601 timestamp of the file update.
- `changes`: chronological array of individual change records.
- `daily`: map of `YYYY-MM-DD` to bilingual daily summaries.
- `ultrashort`: bilingual digest for quick overviews.

**Change object**
- `id`: unique identifier, typically `<timestamp>-<type>-<scope>`.
- `timestamp`: ISO 8601 date & time including timezone.
- `version`: version in which the change is released.
- `type`: one of `feat`, `fix`, `docs`, `chore`, `refactor`, `perf`, `test`.
- `scope`: one of `ui`, `backend`, `infra`, `docs`, `other`.
- `description.en` / `description.ru`: short bilingual description.

## Rules for Adding Entries
1. Every commit or ticket that affects users adds an entry to `changes`.
2. Sort `changes` by ascending `timestamp`.
3. For each new calendar day, add a `daily["YYYY-MM-DD"]` summary.
4. Maintain `ultrashort` as a terse digest of recent milestones (max 5 lines per language).
5. Increment only the PATCH number when cutting a new version.
6. Keep `type` and `scope` consistent across entries.
7. Use English technical terms in Russian text when no natural translation exists.
8. Ensure all timestamps use the same timezone and ISO 8601 format.

## Updating and Releasing Versions
- When preparing a release:
  1. Make sure all pending changes are listed and summarized.
  2. Increment `version` by 0.0.1.
  3. Update `generated` with the current timestamp.
  4. Commit the updated `release-notes.json` with message `chore: release vX.Y.Z`.
- Do not reset or reorder existing entries; append only.

## Messaging Conventions
- Keep descriptions under 80 characters.
- Use past tense and avoid filler words.
- Bilingual fields must be direct equivalents.
- Good: `{"en":"Fix login redirect","ru":"Исправлен редирект входа"}`
- Bad: `{"en":"Some fixes","ru":"Разные правки"}`

## Type and Scope Mapping
- `feat`: new feature or capability.
- `fix`: bug fix.
- `docs`: documentation change.
- `chore`: build or maintenance task.
- `refactor`: code restructuring.
- `perf`: performance improvement.
- `test`: testing related.

Scopes describe affected area:
- `ui`: user interface.
- `backend`: server or API.
- `infra`: tooling, deployment, CI/CD.
- `docs`: documentation or guides.
- `other`: anything else.

Match `type` and `scope` to commit messages or ticket categories to keep release notes searchable.

## Date and Time Requirements
- Use full ISO 8601 timestamps with timezone, e.g. `2024-01-15T08:30:00+03:00`.
- Ensure each `id` is unique; combining timestamp, type and scope is recommended.
- Sort `changes` chronologically; later timestamps come last.

## Templates
### New Change Entry
```json
{
  "id": "{timestamp}-{type}-{scope}",
  "timestamp": "{timestamp}",
  "version": "{currentVersion}",
  "type": "{type}",
  "scope": "{scope}",
  "description": {
    "en": "{brief English sentence}",
    "ru": "{краткое русское предложение}"
  }
}
```

### Daily Summary Entry
```json
"{YYYY-MM-DD}": {
  "en": "{English day summary}",
  "ru": "{Русское дневное резюме}"
}
```

### Release Cut
```json
{
  "version": "{newVersion}",
  "generated": "{now}",
  ...
}
```

## Quality Checks
- Validate JSON with tools like `jq` or `jsonlint` before committing.
- Verify chronological order and unique `id` values.
- Ensure every entry has both `en` and `ru` texts.
- Keep file encoded in UTF-8 without BOM.

## Common Pitfalls
- Missing translations or mismatched meanings.
- Forgetting to update `daily` or `ultrashort` views.
- Mixing timezones or omitting timezone offsets.
- Using inconsistent `type` or `scope` values.

## Migration
1. **Starting fresh**: initialize `release-notes.json` using the schema above with version `0.1.0`.
2. **Normalizing legacy notes**:
   - Parse existing notes and assign ISO 8601 timestamps.
   - Map historical categories to the standard `type` and `scope` sets.
   - Translate missing languages and split long paragraphs into short entries.
   - Sort all entries chronologically and generate daily summaries.

Following this guide keeps release notes structured, searchable and ready for automated consumption.
