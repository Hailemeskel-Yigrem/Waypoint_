import { PageHeader } from '@waypoint/ui';
import styles from './ShiftsPage.module.css';

export function ShiftsPage() {
  return (
    <div className={styles.page}>
      <PageHeader title="Shifts" subtitle="Plan workplace shifts" />
      <section className={styles.content}>
        <p>Operational controls for shifts in the Waypoint admin console.</p>
      </section>
    </div>
  );
}

export default ShiftsPage;
