from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool, text

from app.db.base import Base
from app.db.migration_config import build_migration_database_url
from app.models import ECEService


config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)


# Importing ECEService registers the model with Base.metadata.
target_metadata = Base.metadata


def get_url() -> str:
    return build_migration_database_url().render_as_string(
        hide_password=False
    )


def run_migrations_offline() -> None:
    context.configure(
        url=get_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        version_table_schema="app",
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    configuration = config.get_section(
        config.config_ini_section,
        {}
    )

    configuration["sqlalchemy.url"] = get_url()

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        # Escalate only for the migration session.
        connection.execute(text("SET ROLE kiwikids_migration"))
        connection.execute(text("SET ROLE kiwikids_admin"))

        # SQLAlchemy 2.x automatically opens a transaction when
        # executing SET ROLE. Commit that transaction first so Alembic
        # can own and commit its migration transaction correctly.
        connection.commit()

        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            version_table_schema="app",
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
