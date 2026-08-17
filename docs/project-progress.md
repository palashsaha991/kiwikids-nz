# KiwiKids NZ — Project Progress

## Current Status

Current phase: Day 7 COMPLETE — ready for Day 8
Core roadmap: 15-day MVP plan
Current Git checkpoint: 61f5f34

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

- 0dcdfb5 feat(backend): add secure ECE database migrations and API
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

Current frontend data state:

- ECE UI still uses mock/frontend data
- Day 5 will replace mock listing/detail data with the real FastAPI ECE API

---

## Backend

Technology:

- Python 3.14
- FastAPI
- Uvicorn
- Pydantic Settings
- Psycopg 3
- SQLAlchemy 2
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
- lazy SQLAlchemy engine/session creation
- ECE SQLAlchemy model
- ECE repository layer
- ECE Pydantic response schema
- versioned API router
- ECE list API
- ECE detail-by-slug API
- duplicate-safe development seed script
- Docker image
- non-root API container

Tests:

3 tests passing

API routes currently verified:

- GET /health → 200 OK
- GET /ready → 200 OK with live PostgreSQL check
- GET /api/v1/ece → 200 OK with real database records
- GET /api/v1/ece/{slug} → 200 OK for an existing service

---

# Segment 2 — Real Product
## Day 4 — COMPLETE

Day 4 objectives completed:

- dedicated migration credential
- Alembic configuration
- SQLAlchemy database layer
- ECE database model
- first migration
- initial ECE API

### Migration security

Roles:

#### kiwikids_admin

NOLOGIN ownership role.

Owns:

- kiwikids database
- app schema

#### kiwikids_runtime

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

CREATE TABLE app.should_fail_again(id int);

Result:

permission denied for schema app

#### kiwikids_migration

NOLOGIN migration privilege role.

#### kiwikids_migrator

Dedicated LOGIN migration credential.

Properties:

- non-superuser
- no database creation
- no role creation
- no replication
- no bypass RLS
- explicit database CONNECT
- controlled SET ROLE path for Alembic schema ownership operations

Migration secret is stored outside Git and mounted only into the migration tool container.

### Alembic

Alembic initialized under:

backend/migrations

First migration:

356521117ff6_create_ece_services.py

Verified database state:

356521117ff6 (head)

Migration creates:

app.ece_services

The generated migration was reviewed before application.

### ECE database model

The ECE model includes:

- UUID primary key
- unique slug
- unique nullable provider code
- service name and type
- description
- address/suburb/city/region/postcode
- latitude/longitude
- minimum and maximum ages
- licensed places
- 20 Hours ECE participation state
- controlled availability status
- ERO/source URLs
- source freshness timestamp
- active state
- created/updated timestamps

Database validation includes:

- valid latitude range
- valid longitude range
- non-negative minimum age
- maximum age cannot be below minimum age
- licensed places must be positive when supplied
- controlled availability values

Purposeful indexes:

- name lookup
- active + availability
- active + region + suburb + service type discovery

### Seed data

Development-only ECE seed script:

backend/scripts/seed_ece.py

Verified behavior:

First run:

- inserted=3
- skipped=0

Second run:

- inserted=0
- skipped=3

The script is duplicate-safe and the sample records are explicitly development data, not official NZ education data.

### End-to-end verification

Verified request path:

FastAPI → SQLAlchemy → kiwikids_runtime → PostgreSQL → app.ece_services

Successful API result:

- ECE list returns database-backed records
- detail-by-slug returns the correct ECE record
- runtime user retains least-privilege schema restrictions

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

Database owner:

kiwikids_admin

Application schema:

app

Schema owner:

kiwikids_admin

Public schema CREATE privilege revoked from PUBLIC.

Runtime role receives only the privileges required for application data access.

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

API and migration containers run as non-root user 10001.

---

## Local Compose Architecture

Services:

- kiwikids-postgres
- kiwikids-api
- kiwikids-migrate (tools profile)

Networks:

### kiwikids-app

Application-facing Docker bridge network.

### kiwikids-data

Internal-only Docker network.

PostgreSQL is connected only to kiwikids-data.

FastAPI is connected to:

- kiwikids-app
- kiwikids-data

Migration tooling is connected only to the data network.

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
- migration_db_password

Secrets are never committed to repository.

FastAPI runtime secret and migration secret are exposed only to the services that require them.

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

### Day 4 — COMPLETE

- dedicated migration credential
- Alembic configuration
- SQLAlchemy database layer
- ECE database model
- first migration
- initial ECE API

### Day 5 — COMPLETE

- connected Next.js /ece to real FastAPI data
- connected /ece/[slug] to real FastAPI detail data
- removed mock ECE data from the live product path
- added loading state
- added custom not-found state
- retained API failure and empty-result handling

### Day 6 — COMPLETE

- database-backed text search
- service type filtering
- availability filtering
- 20 Hours ECE filtering
- child-age matching
- sorting by name and capacity
- paginated API contract with items, total, limit and offset
- URL-driven shareable frontend filters
- Previous / Next pagination
- Showing X-Y of Z result state
- invalid and out-of-range page normalization
- filter state preserved during sorting and pagination

### Day 7 — COMPLETE

- persistent ECE favourites using local browser storage
- persistent compare selection using local browser storage
- compare limit of three services
- sticky comparison bar
- dedicated /ece/compare page
- side-by-side comparison of location, age range, capacity, funding and availability
- remove individual services from comparison
- clear comparison flow
- stale or invalid comparison entries handled safely
- accessible button states and status messaging
- development origins moved to environment configuration

### Day 8

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

Start Day 8.

First objective:

Polish the complete ECE discovery flow with mobile/responsive QA, loading, error and empty states, accessibility review and final product-flow refinement.
