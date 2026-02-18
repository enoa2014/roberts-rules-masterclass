#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${RELEASE_VERIFY_BASE_URL:-http://127.0.0.1:38080}"
DEFAULT_SMOKE_TEST_IP="203.0.113.$(((RANDOM + $$) % 254 + 1))"
SMOKE_TEST_IP="${RELEASE_VERIFY_SMOKE_TEST_IP:-${DEFAULT_SMOKE_TEST_IP}}"

run_step() {
  local name="$1"
  shift

  echo
  echo "[release:verify] >>> ${name}"
  "$@"
  echo "[release:verify] <<< ${name} ok"
}

health_check() {
  local health_url="${BASE_URL%/}/api/health"
  local body
  body="$(curl -fsS "${health_url}")"
  echo "[release:verify] health=${body}"
}

smoke_api() {
  SMOKE_BASE_URL="${BASE_URL}" npm run smoke:api
}

smoke_rate_limit() {
  SMOKE_BASE_URL="${BASE_URL}" \
  SMOKE_TEST_IP="${SMOKE_TEST_IP}" \
  npm run smoke:rate-limit
}

main() {
  echo "[release:verify] start base_url=${BASE_URL} smoke_test_ip=${SMOKE_TEST_IP}"
  echo "[release:verify] note this verification writes smoke data (sessions/assignments/posts)"

  run_step "health-check" health_check
  run_step "smoke-api" smoke_api
  run_step "smoke-rate-limit" smoke_rate_limit

  echo
  echo "[release:verify] all checks passed"
}

main "$@"
