#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${ROOT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
DB_PATH="${DB_PATH:-$ROOT_DIR/data/course.db}"
BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/data/backups}"
SOURCE_PATH="${1:-}"

if [[ -z "$SOURCE_PATH" ]]; then
  echo "Usage: bash scripts/restore.sh <backup_file>"
  echo
  echo "Available backups:"
  ls -1 "$BACKUP_DIR"/course_*.db 2>/dev/null || echo "(none)"
  exit 1
fi

if [[ ! -f "$SOURCE_PATH" ]]; then
  echo "[restore] backup file not found: $SOURCE_PATH"
  exit 1
fi

mkdir -p "$(dirname "$DB_PATH")"

if [[ -f "$DB_PATH" ]]; then
  cp "$DB_PATH" "${DB_PATH}.before_restore_$(date +%Y%m%d_%H%M%S)"
fi

cp "$SOURCE_PATH" "$DB_PATH"

echo "[restore] restored database from: $SOURCE_PATH"
echo "[restore] target database: $DB_PATH"
