# Troubleshooting

## API will not start

- Confirm `DATABASE_URL` and `JWT_SECRET`
- Check port 3000 availability

## Worker not processing jobs

- Confirm Redis is reachable
- Inspect worker logs for failed job payloads

## Frontend blank page

- Verify `VITE_API_URL`
- Check browser console for CORS failures
