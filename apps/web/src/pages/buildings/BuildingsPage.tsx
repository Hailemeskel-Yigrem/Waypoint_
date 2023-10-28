import { PageHeader } from '@waypoint/ui';
import styles from './BuildingsPage.module.css';

export function BuildingsPage() {
  return (
    <div className={styles.page}>
      <PageHeader title="Buildings" subtitle="Manage office buildings and timezones" />
      <section className={styles.content}>
        <p>Operational controls for buildings in the Waypoint admin console.</p>
      </section>
    </div>
  );
}

export default BuildingsPage;
