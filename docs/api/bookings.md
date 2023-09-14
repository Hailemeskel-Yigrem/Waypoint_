# Bookings API

Bookings reserve desks or spaces for a time range.

Business rules:

- No overlapping active bookings for the same resource
- End must be after start
- Capacity pools enforce seat limits
- Cancellations emit notification jobs
