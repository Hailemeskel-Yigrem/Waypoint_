import { PageHeader } from '@waypoint/ui';
import styles from './AuditPage.module.css';

export function AuditPage() {
  return (
    <div className={styles.page}>
      <PageHeader title="Audit" subtitle="Review immutable audit events" />
      <section className={styles.content}>
        <p>Operational controls for audit in the Waypoint admin console.</p>
      </section>
    </div>
  );
}

export default AuditPage;
