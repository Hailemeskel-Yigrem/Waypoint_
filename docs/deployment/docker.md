# Docker Deployment

## Compose stack

```bash
docker compose up --build
```

Services:

| Service  | Role                        | Host port |
| -------- | --------------------------- | --------- |
| postgres | Primary database            | 5432      |
| redis    | Queue / cache               | 6379      |
| api      | Fastify API (`target: api`) | 3000      |
| worker   | Background jobs             | —         |
| web      | Admin console (Vite dev)    | 5173      |
| portal   | Employee portal (Vite dev)  | 5174      |

Set `JWT_SECRET` in Compose (defaults to a local development value). Production deployments must override secrets and disable volume-mounted frontend dev servers.

## Multi-stage image

The root `Dockerfile` builds production targets:

```bash
docker build --target api -t waypoint-api .
docker build --target worker -t waypoint-worker .
```

## Lightweight API smoke image

`Dockerfile.verify` packages a prebuilt `apps/api/dist` with runtime npm dependencies. Use it when you already built the API locally and want a fast container smoke check:

```bash
pnpm --filter @waypoint/api build
docker build -f Dockerfile.verify -t waypoint-api:verify .
docker run --rm -p 3000:3000 \
  -e JWT_SECRET=waypoint-dev-secret-key \
  -e PORT=3000 \
  -e HOST=0.0.0.0 \
  waypoint-api:verify
```

Then call `GET /api/v1/health` and `GET /api/v1/health/ready`.
