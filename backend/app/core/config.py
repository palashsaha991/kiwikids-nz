from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import URL


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="KIWIKIDS_",
        case_sensitive=False,
    )

    app_name: str = "KiwiKids NZ API"
    app_version: str = "0.1.0"

    db_host: str = "postgres"
    db_port: int = 5432
    db_name: str = "kiwikids"
    db_user: str = "kiwikids_runtime"
    db_password_file: str = "/run/secrets/runtime_db_password"

    def read_db_password(self) -> str:
        secret_path = Path(self.db_password_file)

        if not secret_path.is_file():
            raise RuntimeError(
                f"Database password file not found: "
                f"{self.db_password_file}"
            )

        password = secret_path.read_text(
            encoding="utf-8"
        ).strip()

        if not password:
            raise RuntimeError(
                "Database password file is empty."
            )

        return password

    @property
    def database_url(self) -> URL:
        return URL.create(
            drivername="postgresql+psycopg",
            username=self.db_user,
            password=self.read_db_password(),
            host=self.db_host,
            port=self.db_port,
            database=self.db_name,
        )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
