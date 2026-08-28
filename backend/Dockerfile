# syntax=docker/dockerfile:1

FROM python:3.14-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN groupadd --system --gid 10001 appgroup \
    && useradd \
        --system \
        --uid 10001 \
        --gid appgroup \
        --home-dir /nonexistent \
        --shell /usr/sbin/nologin \
        appuser

COPY backend/requirements.runtime.txt ./requirements.runtime.txt

RUN python -m pip install \
    --no-cache-dir \
    --requirement requirements.runtime.txt

COPY --chown=10001:10001 backend/app ./app
COPY --chown=10001:10001 backend/alembic.ini ./alembic.ini
COPY --chown=10001:10001 backend/migrations ./migrations

USER 10001:10001

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
