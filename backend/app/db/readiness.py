import psycopg

from app.core.config import get_settings


def check_database() -> None:
    settings = get_settings()

    with psycopg.connect(
        host=settings.db_host,
        port=settings.db_port,
        dbname=settings.db_name,
        user=settings.db_user,
        password=settings.database_password(),
        connect_timeout=3,
    ) as connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()

            if result != (1,):
                raise RuntimeError("Unexpected PostgreSQL readiness response")
