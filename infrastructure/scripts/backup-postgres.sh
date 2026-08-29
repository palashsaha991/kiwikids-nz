#!/usr/bin/env bash
set -Eeuo pipefail

CONTAINER="kiwikids-postgres"
DATABASE="kiwikids"
DB_USER="kiwikids_app"

BACKUP_DIR="/srv/postgresql/backups"
TIMESTAMP="$(date -u +'%Y%m%dT%H%M%SZ')"
BACKUP_FILE="${BACKUP_DIR}/kiwikids_${TIMESTAMP}.dump"
CHECKSUM_FILE="${BACKUP_FILE}.sha256"

RETENTION_DAYS="${RETENTION_DAYS:-7}"

if ! sudo docker inspect "$CONTAINER" >/dev/null 2>&1; then
    echo "ERROR: PostgreSQL container not found: $CONTAINER" >&2
    exit 1
fi

if ! sudo docker exec "$CONTAINER" \
    pg_isready -U "$DB_USER" -d "$DATABASE" >/dev/null; then
    echo "ERROR: PostgreSQL is not ready" >&2
    exit 1
fi

echo "Creating backup: $BACKUP_FILE"

sudo docker exec "$CONTAINER" sh -c '
    export PGPASSWORD="$(cat /run/secrets/postgres_password)"
    exec pg_dump \
        --username="kiwikids_app" \
        --dbname="kiwikids" \
        --format=custom \
        --compress=9 \
        --no-password
' | sudo tee "$BACKUP_FILE" >/dev/null

if [ ! -s "$BACKUP_FILE" ]; then
    echo "ERROR: Backup file is empty" >&2
    sudo rm -f "$BACKUP_FILE"
    exit 1
fi

sudo sha256sum "$BACKUP_FILE" | sudo tee "$CHECKSUM_FILE" >/dev/null

echo "Verifying backup archive..."

sudo docker exec -i "$CONTAINER" \
    pg_restore --list < "$BACKUP_FILE" >/dev/null

echo "Backup archive verified."

sudo find "$BACKUP_DIR" \
    -type f \
    \( -name 'kiwikids_*.dump' -o -name 'kiwikids_*.dump.sha256' \) \
    -mtime +"$RETENTION_DAYS" \
    -delete

echo
echo "Backup successful:"
sudo ls -lh "$BACKUP_FILE" "$CHECKSUM_FILE"
