import { PageHeader } from '@waypoint/ui';
import styles from './CheckInsPage.module.css';

export function CheckInsPage() {
  return (
    <div className={styles.page}>
      <PageHeader title="CheckIns" subtitle="Monitor booking check-ins" />
      <section className={styles.content}>
        <p>Operational controls for checkins in the Waypoint admin console.</p>
      </section>
    </div>
  );
}

export default CheckInsPage;
