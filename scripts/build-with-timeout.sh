#!/usr/bin/env bash
set -euo pipefail

# Build frontend with a timeout to avoid hanging processes
TIMEOUT_SECONDS=${1:-120}
FLAG_FILE="/tmp/vite_build_timeout_flag_$$"

echo "[build] Starting vite build with ${TIMEOUT_SECONDS}s timeout..."

if command -v gtimeout >/dev/null 2>&1; then
  TIMEOUT_BIN=gtimeout
elif command -v timeout >/dev/null 2>&1; then
  TIMEOUT_BIN=timeout
else
  TIMEOUT_BIN=""
fi

run_build() {
  if command -v bun >/dev/null 2>&1; then
    bun run build
  else
    npm run build
  fi
}

if [[ -n "${TIMEOUT_BIN}" ]]; then
  if ! ${TIMEOUT_BIN} ${TIMEOUT_SECONDS} bash -c 'run_build'; then
    echo "[build][warn] Build exceeded ${TIMEOUT_SECONDS}s. Attempting to kill lingering vite/esbuild processes..."
    pkill -f "vite|esbuild" 2>/dev/null || true
    exit 124
  fi
else
  # Manual watchdog fallback without GNU timeout
  TIMEOUT_HIT=0
  run_build & BUILD_PID=$!
  (
    sleep ${TIMEOUT_SECONDS}
    if kill -0 ${BUILD_PID} 2>/dev/null; then
      echo "[build][warn] Manual timeout reached (${TIMEOUT_SECONDS}s). Killing build (pid=${BUILD_PID})..."
      TIMEOUT_HIT=1
      touch "${FLAG_FILE}" || true
      kill ${BUILD_PID} 2>/dev/null || true
      pkill -f "vite|esbuild" 2>/dev/null || true
    fi
  ) & WATCHDOG_PID=$!

  wait ${BUILD_PID} 2>/dev/null || true
  BUILD_STATUS=$?
  # Build finished; stop watchdog
  kill ${WATCHDOG_PID} 2>/dev/null || true

  if [[ ${BUILD_STATUS} -ne 0 ]]; then
    echo "[build][error] Build failed with status ${BUILD_STATUS}"
    exit ${BUILD_STATUS}
  fi

  if [[ -f "${FLAG_FILE}" ]]; then
    echo "[build][error] Build terminated due to timeout after ${TIMEOUT_SECONDS}s"
    rm -f "${FLAG_FILE}" 2>/dev/null || true
    exit 124
  fi
fi

echo "[build] Completed successfully."
