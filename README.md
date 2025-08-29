# ACP+Charts now
Current version: 0.0.49

- Minimal React + Vite app with basic routing
- Public pages: home and English release notes
- Admin login at `/admin/login` using env credentials
- Admin access to dashboard, charts, and UI demos of 30 forms and 30 hashtags
- Logout at `/admin/logout` with redirect for unauthenticated routes
- Return to originally requested admin page after login
- Public pages use a collapsible sidebar with icon tooltips and home link
- Admin pages have a separate collapsible menu
- Code split between `src/user` and `src/admin`
- Admin pages display "Subpages:" with a full URL tree when subpages exist
- Navigation sidebars derive from the same tree; admin lists all URLs flat (no nested lists), public lists non-admin URLs
- User and admin sidebars highlight the active link
- Admin charts with 20 Recharts examples for users data

# ACP+Charts сomming soon
ACP+Charts will grow into an admin dashboard that visualizes application metrics with interactive charts. Administrators will be able to monitor key indicators, manage data, and explore analytics through a responsive web interface built with React and Vite. The repository currently includes placeholder pages while chart components are under active development.

# Features ToDo
_Only this section of the readme can be maintained using Russian language_
1. Mock-данные
  - [x] 1.1 Узнать, что такое мок-данные
  - [ ] 1.2 Создать мок-данные (пользователи, роли, активность)
  - [ ] 1.3 Определить схему: user{id, name, role, email, active}, activity{date, logins, sessions, errors, conversion}
  - [x] 1.4 Расширить мок-данные активности посещениями, регистрациями и кодами ошибок
 
2. Авторизация
  - [x] 2.1 Создать страницу /admin/login .
 - [x] 2.2 Использовать переменные окружения для хранения данных авторизации администратора.
  - [x] 2.3 Перенаправление на страницу /admin при успешном вводе логина и пароля на /admin/login .
  - [x] 2.4 Проверять авторизацию на всех страницах /admin/*. Если нет авторизации, то редирект на /admin/login .
  - [x] 2.5 Добавить страницу /admin/logout, сообщение об успешной авторизации и ссылку на выход.
  - [x] 2.6 Возвращать на запрошенную страницу /admin/* после успешной авторизации.
  - [x] 2.7 Обновить сообщение об успешной авторизации на "User admin is authenticated. You can log out."

3. Графики
  - [x] 3.1 Создать страницы /admin/charts/users и /admin/charts/users/recharts с 20 вариантами графиков на Recharts. После каждого графика добавить описание и пример кода в textarea. Данные автоматически берутся из public/mocks/users.json.
  - [ ] 3.2 Создать страницу /admin/charts/users/chartjs2 и вывести там 10 вариантов графиков bar/line/area и остальные при помощи Chart.js (react-chartjs-2). После каждого из них привести внутри просторной textarea пример кода для этого графика. Данные для графиков должны автоматически использоваться из public/mocks/users.json.
  - [x] 3.3 Исправить невидимые графики на /admin/charts/users/recharts.
  - [x] 3.4 Пронумеровать варианты графиков в заголовках на /admin/charts/users/recharts.
  - [x] 3.5 Создать страницу /admin/charts/users/explain и описать ключи из users.json.

6. Удобства
 - [x] 6.1 Изучить release-notes-howto.md. Создать файл release-notes.json и начать его вести. Указать в readme правила по ведению release-notes.json для каждого раза.
  - [ ] 6.2 Создать страницу /release-notes где задействовать release-notes.json вверху страницы расположить sticky компонент для управления отображением релизов(HMR). В компоненте распложить:
  - - [x] 6.2.0 Реализовать базовый вывод релизов по времени.
  - - [ ] 6.2.1 Переключатель: релизы только по времени или релизы только по дням или кратчайшие релизы. Состояние переключателя при переключение сохранять в localstorage. (Создать /servises/localstorageHelper.jsx для лаконичного взаимодействия с localstorage.)
  - - [x] 6.2.2 Исправить отображение содержимого на /release-notes.
  - - [x] 6.2.3 Настроить вывод даты в h2, версии и времени в h3 и добавить заметку о часовом поясе.
  - - [x] 6.2.4 Упростить вывод времени и часового пояса на /release-notes.
  - [x] 6.3 Добавить type и scope к записям release notes и вывести их на странице /release-notes.
  - [x] 6.4 Добавить правило для ботов в readme, что если есть вложенные страницы, то использовать специальный компонент для вывода подстраниц согласно схеме роутинга. Хранить этот компонент в отдельном файле.

7. Recommendations from bot
  - 7.15 Принципы
    - Асинхронность
    - Try-catch
8. Меню
 - [x] 8.1 Создать компонент barLeftUser со ссылками на все страницы.
  - [x] 8.2 Создать компонент barLeftAdmin (пустой).
 - [x] 8.3 Подключить barLeftUser на всех страницах кроме /admin/*, barLeftAdmin на /admin/*.
    - [x] 8.4 Уточнить порядок и расстояния иконок в сайдбаре пользователя.
 - [x] 8.5 Реализовать функциональность barLeftAdmin.
 - [x] 8.6 Добавить подсказки к иконкам и ссылку-домик в сайдбары.
 - [x] 8.7 Подсветить активные ссылки в сайдбарах пользователя и админа.

9. Документация
 - [x] 9.1 Перечислить все используемые библиотеки в readme.
 - [x] 9.2 Добавить .env.example с переменными авторизации администратора.

10. Тёмная тема
 - [x] 10.1 Распознавать prefers-color-scheme для автоматического переключения темы.
 - [x] 10.2 Применить тёмную палитру для сайдбара и интерфейса.

11. UI каталог
 - [x] 11.1 Создать страницу /admin/ui с 10 вариантами форм авторизации.
 - [x] 11.2 Добавить 10 вариантов отображения хэштегов.
 - [x] 11.3 Добавить ещё 10 вариантов форм авторизации.
 - [x] 11.4 Добавить ещё 10 вариантов отображения хэштегов.

 - [x] 11.5 Добавить пометку "current choice" для выбранных вариантов.
 - [x] 11.6 Добавить ещё 10 вариантов форм авторизации.
 - [x] 11.7 Добавить ещё 10 вариантов отображения хэштегов.

 - [x] 11.8 Сделать текущим вариантом формы №30.

12. Code organization
 - [x] 12.1 Разделить код на /src/user и /src/admin с отдельными app и pages.

13. Главная страница
 - [x] 13.1 Добавить иконку перед названием
 - [x] 13.2 Заменить текст приветствия
 - [x] 13.3 Обновить ссылку /admin

# 14. Правки оформления
 - [x] 14.1 Изменить заголовок админских страниц на "| Admin Control Panel |"
- [x] 14.2 Уменьшить глобальный размер h1 до 2.4em
- [x] 14.3 Добавить префикс "Subpages:" перед списком подстраниц в /admin/*
- [x] 14.4 Скрывать заголовок Subpages при отсутствии подстраниц.

# 15. Маршруты
 - [x] 15.1 Удалить страницу /admin/charts и убрать сегмент dev из всех адресов админки.

16. Collapsible headings
 - [x] 16.1 Enable collapsible headings in admin pages

# Bot instructions
1. Always start by reading this file and the "Features ToDo" section here. Do not do anything from "Features ToDo" unless you have direct instructions.
2. Maintain a hierarchical task list with consistent numbering.
   - Checkboxes are only for sub-tasks (not for top-level tasks).
   - Top-level tasks must be numbered without checkboxes.
3. Always add nested sub-tasks under “Recommendations from Codex” when future steps are discovered during work.
4. Add new tasks for any user-requested changes.
5. Mark completed tasks with a checked box; leave incomplete ones unchecked.
6. Keep "Features ToDo" up to date whenever task statuses change.
7. Keep the "ACP+Charts now" and "ACP+Charts сomming soon" sections up to date.
8. Maintain the "Принципы" subsection under "Recommendations from bot":
   - List each principle as a bullet item.
   - Nest sub-tasks with checkboxes under the relevant principle when a specific implementation is required.
9. Place components and their state close to where they’re used; permit only one level of props drilling (parent→child); if data is needed deeper or across branches, use Context or reduser or both.
10. After completing a task, suggest the next task to complete (don't add this to readme).
11. Keep the "ACP+Charts now" section up to date by showing only what is already available in the project from the user's perspective. Display the current version: {release_number}.
12. If there is no indication what language the page should be in, use English.
13. Update `release-notes.json` for every user-facing change according to `release-notes-howto.md`. Assign a weight between 20 and 80 and bump the PATCH version when cutting a release.
14. Keep user and admin code separated in `/src/user` and `/src/admin`, each containing its own `app` and `pages` directories. Allow duplication between them but record every instance in the "Code duplication log" section.
15. The admin layout automatically renders the `SubPages` component at the end of every `/admin` route; admin pages should not render `SubPages` themselves to avoid duplication, and the component shows the "Subpages:" heading only when subpages exist.
16. After each task, re-check navigation (see Verification steps).

# Verification steps
1. Open several pages: /admin, /admin/section, /admin/section/subsection — confirm each shows "Subpages" at the bottom with the full tree.
2. Check the admin left sidebar — all URLs present and shown flat (no nested lists).
3. Check the public site left sidebar — all URLs present except /admin and its descendants.
4. After any page structure change, repeat steps 1–3.

# Project details

## Constraints
- JavaScript only (no TypeScript).
- No remote databases and no custom backend.
- Demo data must come from local sources (in-memory, JSON, or localStorage).
- Every page uses a single `<h1>` mirrored in the document title; non-home pages append " | ACPC".

## Tech and infrastructure
- React + Vite (fast HMR).
- Railway is our hosting.

## Libraries

**Dependencies**

- react 19.1.1
- react-dom 19.1.1
- react-feather 2.0.10
- react-router-dom 7.8.2
- recharts 2.15.4

**Dev dependencies**

- @eslint/js 9.33.0
- @types/react 19.1.10
- @types/react-dom 19.1.7
- @vitejs/plugin-react 5.0.0
- eslint 9.33.0
- eslint-plugin-react-hooks 5.2.0
- eslint-plugin-react-refresh 0.4.20
- globals 16.3.0
- vite 7.1.2

## Code duplication log
- `src/user/app/layout.jsx` duplicated in `src/admin/app/layout.jsx`
- `src/user/app/layout.css` duplicated in `src/admin/app/layout.css`
- `src/user/app/barLeftUser.jsx` duplicated in `src/admin/app/barLeftAdmin.jsx`
- `src/user/app/barLeftUser.css` duplicated in `src/admin/app/barLeftAdmin.css`

## Release notes
- File `release-notes.json` stores two arrays: `releaseNotes` and `releases`.
- `releaseNotes` is a chronological list that includes both release entries and daily summary entries.
- Release entries contain `version` (semantic MAJOR.MINOR.PATCH, bump PATCH only), `date` (YYYY-MM-DD), `time` (HH:MM:SS), `timezone` (always `Asia/Bishkek`), and bilingual `changes` with weights from 10 to 90.
- Each change item also includes `type` (feat, fix, docs, etc.) and `scope` (area affected).
- Descriptions use past tense and appear in both English (`changes`) and Russian (`changes-ru`).
- After all releases for a day, add a summary entry with `time` set to `summary` and provide `summary`, `summary-ru`, `ultrashort-summary`, and `ultrashort-summary-ru` arrays.
- Keep all entries ordered by date and time.
- `releases` mirrors only the release entries and must stay in sync with `releaseNotes`.
