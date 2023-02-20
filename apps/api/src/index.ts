import { buildApp } from './app.js';
import { loadConfig } from './config/index.js';

async function main(): Promise<void> {
  const config = loadConfig();
  const app = await buildApp({ config });

  try {
    await app.listen({ port: config.PORT, host: config.HOST });
    app.log.info(`Waypoint API listening on ${config.HOST}:${config.PORT}`);
  } catch (err) {
    app.log.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

main();
