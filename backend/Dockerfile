FROM python:3.14-alpine@sha256:05b2b8b732ecd268fee8727a369f936f022d1321b59befd13c30ede22769dcdc

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Patch Alpine base packages
RUN apk upgrade --no-cache

# Dedicated non-root runtime user
RUN addgroup -S -g 10001 appgroup \
    && adduser -S -D -H -u 10001 -G appgroup appuser

# Install only production/runtime Python dependencies
COPY backend/requirements.runtime.txt ./requirements.runtime.txt

RUN python -m pip install \
    --no-cache-dir \
    --requirement requirements.runtime.txt

# Application files
COPY --chown=10001:10001 backend/app ./app
COPY --chown=10001:10001 backend/alembic.ini ./alembic.ini
COPY --chown=10001:10001 backend/migrations ./migrations

USER 10001:10001

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
