import { PageHeader } from '@waypoint/ui';
import styles from './ReportsPage.module.css';

export function ReportsPage() {
  return (
    <div className={styles.page}>
      <PageHeader title="Reports" subtitle="Generate workplace reports" />
      <section className={styles.content}>
        <p>Operational controls for reports in the Waypoint admin console.</p>
      </section>
    </div>
  );
}

export default ReportsPage;
