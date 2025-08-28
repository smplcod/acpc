# Project description:

ACP+Charts will become an admin dashboard that visualizes application metrics with interactive charts. Administrators can monitor key indicators, manage data, and explore analytics through a responsive web interface built with React and Vite. The repository currently includes a small counter demo while chart components are under active development.

# Features ToDo
- 1. Mock-данные
  - [ ] 1.1 Узнать, что такое мок-данные
  - [ ] 1.2 Создать мок-данные (пользователи, роли, активность)
- 2. Авторизация
  - [ ] 2.1 Простейшая форма логина
  - [ ] 2.2 Проверка по мок-данным (есть ли такой пользователь, его роль)
  - [ ] 2.3 Перенаправление на админку
- 3. Список пользователей и управление ими
  - [ ] 3.1 Таблица с пользователями
  - [ ] 3.2 Возможность редактировать (роль, имя)
  - [ ] 3.3 Возможность удалить
  - [ ] 3.4 Сохранение в localStorage
- 4. ACP (основной экран админ-панели)
  - [ ] 4.1 Навигация
  - [ ] 4.2 Карточки/блоки с показателями
  - [ ] 4.3 Верстка и стили
- 5. Графики
  - [ ] 5.1 Сравнить и выбрать библиотеку (Chart.js, Recharts и т.д.)
  - [ ] 5.2 Создать компонент /dev/graph
  - [ ] 5.3 Вывод графиков на основе мок-данных
  - [ ] 5.4 Возможность менять тип графика (bar, line и т.п.)
- 6. Recommendations from bot


# Bot instructions

1. Always start by reading this file and Features ToDo here.
2. Maintain a hierarchical task list with consistent numbering.
   - Checkboxes are only for sub-tasks (not for top-level tasks).
   - Top-level tasks must be numbered without checkboxes.
3. Always add nested sub-tasks under “Recommendations from Codex” when future steps are discovered during work.
4. Add new tasks for any user-requested changes.
5. Mark completed sub-tasks with a checked box; leave incomplete ones unchecked.
6. Keep TODO.md up to date whenever task statuses change.

## Constraints
- JavaScript only (no TypeScript).
- No remote databases and no custom backend.
- Demo data must come from local sources (in-memory, JSON, or localStorage)

## Tech and infrastructure
- React + Vite (fast HMR).
- Railway is our hosting.
