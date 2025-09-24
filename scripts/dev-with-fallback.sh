#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
PORT=8080
TIMEOUT_SECONDS=${1:-30}

start_dev() {
  if command -v bun >/dev/null 2>&1; then
    bun run dev &
  elif command -v npm >/dev/null 2>&1; then
    npm run dev &
  else
    echo "[frontend][warn] Neither bun nor npm found; attempting to run vite directly"
    vite &
  fi
  DEV_PID=$!
  echo "[frontend] Dev server started (pid=${DEV_PID}), waiting up to ${TIMEOUT_SECONDS}s for http://localhost:${PORT}..."
  echo $DEV_PID
}

wait_for_port() {
  local start_ts=$(date +%s)
  while true; do
    if curl -s -I "http://localhost:${PORT}" >/dev/null 2>&1; then
      echo "[frontend] Dev server is responding on port ${PORT}."
      return 0
    fi
    local now=$(date +%s)
    if (( now - start_ts > TIMEOUT_SECONDS )); then
      echo "[frontend][warn] Dev server not responding after ${TIMEOUT_SECONDS}s."
      return 1
    fi
    sleep 1
  done
}

DEV_PID=$(start_dev)
if wait_for_port; then
  # Keep the dev process in foreground
  echo "[frontend] Attaching to dev server logs..."
  wait ${DEV_PID}
  exit $?
else
  echo "[frontend] Killing stalled dev server (pid=${DEV_PID})..."
  kill ${DEV_PID} 2>/dev/null || true
  sleep 1
  if [[ -d "${ROOT_DIR}/dist" ]]; then
    echo "[frontend] Falling back to static server (dist/) on port ${PORT}"
    cd "${ROOT_DIR}"
    exec node serve-frontend.mjs
  else
    echo "[frontend][error] No dist/ folder found. Run: bun run build (or npm run build)."
    exit 1
  fi
fi
