# KiwiKids PostgreSQL Backup and Restore Runbook

## Backup

KiwiKids PostgreSQL backups are created using PostgreSQL custom-format dumps.

Backup location:

`/srv/postgresql/backups`

Each backup has:

- `.dump` PostgreSQL archive
- `.dump.sha256` integrity checksum

Manual backup:

    sudo /home/devops/projects/kiwikids-nz/infrastructure/scripts/backup-postgres.sh

## Automated Backup

A systemd timer runs the backup nightly.

Check timer:

    systemctl list-timers --all | grep kiwikids-postgres-backup

Check previous execution:

    sudo systemctl status kiwikids-postgres-backup.service

View logs:

    sudo journalctl -u kiwikids-postgres-backup.service

## Verify Backup Integrity

Find latest backup:

    LATEST=$(sudo find /srv/postgresql/backups \
      -name 'kiwikids_*.dump' \
      -printf '%T@ %p\n' | sort -nr | head -1 | cut -d' ' -f2-)

    echo "$LATEST"

Verify checksum:

    sudo sha256sum -c "${LATEST}.sha256"

Expected result:

`OK`

## Restore Test

Never test restoration directly against the production database.

Create temporary database:

    sudo docker exec kiwikids-postgres sh -c '
      export PGPASSWORD="$(cat /run/secrets/postgres_password)"

      dropdb \
        --username=kiwikids_app \
        --if-exists \
        kiwikids_restore_test

      createdb \
        --username=kiwikids_app \
        kiwikids_restore_test
    '

Restore latest backup:

    sudo cat "$LATEST" | sudo docker exec -i kiwikids-postgres sh -c '
      export PGPASSWORD="$(cat /run/secrets/postgres_password)"

      pg_restore \
        --username=kiwikids_app \
        --dbname=kiwikids_restore_test \
        --no-password \
        --exit-on-error
    '

Validate application data:

    sudo docker exec kiwikids-postgres sh -c '
      export PGPASSWORD="$(cat /run/secrets/postgres_password)"

      psql \
        --username=kiwikids_app \
        --dbname=kiwikids_restore_test \
        --command="SELECT COUNT(*) FROM app.ece_services;"
    '

Clean up:

    sudo docker exec kiwikids-postgres sh -c '
      export PGPASSWORD="$(cat /run/secrets/postgres_password)"

      dropdb \
        --username=kiwikids_app \
        --if-exists \
        kiwikids_restore_test
    '

## Security Notes

- Backup directory is root restricted.
- Database secrets are not stored in Git.
- PostgreSQL is not exposed publicly.
- Restore testing uses a separate temporary database.
- Backup integrity is checked using SHA-256.
