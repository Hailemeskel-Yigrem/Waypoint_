# Security Policy

## Supported versions

Security fixes are applied on the `main` branch for the current release line.

## Reporting a vulnerability

Report security issues privately to the maintainers listed in the repository history.
Include steps to reproduce, impact, and any relevant logs (with secrets redacted).

Do not open public GitHub issues for vulnerabilities that expose user data, authentication
bypass, or remote code execution.

## Local development secrets

Never commit `.env` files. Use `.env.example` as a template and generate strong values for
`JWT_SECRET` (at least 16 characters) before running the API.
