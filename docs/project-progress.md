# KiwiKids NZ — Project Progress

## Current Status

Current phase: Day 9 COMPLETE — ready for Day 10
Core roadmap: 15-day MVP plan
Current Git checkpoint: f40b937

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
- /ece/compare

Frontend validation:

- npm lint passes
- npm production build passes

Current frontend data state:

- ECE listing/detail pages use the real FastAPI API
- Auckland discovery now includes official Ministry of Education ECE data
- unknown age ranges remain explicitly unknown rather than fabricated

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

### Day 8 — COMPLETE

- mobile ECE discovery QA
- collapsible mobile filter panel
- improved comparison controls
- improved sticky comparison bar
- loading skeleton aligned with real page layout
- empty-result state verified
- backend-unavailable error state verified
- responsive comparison flow verified
- accessibility status messaging retained

## Segment 3 — Data, Automation and AI
Day 9–11

### Day 9 — COMPLETE

- integrated official Ministry of Education ECE directory data
- official dataset schema inspected before ingestion
- Ministry API pagination implemented
- data normalization and validation implemented
- Auckland Region filtering implemented
- 1,414 official Auckland ECE services imported
- deterministic provider-based slugs
- unique provider-code based PostgreSQL UPSERT
- transactional database import
- dry-run mode with zero database writes
- dedicated kiwikids_ingest LOGIN role
- ingestion role restricted to SELECT, INSERT and UPDATE
- DELETE and TRUNCATE explicitly denied
- ingestion database secret stored outside Git
- non-root ingestion container
- Ministry unknown age ranges represented as NULL
- frontend handles unknown age ranges safely
- Alembic migration 1ac48bf1617e applied
- Ministry integration automated tests added
- backend tests passing
- frontend lint and production build passing

### Day 10 — COMPLETE

- self-hosted n8n 2.34.6 deployed locally
- n8n bound to host loopback only
- SSH tunnel used for secure browser access
- dedicated n8n encryption key stored outside Git
- unverified community packages disabled
- secure internal sync-runner service added
- sync-runner has no published host port
- sync-runner uses dedicated kiwikids_ingest database role
- token-authenticated internal sync endpoint implemented
- concurrent ECE sync protection implemented
- Ministry ECE synchronization orchestrated through n8n
- nightly 02:30 Pacific/Auckland Schedule Trigger configured
- manual trigger retained for controlled testing
- HTTP Request credential stored through n8n credential management
- ECE service-count data-quality gate implemented before database writes
- successful synchronization verified with 1,414 Auckland ECE services
- reliable processed-row count returned after successful UPSERT
- IF-based success and failure workflow branches implemented
- dedicated n8n Error Trigger workflow implemented and linked
- controlled scheduled failure test successfully triggered error workflow
- n8n execution history provides initial workflow audit/diagnostic visibility
- backend sync-runner automated tests added

### Day 11 — COMPLETE

- deterministic explainable ECE recommendation engine implemented
- recommendation scores normalised against applicable preferences
- suburb preference scoring implemented
- 20 Hours ECE preference scoring implemented
- service-type preference scoring implemented
- minimum licensed-capacity preference scoring implemented
- data-completeness scoring implemented
- unknown Ministry data handled explicitly without fabricated values
- canonical Ministry ECE service-type mapping implemented
- friendly service-type aliases supported
- Haversine distance calculation implemented
- distance-aware recommendation scoring implemented
- precise location and suburb scoring protected from double-counting
- browser current-location permission flow implemented
- manual latitude and longitude entry removed from normal user experience
- suburb matching retained as fallback when location is unavailable
- recommendation API endpoint added
- full Auckland recommendation pool of 1,414 active ECE services ranked
- transparent per-factor match explanations returned by API
- responsive recommendation page implemented
- match percentage and explainability UI implemented
- current-location based ranking verified in production-mode frontend
- recommendation automated tests added
- backend test suite passing with 18 tests
- frontend lint passing
- frontend production build passing

### Day 12 — NEXT

- GitHub Actions CI
- backend automated test workflow
- frontend lint and production build workflow
- secret scanning
- dependency vulnerability scanning
- SAST
- Docker image build
- container vulnerability scanning
- SBOM generation

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

Start Day 12.

First objective:

Implement a GitHub Actions based CI pipeline for backend tests, frontend lint/build, security scanning, container validation and software supply-chain checks before introducing automated deployment.
