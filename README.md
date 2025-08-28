# ACP+Charts now
Current version: 0.0.0

ACP+Charts is a minimal React + Vite app with basic routing. Users can navigate between a main page, an admin dashboard, an admin charts screen, and a release notes page showing updates in English. Pages live under `src/pages` and a shared layout under `src/app`. Non-admin pages display a user menu, while admin pages use a separate admin menu.

# ACP+Charts сomming soon
ACP+Charts will grow into an admin dashboard that visualizes application metrics with interactive charts. Administrators will be able to monitor key indicators, manage data, and explore analytics through a responsive web interface built with React and Vite. The repository currently includes placeholder pages while chart components are under active development.

# Features ToDo
_Only this section of the readme can be maintained using Russian language_
1. Mock-данные
  - [x] 1.1 Узнать, что такое мок-данные
  - [ ] 1.2 Создать мок-данные (пользователи, роли, активность)
  - [ ] 1.3 Определить схему: user{id, name, role, email, active}, activity{date, logins, sessions, errors, conversion}
 
2. Авторизация
  - [ ] 2.1 Создать страницу /admin/login . 
  - [ ] 2.2 Создать файл mockAdmin.js рядом с файлом mockData.js для хранения данных по авторизации админа (логин и пароль там хранится).
  - [ ] 2.3 Перенаправление на страницу /admin/ при успешном вводе логина и паролья на /admin/login .
  - [ ] 2.4 Проверять авторизацию на всех страницах /admin/*. Если нет авторизации, то редирект на /admin/login .

3. Графики
  - [ ] 3.1 Создать /admin/dev/charts . Создать /admin/dev/ , которая редиректит на /admin/dev/charts .
  - [ ] 3.2 Добавить правило для ботов в readme, что если есть вложенные страницы, то использовать специальный компонент для вывода подстраниц согласно схеме роутинга. Хранить этот компоент в отдельном файле. 
  - [ ] 3.2.1 Создать страницу /admin/dev/charts/recharts и вывести там 10 вариантов графиков bar/line/area и остальные при помощи Recharts. После каждого из них привести внутри просторной textarea пример кода для этого графика. Данные для графиков должны автоматически использоваться из mockData.js.
  - [ ] 3.2.2 Создать страницу /admin/dev/charts/chartjs2 и вывести там 10 вариантов графиков bar/line/area и остальные при помощи Chart.js (react-chartjs-2). После каждого из них привести внутри просторной textarea пример кода для этого графика. Данные для графиков должны автоматически использоваться из mockData.js.

6. Удобства
 - [x] 6.1 Изучить release-notes-howto.md. Создать файл release-notes.json и начать его вести. Указать в readme правила по ведению release-notes.json для каждого раза.
  - [ ] 6.2 Создать страницу /release-notes где задействовать release-notes.json вверху страницы расположить sticky компонент для управления отображением релизов(HMR). В компоненте распложить:
  - - [x] 6.2.0 Реализовать базовый вывод релизов по времени.
  - - [ ] 6.2.1 Переключатель: релизы только по времени или релизы только по дням или кратчайшие релизы. Состояние переключателя при переключение сохранять в localstorage. (Создать /servises/localstorageHelper.jsx для лаконичного взаимодействия с localstorage.)


7. Recommendations from bot
  - 7.15 Принципы
    - Асинхронность
    - Try-catch
8. Меню
  - [x] 8.1 Создать компонент barLeftUser со ссылками на все страницы.
  - [x] 8.2 Создать компонент barLeftAdmin (пустой).
  - [x] 8.3 Подключить barLeftUser на всех страницах кроме /admin/*, barLeftAdmin на /admin/*.

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
13. Update `release-notes.json` for every user-facing change according to `release-notes-howto.md`.
 
# Project details

## Constraints
- JavaScript only (no TypeScript).
- No remote databases and no custom backend.
- Demo data must come from local sources (in-memory, JSON, or localStorage).

## Tech and infrastructure
- React + Vite (fast HMR).
- Railway is our hosting.

## Release notes
- File `release-notes.json` follows [release-notes-howto.md](release-notes-howto.md).
- Each user-facing change must append a bilingual entry with ISO 8601 timestamp.
- Descriptions must use past tense (e.g., "Added release notes page").
- Keep entries sorted chronologically and update daily summaries and the ultrashort digest.
