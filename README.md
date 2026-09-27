# Residents Hierarchy

Приложение для отображения иерархии жителей по адресам: город → район → улица → житель.

## Стек

- Backend: Node.js, Express, TypeScript, PostgreSQL
- Frontend: React, TypeScript, Redux Toolkit, Vite
- Инфраструктура: Docker, docker compose

## Структура

.
--server/ # Express API
--frontend/ # React SPA
--docker-compose.dev.yml


## Запуск

Требуется Docker.

```sh
npm run dev
```

Поднимает Postgres, API и фронтенд. При старте API применяет схему БД и заливает тестовые данные.

Frontend: http://localhost:5173

API: http://localhost:4000

Postgres: localhost:5432

## Остановка

```sh
npm run down
```

## Полный сброс (включая БД)

```sh
npm run reset
```

## API

GET /api/cities — справочник городов

GET /api/citizens — список жителей

GET /api/hierarchy — дерево иерархии

GET /health — проверка живости