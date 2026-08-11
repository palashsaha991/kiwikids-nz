# KiwiKids NZ — Project Progress

## Current Status

Current phase: Day 4 preparation  
Core roadmap: 15-day MVP plan  
Current Git checkpoint: 8071423

---

## Project Goal

KiwiKids NZ is a New Zealand family and education discovery platform covering:

- Birth
- Early Childhood Education
- Primary School
- Intermediate School
- High School / Year 13

Primary objective:

Build a real commercial-grade product while demonstrating:

- DevOps
- DevSecOps
- Infrastructure Engineering
- Cloud Engineering
- Security Engineering
- Backend/API Engineering
- Data Engineering
- AI / Data Science

---

# Segment 1 — Foundation
## Day 1–3 — COMPLETE

### Repository

GitHub repository:

palashsaha991/kiwikids-nz

Current major commits:

- 8071423 feat(platform): add secure FastAPI and PostgreSQL local stack
- e60c7f0 feat(backend): initialize FastAPI application and test foundation
- 22775b3 feat(frontend): add ECE search and service detail experience
- e6c14d5 refactor(frontend): introduce reusable header and commercial homepage structure
- f757b71 feat(frontend): add responsive navigation and design system foundation
- 95942ad feat(frontend): initialize KiwiKids NZ landing experience

---

## Frontend

Technology:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

Implemented:

- KiwiKids NZ homepage
- responsive navigation
- reusable SiteHeader
- commercial design-system foundation
- ECE discovery page
- filter sidebar
- service cards
- dynamic ECE detail route
- responsive layout
- accessibility baseline

Routes:

- /
- /ece
- /ece/[slug]

Frontend validation:

- npm lint passes
- npm production build passes

---

## Backend

Technology:

- Python 3.14
- FastAPI
- Uvicorn
- Pydantic Settings
- Psycopg 3
- SQLAlchemy
- Alembic
- pytest

Implemented:

- Python package structure
- pyproject.toml
- dependency lock
- dependency vulnerability audit
- FastAPI application
- /health endpoint
- /ready endpoint
- database-aware readiness
- unit tests
- Docker image
- non-root API container

Tests:

3 tests passing

---

## PostgreSQL

Version:

PostgreSQL 17

Storage:

Dedicated LVM logical volume:

- postgres-lv
- 16 GB
- mount: /srv/postgresql

Persistent database path:

/srv/postgresql/data

Authentication:

SCRAM-SHA-256

Database:

kiwikids

Roles:

### kiwikids_app
Bootstrap PostgreSQL superuser.

Must NOT be used by application runtime.

### kiwikids_admin
NOLOGIN ownership role.

Owns:

- kiwikids database
- app schema

### kiwikids_runtime
FastAPI runtime role.

Properties:

- LOGIN
- NOSUPERUSER
- NOCREATEDB
- NOCREATEROLE
- NOREPLICATION
- NOBYPASSRLS

Runtime role cannot create tables.

Negative security test confirmed:

CREATE TABLE app.should_fail...

Result:

permission denied for schema app

### kiwikids_migration
NOLOGIN migration privilege role.

Planned for Alembic migration access.

---

## Database Schema Security

Database owner:

kiwikids_admin

Application schema:

app

Schema owner:

kiwikids_admin

Runtime role:

USAGE on app schema

Default future table privileges:

- SELECT
- INSERT
- UPDATE
- DELETE

Default future sequence privileges:

- USAGE
- SELECT

Public schema CREATE privilege revoked from PUBLIC.

---

## Docker

Docker installed from official Docker repository.

Docker data stored on dedicated LVM:

/var/lib/docker

Docker daemon:

- log rotation enabled
- live-restore enabled

devops user is intentionally NOT in docker group.

Docker commands currently run with sudo.

---

## Local Compose Architecture

Services:

- kiwikids-postgres
- kiwikids-api

Networks:

### kiwikids-app
Application-facing Docker bridge network.

### kiwikids-data
Internal-only Docker network.

PostgreSQL is connected only to kiwikids-data.

FastAPI is connected to:

- kiwikids-app
- kiwikids-data

PostgreSQL port 5432 is NOT published to host or LAN.

FastAPI port:

127.0.0.1:8000

---

## Secrets

Secrets are stored outside Git:

/srv/kiwikids-secrets

Current secrets:

- postgres_password
- runtime_db_password

Secrets are never committed to repository.

FastAPI runtime secret is readable only through controlled filesystem permissions.

---

## Health Checks

FastAPI:

GET /health

Returns:

200 OK

GET /ready

Performs real PostgreSQL connectivity check.

Current result:

200 OK

database available

PostgreSQL container healthcheck:

pg_isready

Current status:

healthy

---

## Backup Baseline

Backup directory:

/srv/postgresql-backups

Validated backup:

kiwikids_day3.dump

Format:

PostgreSQL custom format

Permissions:

600

Backup validated using matching PostgreSQL 17 container image and pg_restore --list.

Important:

This is currently same-host storage.

It is NOT considered final disaster recovery.

Future:

- dedicated backup volume
- off-host backup
- Azure Blob
- retention policy
- automated restore testing
- PITR

---

# Security Principles

Security and current industry best practices take priority over convenience.

Requirements:

- no secrets in Git
- least privilege
- non-root containers
- private database networking
- SCRAM authentication
- dependency scanning
- image pinning
- backup validation
- secure CI/CD
- infrastructure as code
- observability
- controlled migration permissions

---

# 15-Day Core Roadmap

## Segment 1 — Foundation
Day 1–3

COMPLETE

## Segment 2 — Real Product
Day 4–8

Day 4:
- dedicated migration credential
- Alembic configuration
- SQLAlchemy database layer
- ECE database model
- first migration
- initial ECE API

Day 5:
- ECE listing/detail APIs
- real frontend API integration

Day 6:
- search
- filters
- sorting
- pagination
- location model

Day 7:
- favourites
- compare
- validation
- UX states

Day 8:
- product flow polish
- mobile/responsive QA
- loading/error/empty states

## Segment 3 — Data, Automation and AI
Day 9–11

- NZ government education data integration
- n8n automation
- scheduled data sync
- data quality workflows
- recommendation scoring
- preference matching
- explainability
- analytics foundation

## Segment 4 — DevSecOps, Cloud and Launch
Day 12–15

- GitHub Actions
- tests
- SAST
- secret scanning
- dependency scanning
- container scanning
- SBOM
- observability
- backup automation
- Terraform
- Azure deployment
- Cloudflare
- TLS
- production hardening
- documentation
- final portfolio launch

---

# Post-Core Platform Expansion

Only after Day 15 core MVP is complete.

Possible platforms:

- on-prem Kubernetes
- Helm
- Rancher
- AKS
- Azure
- Docker Swarm
- Argo CD / GitOps

Do not interrupt the core 15-day roadmap for these.

---

# Documentation and Portfolio

Documentation is a required project deliverable.

Maintain:

- docs/architecture.md
- docs/product-requirements.md
- docs/project-progress.md
- root README

Portfolio publishing:

- LinkedIn milestone posts
- Medium segment articles
- final technical case study

Posts should explain:

- problem
- architecture
- engineering decisions
- security decisions
- implementation
- tradeoffs
- evidence
- GitHub project

---

# Exact Next Step

Start Day 4.

First objective:

Create a dedicated migration credential and configure Alembic so database schema changes are version-controlled and separated from FastAPI runtime permissions.
