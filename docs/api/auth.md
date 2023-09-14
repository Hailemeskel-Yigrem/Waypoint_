# Authentication

- `POST /v1/auth/login` — email/password → access + refresh tokens
- `POST /v1/auth/refresh` — rotate access token
- `POST /v1/auth/logout` — revoke refresh token

Passwords are hashed with bcrypt/argon2 via `@waypoint/auth`.
