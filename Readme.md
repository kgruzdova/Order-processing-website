# Autello

## Краткое описание

Веб-приложение для приёма заявок (лидов) от клиентов, сбора поведенческих метрик по форме и админ-интерфейсом для настроек. Backend предоставляет REST API под префиксом `/api`, фронтенд отдаётся как статика через Nginx; при продакшен-развёртывании описан в `docker-compose.yml`.

## Использованные технологии

- **Языки:** Python 3 (backend), TypeScript (frontend)
- **Backend:** FastAPI, SQLAlchemy, Pydantic / pydantic-settings, Uvicorn, psycopg (PostgreSQL)
- **Frontend:** Vite, TypeScript
- **Инфраструктура:** Docker Compose, Nginx, PostgreSQL 16, pgAdmin 4, опционально Docker Registry и Watchtower (см. `docker-compose.yml`)

## Реализованный функционал

- Публичная страница с формой заявки (маршрут по умолчанию) и отправкой данных на API
- Сбор и отправка метрик поведения (время на странице, клики, зоны наведения, повторные визиты, технический контекст)
- Раздел администратора по пути `/admin` (заголовок страницы: «Autello — админ»)
- REST CRUD для заявок, метрик и админ-конфигурации
- Проверка работоспособности backend: `GET /health`
- При развёртывании через Compose: проксирование `/api`, `/docs`, `/redoc`, `/openapi.json`, доступ к pgAdmin по префиксу `/pgadmin/`

## Инструкция по запуску

### Вариант 1: Docker Compose (как в репозитории)

1. Скопируйте `.env.example` в `.env` и задайте переменные (в т.ч. `POSTGRES_PASSWORD`, `PGADMIN_DEFAULT_PASSWORD` и при необходимости `PGADMIN_DEFAULT_EMAIL` — см. комментарии в `docker-compose.yml`).
2. Соберите фронтенд: в каталоге `frontend` выполните `npm install` и `npm run build` (в Nginx монтируется `./frontend/dist`).
3. При использовании Registry (по желанию): перед первым запуском выполните `./scripts/init-registry-auth.sh` (см. комментарии в начале `docker-compose.yml`).
4. Запуск: `docker compose up -d` из корня проекта.
5. Сайт: `http://localhost:${HTTP_PORT:-80}` (порт задаётся в `.env`). API снаружи: тот же хост, путь `/api/...`. Документация Swagger: `/docs`.

### Вариант 2: Локальная разработка (общая идея)

- **Backend:** установить зависимости из `backend/requirements.txt`, задать `DATABASE_URL` (или `.env` с `database_url` для `core.config.Settings`), запустить Uvicorn с приложением `main:app` (порт по умолчанию в healthcheck в compose — 8000).
- **Frontend:** в `frontend` — `npm run dev` (Vite); для запросов к API может понадобиться прокси или тот же origin, что и у backend.

Подробности по сети, Registry и TLS — в комментариях в `docker-compose.yml` и `nginx/conf.d/default.conf`.

## Доступы

| Ресурс | Как получить доступ |
|--------|----------------------|
| Код | Укажите URL вашего Git-репозитория (GitHub/GitLab и т.д.) |
| Приложение (сайт) | Production/staging URL или `http://<хост>:${HTTP_PORT:-80}` при локальном Compose |
| pgAdmin | `http://<хост>/pgadmin/` (логин/пароль из `.env`) |
| Docker Registry | `:<REGISTRY_PORT>` на хосте, учётные данные из `registry/auth/htpasswd` |

*Замените плейсхолдеры на реальные ссылки и учётные данные для вашей команды.*

## API

Базовый префикс API: **`/api`**. Ниже — эндпоинты и назначение.

### Служебные

| Метод | Путь | Описание |
|--------|------|----------|
| GET | `/health` | Проверка живости сервиса, ответ `{"status": "ok"}` |

### Заявки (лиды) — `/api/leads`

| Метод | Путь | Описание |
|--------|------|----------|
| POST | `/api/leads` | Создать заявку |
| GET | `/api/leads` | Список заявок (`skip`, `limit`) |
| GET | `/api/leads/{lead_id}` | Получить заявку по id |
| PUT | `/api/leads/{lead_id}` | Обновить заявку |
| DELETE | `/api/leads/{lead_id}` | Удалить заявку |

### Поведенческие метрики — `/api/behavior-metrics`

| Метод | Путь | Описание |
|--------|------|----------|
| POST | `/api/behavior-metrics` | Создать запись метрик |
| GET | `/api/behavior-metrics` | Список записей (`skip`, `limit`) |
| GET | `/api/behavior-metrics/{application_id}` | Получить метрики по `application_id` |
| PUT | `/api/behavior-metrics/{application_id}` | Обновить метрики |
| DELETE | `/api/behavior-metrics/{application_id}` | Удалить метрики |

### Админ-конфигурация — `/api/admin-config`

| Метод | Путь | Описание |
|--------|------|----------|
| POST | `/api/admin-config` | Создать конфигурацию |
| GET | `/api/admin-config` | Список конфигураций (`skip`, `limit`; фронт запрашивает с `limit=1` для последней) |
| GET | `/api/admin-config/{config_id}` | Получить конфиг по id |
| PUT | `/api/admin-config/{config_id}` | Обновить конфиг |
| DELETE | `/api/admin-config/{config_id}` | Удалить конфиг |

Интерактивная схема запросов и тел: **Swagger UI** по адресу `/docs`, **ReDoc** — `/redoc`, схема OpenAPI — `/openapi.json` (через Nginx при compose-развёртывании).

### Команды бота

Не применимо — проект не содержит Telegram/Discord-бота; взаимодействие через HTTP API и веб-интерфейс.

## Статус проекта

**В разработке / поддерживается** — в репозитории есть полный контур развёртывания (БД, API, фронт, опционально registry/watchtower).

