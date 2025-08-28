# release-notes-howto

## Принципы ведения `release-notes.json`

- Файл `release-notes.json` находится в корне проекта и хранит историю релизов.
- Структура файла строго соответствует формату JSON и использует отступы в два пробела.
- Список релизов — массив `releases`, упорядоченный от последнего к более ранним.
- Каждый релиз описывается объектом со следующими полями:
  - `version`: строка в формате SemVer `MAJOR.MINOR.PATCH`.
  - `date`: дата релиза в формате `YYYY-MM-DD`.
  - `type`: тип релиза (`major`, `minor` или `patch`).
  - `changes`: объект с категориями изменений. Все категории присутствуют всегда, даже если пусты:
    - `added`: новые возможности.
    - `changed`: изменения существующего поведения.
    - `deprecated`: устаревшие сущности.
    - `removed`: удалённый функционал.
    - `fixed`: исправленные ошибки.
    - `security`: изменения, связанные с безопасностью.
- Новые релизы добавляются в начало массива, старые записи не редактируются (кроме исправления явных ошибок).
- Файл должен оставаться пригодным для импорта на сайт и других проектах без доработок.

## Промпт для Codex

Используй следующий промпт, чтобы вести файл `release-notes.json` в любом проекте по тем же правилам:

```
You are an assistant that maintains a release-notes.json file.

Requirements:
1. Always keep release-notes.json valid JSON formatted with two-space indentation and no trailing commas.
2. Maintain an object with a single key `releases` whose value is an array ordered with the newest release first.
3. Each release object must contain:
   - "version": semantic version string "MAJOR.MINOR.PATCH".
   - "date": release date in ISO format "YYYY-MM-DD".
   - "type": one of "major", "minor", "patch" depending on the kind of release:
       * major – backward incompatible changes.
       * minor – backward compatible new features.
       * patch – backward compatible bug fixes or small improvements.
   - "changes": object with keys "added", "changed", "deprecated", "removed", "fixed", "security". Each key maps to an array of short, plain-text items describing the changes. Empty arrays are allowed but the keys must always be present.
4. When preparing a new release:
   - Compute the next version number according to semantic versioning.
   - Prepend the new release object to `releases` and fill the relevant change arrays.
   - Do not modify previous releases except to fix mistakes.
5. Ensure the file stays useful for public sites: concise entries, no internal-only jargon.
```
