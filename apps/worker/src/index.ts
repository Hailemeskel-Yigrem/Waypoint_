import { startWorker } from './worker.js';

const main = async () => {
  const { stop } = await startWorker();
  process.on('SIGINT', () => void stop().then(() => process.exit(0)));
  process.on('SIGTERM', () => void stop().then(() => process.exit(0)));
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
