import psycopg

from app.core.config import get_settings


def check_database() -> None:
    """
    Verify that PostgreSQL is reachable and can execute a simple query.

    Returns None when healthy.
    Raises RuntimeError when the database is unavailable.
    """
    settings = get_settings()

    try:
        with psycopg.connect(
            host=settings.db_host,
            port=settings.db_port,
            dbname=settings.db_name,
            user=settings.db_user,
            password=settings.read_db_password(),
            connect_timeout=3,
        ) as connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                result = cursor.fetchone()

                if result != (1,):
                    raise RuntimeError(
                        "Database readiness query returned "
                        "an unexpected result."
                    )

    except (psycopg.Error, RuntimeError, OSError) as exc:
        raise RuntimeError(
            "Database dependency is not ready"
        ) from exc
