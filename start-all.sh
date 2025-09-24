#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"

BACKEND_PORT=8000
FRONTEND_PORT=8080
FRONTEND_MODE="dev"   # dev | prod
DETACH=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --prod|--production)
      FRONTEND_MODE="prod"; shift ;;
    --dev)
      FRONTEND_MODE="dev"; shift ;;
    --detach)
      DETACH=1; shift ;;
    --help|-h)
      echo "Usage: $0 [--prod|--dev] [--detach]"; exit 0 ;;
    *) echo "[warn] Unknown arg $1"; shift ;;
  esac
done

echo "== MM Hub Dev Orchestrator =="
echo "Backend port: $BACKEND_PORT | Frontend port: $FRONTEND_PORT"

if lsof -nP -iTCP:${BACKEND_PORT} -sTCP:LISTEN >/dev/null 2>&1; then
  echo "[info] Port ${BACKEND_PORT} in use. Attempting to kill existing process..."
  lsof -nP -iTCP:${BACKEND_PORT} -sTCP:LISTEN -t | xargs -r kill -9 || true
  sleep 1
fi

if lsof -nP -iTCP:${FRONTEND_PORT} -sTCP:LISTEN >/dev/null 2>&1; then
  echo "[info] Port ${FRONTEND_PORT} in use. Attempting to kill existing process..."
  lsof -nP -iTCP:${FRONTEND_PORT} -sTCP:LISTEN -t | xargs -r kill -9 || true
  sleep 1
fi

echo "[start] Backend (FastAPI/Uvicorn)"
(
  cd "$BACKEND_DIR"
  # Activate virtualenv if exists (support both venv and .venv at repo root)
  if [[ -f "venv/bin/activate" ]]; then
    echo "[backend] Activating local venv"
    source venv/bin/activate
  elif [[ -f "$ROOT_DIR/.venv/bin/activate" ]]; then
    echo "[backend] Activating root .venv"
    source "$ROOT_DIR/.venv/bin/activate"
  else
    echo "[backend][warn] No virtualenv detected; using system python ($(which python3 || true))"
  fi

  # Quick dependency sanity check
  if ! python -c 'import fastapi, sqlalchemy, passlib' 2>/dev/null; then
    echo "[backend] Installing dependencies from requirements.txt..."
    pip install -q -r requirements.txt || {
      echo "[backend][error] Failed installing dependencies" >&2; exit 1; }
  fi
  echo "[backend] Starting Uvicorn (hot reload)"
  exec uvicorn main:app --host 0.0.0.0 --port ${BACKEND_PORT} --reload
) & BACKEND_PID=$!

echo "[start] Frontend (${FRONTEND_MODE})"
(
  cd "$ROOT_DIR"
  if [[ "$FRONTEND_MODE" == "dev" ]]; then
    if command -v bun >/dev/null 2>&1; then
      exec bun run dev
    else
      exec npm run dev
    fi
  else
    echo "[frontend] Building production bundle..."
    if command -v bun >/dev/null 2>&1; then
      bun run build:timeout || { echo "[frontend][error] build failed"; exit 1; }
    else
      npm run build || { echo "[frontend][error] build failed"; exit 1; }
    fi
    echo "[frontend] Starting SPA static server..."
    exec node serve-frontend.mjs
  fi
) & FRONTEND_PID=$!

echo "Backend PID: ${BACKEND_PID} | Frontend PID: ${FRONTEND_PID}"
echo "Detach mode: ${DETACH}"

cleanup() {
  echo "\n[shutdown] Stopping services..."
  kill ${BACKEND_PID} 2>/dev/null || true
  kill ${FRONTEND_PID} 2>/dev/null || true
  wait ${BACKEND_PID} 2>/dev/null || true
  wait ${FRONTEND_PID} 2>/dev/null || true
  echo "[done] All processes terminated."
}

trap cleanup INT TERM EXIT

echo "[health] Waiting for services..."

# Simple health wait loops (timeout 30s each)
START_TIME=$(date +%s)
while true; do
  if curl -s "http://localhost:${BACKEND_PORT}/health" >/dev/null 2>&1; then
    echo "[health] Backend ready"
    break
  fi
  NOW=$(date +%s); (( NOW-START_TIME > 30 )) && { echo "[health][warn] Backend health timeout"; break; }
  sleep 1
done

START_TIME=$(date +%s)
while true; do
  if curl -s -I "http://localhost:${FRONTEND_PORT}" >/dev/null 2>&1; then
    echo "[health] Frontend responding"
    break
  fi
  NOW=$(date +%s); (( NOW-START_TIME > 30 )) && { echo "[health][warn] Frontend startup timeout"; break; }
  sleep 1
done

echo "[info] Both services running (mode=${FRONTEND_MODE})."
if [[ "$DETACH" == "1" ]]; then
  echo "[info] Detach requested. Orchestrator exiting; processes continue (PIDs: $BACKEND_PID, $FRONTEND_PID)."
  trap - INT TERM EXIT
  exit 0
else
  echo "Press Ctrl+C to stop."
  wait
fi
