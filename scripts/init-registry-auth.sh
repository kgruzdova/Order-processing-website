#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
AUTH_DIR="${ROOT}/registry/auth"
HTPASSWD="${AUTH_DIR}/htpasswd"

mkdir -p "${AUTH_DIR}"

if [[ -f "${HTPASSWD}" ]]; then
  echo "Уже существует: ${HTPASSWD}"
  echo "Удалите файл или отредактируйте пользователя вручную (htpasswd -B)."
  exit 0
fi

REGISTRY_USER="${REGISTRY_USER:-registry}"
if [[ -n "${REGISTRY_PASSWORD:-}" ]]; then
  REGISTRY_PASS="${REGISTRY_PASSWORD}"
else
  read -r -s -p "Пароль для Docker Registry (пользователь '${REGISTRY_USER}'): " REGISTRY_PASS
  echo
fi
if [[ -z "${REGISTRY_PASS}" ]]; then
  echo "Пароль не может быть пустым (или задайте REGISTRY_PASSWORD в окружении)."
  exit 1
fi

docker run --rm --entrypoint htpasswd httpd:2 -Bbn "${REGISTRY_USER}" "${REGISTRY_PASS}" > "${HTPASSWD}"
chmod 600 "${HTPASSWD}"
echo "Создан ${HTPASSWD} (пользователь: ${REGISTRY_USER})"
echo "Клиент: docker login <ваш_хост>:5000 -u ${REGISTRY_USER}"
