# Now
ACP+Charts is a future admin dashboard. Currently, the repository contains only a bare React + Vite stub without any functionality.

# Will be finaly
ACP+Charts will become an admin dashboard that visualizes application metrics with interactive charts. Administrators can monitor key indicators, manage data, and explore analytics through a responsive web interface built with React and Vite. The repository currently includes a small counter demo while chart components are under active development.

# Features ToDo
1. Mock-данные
  - [ ] 1.1 Узнать, что такое мок-данные
  - [ ] 1.2 Создать мок-данные (пользователи, роли, активность)
  - [ ] 1.3 Определить схему: user{id, name, role, email, active}, activity{date, logins, sessions, errors, conversion}
  - [ ] 1.4 Вынести в `src/data/seed.js` и `src/data/activity.json`
  - [ ] 1.5 Утилита `storage.js` для sync с `localStorage` (load/save/reset)

2. Авторизация
  - [ ] 2.1 Простейшая форма логина (`/login`)
  - [ ] 2.2 Проверка по мок-данным (по email/паролю или токену-заглушке)
  - [ ] 2.3 Перенаправление на админку после логина
  - [ ] 2.4 Guard-компонент `<RequireAuth>` и контекст `AuthContext`
  - [ ] 2.5 Роли: `admin`, `manager`, `viewer` (ограничение действий в UI)

3. Список пользователей и управление ими
  - [ ] 3.1 Таблица с пользователями (`/users`)
  - [ ] 3.1.1 Поиск, сортировка, пагинация
  - [ ] 3.2 Редактирование (имя, роль) через модалку
  - [ ] 3.3 Удаление с подтверждением
  - [ ] 3.4 Сохранение в `localStorage`
  - [ ] 3.5 Импорт/экспорт JSON (кнопки Upload/Download)
  - [ ] 3.6 Базовая валидация полей

4. ACP (основной экран админ-панели)
  - [ ] 4.1 Навигация (Sidebar + Header)
  - [ ] 4.2 Карточки/блоки KPI: ActiveUsers, Sessions, Errors, Conversion
  - [ ] 4.3 Верстка и стили (CSS-модули, CSS variables)
  - [ ] 4.4 Адаптивность (mobile/tablet/desktop)
  - [ ] 4.5 Кнопка “Reset data” (ресид моков в `localStorage`)

5. Графики
  - [ ] 5.1 Сравнить библиотеки (Chart.js, Recharts)
  - [ ] 5.1.1 Прототип на Recharts (лучший DX, хорошо работает с мок-данными)
  - [ ] 5.1.2 Прототип на Chart.js (`react-chartjs-2`)
  - [ ] 5.1.3 Выбор библиотеки и фиксация решения в README
  - [ ] 5.2 Создать компонент `/dev/graph`
  - [ ] 5.2.1 Панель управления: метрика, тип (bar/line/area), диапазон дат
  - [ ] 5.3 Вывод графиков на основе мок-данных
  - [ ] 5.4 Переключение типа графика
  - [ ] 5.5 Вставить 1–2 графика на ACP

6. Recommendations from bot
  - [ ] 6.1 Структура: `src/{app,pages,components,features,data,utils}`
  - [ ] 6.2 Роутинг `react-router-dom` с базовым `Layout`
  - [ ] 6.3 ErrorBoundary и Suspense для ленивых страниц
  - [ ] 6.4 Состояние: локальный state + Context для auth
  - [ ] 6.5 ESLint + Prettier, скрипты `lint`/`format`
  - [ ] 6.6 NPM-скрипты: `dev`, `build`, `preview`
  - [ ] 6.7 Скрипт `seed` для сброса/наполнения `localStorage`
  - [ ] 6.8 Railway: `NIXPACKS`/build команда, preview env
  - [ ] 6.9 GitHub Actions: `lint + build` на PR
  - [ ] 6.10 Доступность: `aria-*`, видимые focus-обводки
  - [ ] 6.11 Тесты: Vitest + React Testing Library для auth и таблицы
  - [ ] 6.12 Документация: README — запуск, деплой, структура
  - [ ] 6.13 Производительность: мемоизация таблицы/графиков
  - [ ] 6.14 Темы: light/dark через CSS variables


# Bot instructions
1. Always start by reading this file and "Features ToDo" here.
2. Maintain a hierarchical task list with consistent numbering.
   - Checkboxes are only for sub-tasks (not for top-level tasks).
   - Top-level tasks must be numbered without checkboxes.
3. Always add nested sub-tasks under “Recommendations from Codex” when future steps are discovered during work.
4. Add new tasks for any user-requested changes.
5. Mark completed sub-tasks with a checked box; leave incomplete ones unchecked.
6. Keep "Features ToDo" up to date whenever task statuses change.
7. Поддерживай актуальными разделы "Now" и "ACP+Charts"

# Will be finaly

## Constraints
- JavaScript only (no TypeScript).
- No remote databases and no custom backend.
- Demo data must come from local sources (in-memory, JSON, or localStorage)

## Tech and infrastructure
- React + Vite (fast HMR).
- Railway is our hosting.
