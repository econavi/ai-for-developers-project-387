### Hexlet tests and linter status:
[![Actions Status](https://github.com/econavi/ai-for-developers-project-387/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/econavi/ai-for-developers-project-387/actions)  

#### Запуск:
`cd backend && npm run dev` # порт 3001  
`cd frontend && npm run dev` # порт 5173 → /api прокси на 3001  

#### Ссылка на прод:
https://calendar-call-production.up.railway.app

#### Агентный контур (GitHub Actions)
- `/oc …` или `/opencode …` первой строкой комментария к issue/PR — вызов агента
- PR от человека автоматически ревьюится агентом (`opencode-review`)
- Ночной Lighthouse-аудит (23:23 UTC ≈ 02:23 МСК) публикует отчёт в скользящий
  issue с лейблом `lighthouse`; туда же приходит уведомление, если прогон упал.
  Ручной запуск — Actions → lighthouse → Run workflow

##### Осознанные компромиссы и roadmap
Зафиксировано, чтобы эти пункты не считались незакрытыми замечаниями:

- **Lighthouse пиннится на мажор** (`lighthouse@12`), а не на точную версию:
  точный пин требует пакета в devDependencies frontend и утяжеляет установку.
  Минорные сдвиги методики возможны, для ночных трендов некритичны.
- **Одна выборка за прогон**: баллы шумят в пределах ±3–5. Медиана из трёх
  прогонов и порог деградации (fail при performance < N) — следующий шаг развития.
- **Экшены подключены тегом `@latest`**, а не по SHA: полный пин по SHA требует
  правки hexlet-check.yml (DO NOT EDIT), частичный пин гарантий не добавляет.
- **Пустые красные прогоны `opencode-review` на ботских PR** (release-please):
  платформенное поведение GitHub — ран создаётся, но джобы не стартуют для
  актора без прав записи. YAML-уровнем не лечится, расходов API не несёт.
- **Внешний пользователь может вызвать агента** командой в issue: осознанное
  окно учебного проекта; в проде триггер стоит ограничить участниками команды.
