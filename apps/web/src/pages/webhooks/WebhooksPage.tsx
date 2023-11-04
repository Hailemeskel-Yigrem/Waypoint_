import { PageHeader } from '@waypoint/ui';
import styles from './WebhooksPage.module.css';

export function WebhooksPage() {
  return (
    <div className={styles.page}>
      <PageHeader title="Webhooks" subtitle="Manage outbound webhook endpoints" />
      <section className={styles.content}>
        <p>Operational controls for webhooks in the Waypoint admin console.</p>
      </section>
    </div>
  );
}

export default WebhooksPage;
