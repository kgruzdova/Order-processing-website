#!/usr/bin/env bash
# Добавляет или обновляет пользователя в auth/htpasswd для docker login к Registry.
# Запуск из каталога проекта: ./registry/create-user.sh <логин> <пароль>
# Пароль в argv виден в списке процессов; для скриптов лучше: REGISTRY_PASSWORD=... ./registry/create-user.sh user

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
AUTH_DIR="${SCRIPT_DIR}/auth"
HTPASSWD="${AUTH_DIR}/htpasswd"

usage() {
  echo "Использование: $0 <логин> <пароль>" >&2
  echo "Пример:  ./registry/create-user.sh admin 'ВашСекрет'" >&2
  exit 1
}

[[ $# -eq 2 ]] || usage
USER="$1"
PASS="${2:?}"

if [[ -z "${USER}" || -z "${PASS}" ]]; then
  usage
fi

mkdir -p "${AUTH_DIR}"

if [[ -f "${HTPASSWD}" ]]; then
  docker run --rm -v "${AUTH_DIR}:/auth" --entrypoint htpasswd httpd:2 \
    -Bb /auth/htpasswd "${USER}" "${PASS}"
else
  docker run --rm -v "${AUTH_DIR}:/auth" --entrypoint htpasswd httpd:2 \
    -Bbc /auth/htpasswd "${USER}" "${PASS}"
fi

chmod 600 "${HTPASSWD}"
echo "Готово: пользователь '${USER}' записан в ${HTPASSWD}"
echo "Перезапустите registry, если уже запущен: docker compose restart registry"
