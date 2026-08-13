import os
from pathlib import Path

from sqlalchemy.engine import URL


DEFAULT_DB_HOST = "postgres"
DEFAULT_DB_PORT = 5432
DEFAULT_DB_NAME = "kiwikids"
DEFAULT_DB_USER = "kiwikids_migrator"
DEFAULT_PASSWORD_FILE = "/run/secrets/migration_db_password"


def _read_password() -> str:
    password_file = os.getenv(
        "KIWIKIDS_MIGRATION_DB_PASSWORD_FILE",
        DEFAULT_PASSWORD_FILE,
    )

    secret_path = Path(password_file)

    if secret_path.is_file():
        return secret_path.read_text(encoding="utf-8").strip()

    password = os.getenv("KIWIKIDS_MIGRATION_DB_PASSWORD")

    if password:
        return password

    raise RuntimeError(
        "Migration database password not available. "
        "Provide KIWIKIDS_MIGRATION_DB_PASSWORD_FILE "
        "or KIWIKIDS_MIGRATION_DB_PASSWORD."
    )


def build_migration_database_url() -> URL:
    return URL.create(
        drivername="postgresql+psycopg",
        username=os.getenv(
            "KIWIKIDS_MIGRATION_DB_USER",
            DEFAULT_DB_USER,
        ),
        password=_read_password(),
        host=os.getenv(
            "KIWIKIDS_MIGRATION_DB_HOST",
            DEFAULT_DB_HOST,
        ),
        port=int(
            os.getenv(
                "KIWIKIDS_MIGRATION_DB_PORT",
                str(DEFAULT_DB_PORT),
            )
        ),
        database=os.getenv(
            "KIWIKIDS_MIGRATION_DB_NAME",
            DEFAULT_DB_NAME,
        ),
    )
