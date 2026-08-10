# KiwiKids NZ - Architecture Overview

## Product Vision

KiwiKids NZ is a New Zealand-focused family technology platform designed to support parents from birth through Year 13.

Core areas:

- Early Childhood Education
- School discovery
- School comparison
- School transition
- Kids activities
- Holiday programmes
- Family planning tools
- AI-assisted discovery
- Data-driven recommendations

## Initial V1 Scope

V1 will focus on:

1. Professional responsive homepage
2. ECE search
3. ECE profile/details
4. Filters
5. Map-based discovery
6. Save favourites
7. Compare ECE services
8. ECE funding/cost information
9. NZ government data integration
10. Production-ready deployment foundation

## Technology Stack

### Frontend
- Next.js
- TypeScript

### Backend
- Python
- FastAPI

### Database
- PostgreSQL

### Cache
- Redis when required

### Automation
- Self-hosted n8n

### Containers
- Docker
- Docker Compose

### Infrastructure
- Local VirtualBox lab initially
- Terraform
- Azure later

### Edge / DNS
- Cloudflare

### CI/CD
- GitHub Actions

### Observability
- OpenTelemetry
- Prometheus
- Grafana
- Centralised logging

## DevSecOps Principles

- Security by design
- Least privilege
- SSH key authentication
- No root SSH access
- Secrets never committed to Git
- SAST
- Dependency scanning
- Secret scanning
- Container scanning
- SBOM
- Build provenance
- IaC scanning
- CI/CD security gates

## Database Requirements

PostgreSQL must support:

- Dedicated persistent storage
- Restricted network access
- Least privilege database roles
- Encryption in transit
- Automated backups
- Backup retention policy
- Restore testing
- Point-in-time recovery strategy
- Database monitoring
- Future replication
- Future high availability

## Network Requirements

Initial:

Cloudflare
    |
Application Edge
    |
Frontend / Backend
    |
Internal Service Network
    |
PostgreSQL / n8n / Monitoring

Future HA architecture:

Cloudflare
    |
Load Balancer
    |
+------------+
|            |
App Node 1   App Node 2
|            |
+-----+------+
      |
PostgreSQL HA
Primary <-> Replica
      |
Backup / PITR

Database services must never be directly exposed to the public Internet.

## n8n Role

n8n is an automation and integration layer.

Examples:

- Government data synchronisation
- Email notifications
- Scheduled workflows
- Provider workflows
- Data quality alerts
- Parent reminders
- External API orchestration

Core application business logic will remain in FastAPI.

## Data Science and AI

Future components include:

- Childcare/service ranking
- Personalised recommendations
- Explainable match scoring
- Natural-language search
- Location-based ranking
- Activity recommendations
- User behaviour analytics
- Recommendation quality monitoring

Example:

Parent query:
"Find childcare near Onehunga suitable for my 3-year-old and convenient for my commute to Newmarket."

The system will extract preferences and rank appropriate services.

## Environments

Local Development
      |
      v
DEV
      |
      v
STAGING
      |
      v
PRODUCTION

Production will eventually be hosted in Azure.

## Cost Strategy

Production-grade technology without unnecessary initial OPEX.

Principles:

- Build locally first
- Use open-source tooling where appropriate
- Deploy cloud resources only when required
- Right-size infrastructure
- Scale on demand
- Monitor cloud spend
- Introduce managed services when justified

## Project Philosophy

Design for scale now.
Pay for scale only when needed.
