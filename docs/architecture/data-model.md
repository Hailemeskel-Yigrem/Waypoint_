# Data Model

Core entities: Organization, User, Building, Floor, Zone, Space, Desk, Booking, Visitor, Amenity,
AccessPolicy, Notification, Invoice, AuditEvent.

Relationships are enforced in application services and PostgreSQL foreign keys.
Soft-delete / archive is preferred over hard deletes for operational entities.
