# KiwiKids NZ - Product Requirements Document

## 1. Product Vision

KiwiKids NZ is a New Zealand-focused digital platform designed to help families navigate a child's journey from birth through Year 13.

The platform will help parents discover, compare, plan, and make informed decisions about:

- Early childhood education
- Schools
- School transitions
- Activities
- Holiday programmes
- Education pathways
- Family-related services

## 2. Target Users

### Primary Users
- Parents and caregivers in New Zealand
- New migrant families
- Families relocating within New Zealand

### Future Users
- Education providers
- Activity providers
- Schools and ECE services
- Administrators

## 3. Product Scope

### Life Stages

- Birth to 2 years
- Early childhood: 2-5 years
- Starting school: 4-6 years
- Primary school
- Intermediate school
- Secondary school / Year 9-13

## 4. V1 Scope

V1 will focus on early childhood and starting-school discovery.

### Core Features

1. Professional responsive homepage
2. ECE search
3. Location-based filtering
4. ECE service detail pages
5. Map view
6. Save favourites
7. Compare services
8. ECE funding and cost information
9. Government data integration
10. Mobile-friendly experience
11. Basic user preferences
12. Clear data-source and update information

## 5. Future Product Modules

### V2
- School finder
- School comparison
- School zone information
- Starting-school checklist

### V3
- Kids activities
- Holiday programmes
- Weekend activity discovery

### V4
- Intermediate and secondary school modules
- Subject and pathway planning

### V5
- AI parent assistant
- Natural-language search
- Personalised recommendations

### V6
- Provider portal
- Commercial listings
- Analytics
- Monetisation

## 6. Data Science and AI

Planned capabilities:

- Recommendation engine
- Explainable match scoring
- Location-aware ranking
- Preference-based ranking
- Natural-language search
- Recommendation quality monitoring
- Usage analytics
- Provider/activity recommendation

Example query:

"Find childcare near Onehunga suitable for my 3-year-old and convenient for my commute to Newmarket."

The system should extract:

- Child age
- Home location
- Work location
- Service type
- Distance preference
- Schedule requirements

and rank relevant services.

## 7. Security and Privacy Requirements

Security is a top product requirement.

Principles:

- Privacy by design
- Data minimisation
- Least privilege
- Secure authentication
- Secure session management
- Encryption in transit
- Secure secrets management
- No secrets committed to Git
- Secure CI/CD
- Dependency scanning
- SAST
- Container scanning
- SBOM generation
- Audit logging
- Rate limiting
- Secure backups
- Restore testing

Sensitive child data will not be collected unless absolutely necessary.

V1 will avoid:

- Child photographs
- Health information
- Exact school attendance data
- Unnecessary date-of-birth storage
- Sensitive profiling

## 8. Availability and Resilience

The system should be designed for:

- Reliable service delivery
- Health checks
- Graceful failure
- Backup and recovery
- Future load balancing
- Future application redundancy
- Future PostgreSQL HA
- Monitoring and alerting

Single-node local development must not be described as highly available.

## 9. Database Requirements

PostgreSQL will use:

- Dedicated persistent storage
- Least-privilege roles
- Network restrictions
- TLS
- Automated backups
- Backup retention
- Restore validation
- Future PITR
- Future replication
- Monitoring

## 10. Automation

n8n will be used for:

- Scheduled data synchronisation
- Notifications
- Data-quality workflows
- External API integration
- Provider workflows
- Operational automation

Core business logic must remain in the backend application.

## 11. Commercial Model

Parents should initially use core discovery functionality for free.

Future monetisation may include:

- Featured provider listings
- Sponsored listings
- Provider subscriptions
- Activity booking commissions
- Provider analytics
- Premium provider profiles

Sponsored content must always be clearly labelled.

## 12. Success Criteria for V1

V1 is successful when a parent can:

1. Open the website
2. Enter a location
3. Search ECE services
4. Filter results
5. Open a service profile
6. View the service on a map
7. Save services
8. Compare services
9. Understand the source and freshness of the data

## 13. Engineering Goals

The project must demonstrate:

- Product thinking
- Cloud architecture
- DevOps
- DevSecOps
- Infrastructure as Code
- CI/CD
- Observability
- Secure database engineering
- Automation
- Data engineering
- AI/data science
- FinOps
- Production-grade documentation

## 14. Guiding Principle

Build for real users.

Design for scale.

Secure by default.

Automate wherever practical.

Pay for scale only when scale is needed.
