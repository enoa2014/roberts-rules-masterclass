#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${ROOT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
DB_PATH="${DB_PATH:-$ROOT_DIR/data/course.db}"
BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/data/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

if [[ ! -f "$DB_PATH" ]]; then
  echo "[backup] database not found: $DB_PATH"
  exit 1
fi

mkdir -p "$BACKUP_DIR"

timestamp="$(date +%Y%m%d_%H%M%S)"
target="$BACKUP_DIR/course_${timestamp}.db"

if command -v sqlite3 >/dev/null 2>&1; then
  sqlite3 "$DB_PATH" ".backup '$target'"
else
  BACKUP_SRC="$DB_PATH" BACKUP_DST="$target" node <<'EOF'
const Database = require("better-sqlite3");

const src = process.env.BACKUP_SRC;
const dst = process.env.BACKUP_DST;

if (!src || !dst) {
  console.error("[backup] missing BACKUP_SRC or BACKUP_DST");
  process.exit(1);
}

async function main() {
  const db = new Database(src, { fileMustExist: true, readonly: true });
  try {
    await db.backup(dst);
  } finally {
    db.close();
  }
}

main().catch((error) => {
  console.error("[backup] better-sqlite3 backup failed", error);
  process.exit(1);
});
EOF
fi
find "$BACKUP_DIR" -name "course_*.db" -mtime +"$RETENTION_DAYS" -delete

echo "[backup] created: $target"
