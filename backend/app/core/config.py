from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "KiwiKids NZ API"
    app_version: str = "0.1.0"

    db_host: str = "postgres"
    db_port: int = 5432
    db_name: str = "kiwikids"
    db_user: str = "kiwikids_runtime"
    db_password_file: str = "/run/secrets/runtime_db_password"

    model_config = SettingsConfigDict(
        env_prefix="KIWIKIDS_",
        case_sensitive=False,
    )

    def database_password(self) -> str:
        secret_path = Path(self.db_password_file)

        if not secret_path.is_file():
            raise RuntimeError(
                f"Database secret file not found: {self.db_password_file}"
            )

        return secret_path.read_text(encoding="utf-8").strip()


@lru_cache
def get_settings() -> Settings:
    return Settings()
