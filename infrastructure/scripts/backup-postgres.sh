#!/usr/bin/env bash
set -Eeuo pipefail

# Backups may contain application data.
# Ensure newly created files are owner-readable only.
umask 077

CONTAINER="kiwikids-postgres"
DATABASE="kiwikids"
DB_USER="kiwikids_app"

BACKUP_DIR="/srv/postgresql/backups"
TIMESTAMP="$(date -u +'%Y%m%dT%H%M%SZ')"
BACKUP_FILE="${BACKUP_DIR}/kiwikids_${TIMESTAMP}.dump"
CHECKSUM_FILE="${BACKUP_FILE}.sha256"

RETENTION_DAYS="${RETENTION_DAYS:-7}"

cleanup_partial() {
    if [[ -n "${BACKUP_FILE:-}" && -f "$BACKUP_FILE" ]]; then
        rm -f "$BACKUP_FILE"
    fi

    if [[ -n "${CHECKSUM_FILE:-}" && -f "$CHECKSUM_FILE" ]]; then
        rm -f "$CHECKSUM_FILE"
    fi
}

if [[ "${EUID}" -ne 0 ]]; then
    echo "ERROR: This script must run as root." >&2
    echo "Run: sudo $0" >&2
    exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
    echo "ERROR: docker command not found." >&2
    exit 1
fi

install -d \
    -o root \
    -g root \
    -m 0700 \
    "$BACKUP_DIR"

if ! docker inspect "$CONTAINER" >/dev/null 2>&1; then
    echo "ERROR: PostgreSQL container not found: $CONTAINER" >&2
    exit 1
fi

if ! docker exec "$CONTAINER" \
    pg_isready \
        -U "$DB_USER" \
        -d "$DATABASE" \
        >/dev/null; then
    echo "ERROR: PostgreSQL is not ready." >&2
    exit 1
fi

echo "Creating backup: $BACKUP_FILE"

trap cleanup_partial ERR INT TERM

docker exec "$CONTAINER" sh -c '
    export PGPASSWORD="$(cat /run/secrets/postgres_password)"

    exec pg_dump \
        --username="kiwikids_app" \
        --dbname="kiwikids" \
        --format=custom \
        --compress=9 \
        --no-password
' > "$BACKUP_FILE"

if [[ ! -s "$BACKUP_FILE" ]]; then
    echo "ERROR: Backup file is empty." >&2
    exit 1
fi

chmod 0600 "$BACKUP_FILE"

sha256sum "$BACKUP_FILE" > "$CHECKSUM_FILE"
chmod 0600 "$CHECKSUM_FILE"

echo "Verifying backup checksum..."
sha256sum --check "$CHECKSUM_FILE" >/dev/null

echo "Verifying PostgreSQL archive..."

docker exec -i "$CONTAINER" \
    pg_restore --list \
    < "$BACKUP_FILE" \
    >/dev/null

echo "Backup archive verified."

# Harden any backups created before umask 077 was introduced.
find "$BACKUP_DIR" \
    -type f \
    \( \
        -name 'kiwikids_*.dump' \
        -o -name 'kiwikids_*.dump.sha256' \
    \) \
    -exec chmod 0600 {} +

find "$BACKUP_DIR" \
    -type f \
    \( \
        -name 'kiwikids_*.dump' \
        -o -name 'kiwikids_*.dump.sha256' \
    \) \
    -mtime +"$RETENTION_DAYS" \
    -delete

trap - ERR INT TERM

echo
echo "Backup successful:"
ls -lh "$BACKUP_FILE" "$CHECKSUM_FILE"
