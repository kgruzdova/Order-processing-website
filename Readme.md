# Autello

## Краткое описание

Веб-приложение для приёма заявок (лидов) от клиентов, сбора поведенческих метрик по форме и админ-интерфейсом для настроек. Backend предоставляет REST API под префиксом `/api`, фронтенд отдаётся как статика через Nginx; при продакшен-развёртывании описан в `docker-compose.yml`.

## Использованные технологии

- **Языки:** Python 3 (backend), TypeScript (frontend)
- **Backend:** FastAPI, SQLAlchemy, Pydantic / pydantic-settings, Uvicorn, psycopg (PostgreSQL)
- **Frontend:** Vite, TypeScript
- **Инфраструктура:** Docker Compose, Nginx, PostgreSQL 16, Watchtower, опционально pgAdmin 4 и Docker Registry (через профиль `ops`)

## Реализованный функционал

- Публичная страница с формой заявки (маршрут по умолчанию) и отправкой данных на API
- Сбор и отправка метрик поведения (время на странице, клики, зоны наведения, повторные визиты, технический контекст)
- Раздел администратора по пути `/admin` (заголовок страницы: «Autello — админ»)
- REST CRUD для заявок, метрик и админ-конфигурации
- Проверка работоспособности backend: `GET /health`
- При развёртывании через Compose: API доступно только через Nginx (`/api`), backend-порт не публикуется на хост
- Для `GET /api/admins` без `Authorization` Nginx возвращает `403 Forbidden`
- Маршруты `/docs`, `/redoc`, `/openapi.json` и `/pgadmin/` закрыты снаружи (`404`)

## Инструкция по запуску

### Вариант 1: Docker Compose (как в репозитории)

1. Скопируйте `.env.example` в `.env` и задайте переменные (минимум `POSTGRES_PASSWORD`; остальные опциональны — см. комментарии в `docker-compose.yml`).
2. Соберите фронтенд: в каталоге `frontend` выполните `npm install` и `npm run build` (в Nginx монтируется `./frontend/dist`).
3. Запуск базового контура: `docker compose up -d` из корня проекта.
4. Сайт: `http://localhost:${HTTP_PORT:-80}` (порт задаётся в `.env`). API снаружи: тот же хост, путь `/api/...`.
5. Если нужен pgAdmin/Registry (временно): `docker compose --profile ops up -d pgadmin registry`.
6. Для Registry перед первым запуском выполните `./scripts/init-registry-auth.sh` (см. комментарии в `docker-compose.yml`).

### Вариант 2: Локальная разработка (общая идея)

- **Backend:** установить зависимости из `backend/requirements.txt`, задать `DATABASE_URL` (или `.env` с `database_url` для `core.config.Settings`), запустить Uvicorn с приложением `main:app` (порт по умолчанию в healthcheck в compose — 8000).
- **Frontend:** в `frontend` — `npm run dev` (Vite); для запросов к API может понадобиться прокси или тот же origin, что и у backend.

Подробности по сети, Registry и TLS — в комментариях в `docker-compose.yml` и `nginx/conf.d/default.conf`.

## Доступы

| Ресурс | Как получить доступ |
|--------|----------------------|
| Код | Укажите URL вашего Git-репозитория (GitHub/GitLab и т.д.) |
| Приложение (сайт) | Production/staging URL или `http://<хост>:${HTTP_PORT:-80}` при локальном Compose |
| pgAdmin | Выключен по умолчанию. Включается профилем `ops`; при текущем nginx-конфиге внешний путь `/pgadmin/` закрыт (`404`) |
| Docker Registry | Выключен по умолчанию. Включается профилем `ops` (порт из `REGISTRY_PORT`) |

*Замените плейсхолдеры на реальные ссылки и учётные данные для вашей команды.*

## API

Базовый префикс API: **`/api`**. Ниже — эндпоинты и назначение.

### Безопасность и доступ к API через Nginx

- Backend слушает только внутреннюю docker-сеть (`8000/tcp` без публикации на хост).
- Снаружи API доступно только через Nginx (`http://<host>/api/...`).
- Для `GET /api/admins` без заголовка `Authorization` Nginx возвращает `403 Forbidden` (HTML-страница nginx).
- `/docs`, `/redoc`, `/openapi.json`, `/pgadmin/` закрыты через Nginx (`404`).

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

Интерактивная схема запросов и тел может быть доступна только во внутреннем контуре/локально; при текущем прод-конфиге через Nginx маршруты `/docs`, `/redoc`, `/openapi.json` закрыты.

### Команды бота

Не применимо — проект не содержит Telegram/Discord-бота; взаимодействие через HTTP API и веб-интерфейс.

## Статус проекта

**В разработке / поддерживается** — в репозитории есть полный контур развёртывания (БД, API, фронт, опционально registry/watchtower).

